const { Events, ChannelType, PermissionFlagsBits } = require('discord.js');
const { getUserChannelMappings } = require('../services/mappingService');
const { logUserJoin } = require('../services/loggerService');
const { getOrCreatePrivateCategory } = require('../services/categoryService');
const { sendWelcomeMessage } = require('../services/welcomeService');
const DiscordServer = require('../models/DiscordServer');
const DiscordChannel = require('../models/DiscordChannel');

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(member) {
        const guildId = member.guild.id;
        const userId = member.user.id;
        const username = member.user.username;

        console.log(`[GuildMemberAdd] User joined: ${username} (ID: ${userId}) in Guild: ${member.guild.name} (ID: ${guildId})`);

        try {
            // 1. Fetch all channel mappings from MongoDB for this user & guild
            let { serverFound, server, mappedChannels } = await getUserChannelMappings(guildId, userId, username);

            // If server is not yet registered in DB, register it automatically
            if (!serverFound) {
                console.log(`[GuildMemberAdd] Server ID ${guildId} not found in DB. Creating DiscordServer record.`);
                server = new DiscordServer({
                    serverName: member.guild.name,
                    serverId: guildId,
                    description: `Auto-registered on member join`
                });
                await server.save();
                serverFound = true;
            }

            if (mappedChannels && mappedChannels.length > 0) {
                // Ensure 'Private Channels' category exists
                const privateCategory = await getOrCreatePrivateCategory(member.guild);

                // 2. User IS in DB channel mapping(s) -> Loop through ALL mapped channels
                const grantedChannels = [];

                for (const dbChan of mappedChannels) {
                    if (!dbChan.channelName) continue;
                    const sanitizedName = dbChan.channelName.toLowerCase().trim();

                    // Search for existing channel in Discord server by name
                    let existingChannel = member.guild.channels.cache.find(ch =>
                        ch.isTextBased() && ch.name.toLowerCase() === sanitizedName
                    );

                    if (existingChannel) {
                        // Move under 'Private Channels' category if not already under it
                        if (privateCategory && existingChannel.parentId !== privateCategory.id) {
                            try {
                                await existingChannel.setParent(privateCategory.id, { lockPermissions: false });
                            } catch (err) {
                                console.warn(`[GuildMemberAdd] Could not move channel '${sanitizedName}' to Private Channels category:`, err.message);
                            }
                        }

                        // Ensure channel is private (deny @everyone ViewChannel)
                        await existingChannel.permissionOverwrites.create(member.guild.roles.everyone.id, {
                            [PermissionFlagsBits.ViewChannel]: false,
                        });

                        // Grant private access to the joined member
                        await existingChannel.permissionOverwrites.create(member.id, {
                            [PermissionFlagsBits.ViewChannel]: true,
                            [PermissionFlagsBits.SendMessages]: true,
                        });
                        grantedChannels.push(existingChannel.name);
                        console.log(`[GuildMemberAdd] Granted user '${username}' access to existing channel '${existingChannel.name}'`);

                        // Persist discordChannelId if not already saved
                        if (!dbChan.discordChannelId || dbChan.discordChannelId !== existingChannel.id) {
                            await DiscordChannel.findByIdAndUpdate(dbChan._id, { discordChannelId: existingChannel.id });
                        }
                    } else {
                        // Create the private channel in Discord if it doesn't exist yet
                        const overwrites = [
                            {
                                id: member.guild.roles.everyone.id,
                                deny: [PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: member.client.user.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                            },
                            {
                                id: member.id,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                            },
                        ];

                        // Include overwrites for any other members listed in dbChan.members if present in guild
                        if (dbChan.members && Array.isArray(dbChan.members)) {
                            for (const m of dbChan.members) {
                                if (m.userId && m.userId !== member.id) {
                                    const existingMember = member.guild.members.cache.get(m.userId);
                                    if (existingMember) {
                                        overwrites.push({
                                            id: m.userId,
                                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                                        });
                                    }
                                }
                            }
                        }

                        let newChannel;
                        try {
                            newChannel = await member.guild.channels.create({
                                name: sanitizedName,
                                type: ChannelType.GuildText,
                                parent: privateCategory ? privateCategory.id : undefined,
                                permissionOverwrites: overwrites,
                            });
                        } catch (createErr) {
                            // If bot is locked out of the parent category (50013), fall back to creating channel at root level
                            if (createErr.code === 50013 && privateCategory) {
                                console.warn(`[GuildMemberAdd] ⚠️ Bot lacks access to category '${privateCategory.name}'. Creating channel '${sanitizedName}' at root level.`);
                                newChannel = await member.guild.channels.create({
                                    name: sanitizedName,
                                    type: ChannelType.GuildText,
                                    permissionOverwrites: overwrites,
                                });
                            } else {
                                throw createErr;
                            }
                        }

                        grantedChannels.push(newChannel.name);
                        console.log(`[GuildMemberAdd] Created missing private channel '${newChannel.name}' for user '${username}'`);

                        // Persist discordChannelId back to DB
                        await DiscordChannel.findByIdAndUpdate(dbChan._id, { discordChannelId: newChannel.id });

                        await newChannel.send(
                            `Hello ${member}! 🔒 Private channel **${sanitizedName}** has been created according to your database mapping.`
                        );
                    }
                }
            } else {
                // 3. User is NOT in any channel in DB -> Do NOT create any channel, just log
                console.log(`[GuildMemberAdd] User '${username}' was not assigned to any channel in the database. Skipping channel creation.`);
            }

            // 4. Log Join Event to 'change-log' channel
            await logUserJoin(member, mappedChannels);

            // 5. Drop welcome message in 'welcome' channel
            await sendWelcomeMessage(member);

        } catch (error) {
            console.error(`[GuildMemberAdd] Error processing join for ${username}:`, error);
        }
    },
};
