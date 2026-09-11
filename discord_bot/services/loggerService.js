const { EmbedBuilder, ChannelType, PermissionFlagsBits, OverwriteType } = require('discord.js');
const { CHANGE_LOG_CHANNEL, CHANGE_LOG_ALIASES } = require('../channels');
const { getOrCreateAdminCategory } = require('./categoryService');

/**
 * Finds or creates the designated logging text channel ('change-log') in the guild
 * under the 'Admin Channels' category with access strictly restricted to Administrators and the bot.
 * 
 * @param {Guild} guild - Discord Guild instance
 * @returns {Promise<TextChannel|null>}
 */
const getOrCreateLogChannel = async (guild) => {
    try {
        const logChannelName = CHANGE_LOG_CHANNEL;
        const logChannelAliases = CHANGE_LOG_ALIASES;

        // Ensure 'Admin Channels' category exists
        const adminCategory = await getOrCreateAdminCategory(guild);

        // 1. Fetch fresh guild channels to ensure cache is updated
        let guildChannels;
        try {
            guildChannels = await guild.channels.fetch();
        } catch (err) {
            guildChannels = guild.channels.cache;
        }

        // Search for existing log channel
        let logChannel = guildChannels.find(
            ch => ch && ch.isTextBased() && logChannelAliases.includes(ch.name.toLowerCase())
        );

        // 2. Return channel if it already exists (ensuring it is nested under the Admin category)
        if (logChannel) {
            if (adminCategory && logChannel.parentId !== adminCategory.id) {
                try {
                    await logChannel.setParent(adminCategory.id, { lockPermissions: false });
                } catch (err) {
                    console.warn(`[loggerService] Could not move log channel under Admin category:`, err.message);
                }
            }
            return logChannel;
        }

        // 3. If not found, create the log channel with admin-only access
        console.log(`[loggerService] '${logChannelName}' channel not found in guild '${guild.name}'. Creating it now with admin-only access...`);

        // Fetch roles and owner to ensure valid cached structures
        try {
            await guild.roles.fetch();
        } catch (err) {
            // fallback to cache
        }

        let owner = null;
        try {
            owner = await guild.fetchOwner();
        } catch (err) {
            // fallback
        }

        const overwrites = [
            // Deny @everyone access to view channel
            {
                id: guild.roles.everyone.id,
                type: OverwriteType.Role,
                deny: [PermissionFlagsBits.ViewChannel],
            },
            // Allow the bot itself full access to post logs
            {
                id: guild.client.user.id,
                type: OverwriteType.Member,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.EmbedLinks,
                    PermissionFlagsBits.ReadMessageHistory
                ],
            },
        ];

        const addedIds = new Set([guild.roles.everyone.id, guild.client.user.id]);

        // Explicitly allow guild owner
        if (owner && !addedIds.has(owner.id)) {
            overwrites.push({
                id: owner.id,
                type: OverwriteType.Member,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ReadMessageHistory
                ],
            });
            addedIds.add(owner.id);
        }

        // Explicitly allow all administrator roles or roles named 'admin'
        guild.roles.cache.forEach(role => {
            if (
                !addedIds.has(role.id) &&
                role.id !== guild.roles.everyone.id &&
                (role.permissions.has(PermissionFlagsBits.Administrator) ||
                 role.name.toLowerCase().includes('admin'))
            ) {
                overwrites.push({
                    id: role.id,
                    type: OverwriteType.Role,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ],
                });
                addedIds.add(role.id);
            }
        });

        try {
            logChannel = await guild.channels.create({
                name: logChannelName,
                type: ChannelType.GuildText,
                parent: adminCategory ? adminCategory.id : undefined,
                permissionOverwrites: overwrites,
            });
        } catch (createErr) {
            if (createErr.code === 50013 && adminCategory) {
                console.warn(`[loggerService] ⚠️ Bot lacks access to category '${adminCategory.name}'. Creating '${logChannelName}' at root level.`);
                logChannel = await guild.channels.create({
                    name: logChannelName,
                    type: ChannelType.GuildText,
                    permissionOverwrites: overwrites,
                });
            } else {
                throw createErr;
            }
        }

        console.log(`[loggerService] ✅ Created new admin-only log channel '${logChannelName}' (ID: ${logChannel.id}) in guild '${guild.name}'`);

        // Send initialization message to the log channel
        const initEmbed = new EmbedBuilder()
            .setTitle('🔒 Change Log Channel Initialized')
            .setDescription('This channel has been created with Admin-only access to log member join/leave events, channel mappings, and activity.')
            .setColor(0x00AE86)
            .setTimestamp();

        await logChannel.send({ embeds: [initEmbed] });

        return logChannel;
    } catch (error) {
        console.error('[loggerService] Error getting or creating log channel:', error);
        return null;
    }
};

/**
 * Logs user join event details to 'change-log' channel.
 * 
 * @param {GuildMember} member - Joining member
 * @param {Array} mappedChannels - List of mapped channel objects from DB
 */
const logUserJoin = async (member, mappedChannels = []) => {
    try {
        const logChannel = await getOrCreateLogChannel(member.guild);
        if (!logChannel) return;

        const joinTimestamp = member.joinedTimestamp
            ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`
            : new Date().toISOString();

        const hasMappedChannels = mappedChannels && mappedChannels.length > 0;

        const channelListText = hasMappedChannels
            ? mappedChannels.map(ch => `• ${ch.channelName}`).join('\n')
            : 'None (User was not assigned to any channel)';

        const statusMessage = hasMappedChannels
            ? `✅ User mapped to ${mappedChannels.length} channel(s) and access granted.`
            : '⚠️ User was not assigned to any channel in the database. No channel created.';

        const embed = new EmbedBuilder()
            .setTitle('📥 Member Joined Server')
            .setColor(hasMappedChannels ? 0x00FF00 : 0xFFA500) // Green for mapped, Orange for unassigned
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                { name: 'User', value: `${member.user.tag}\n(${member.id})`, inline: true },
                { name: 'Join Time', value: joinTimestamp, inline: true },
                { name: 'Status', value: statusMessage, inline: false },
                { name: 'Assigned Channels in DB', value: channelListText, inline: false }
            )
            .setFooter({ text: `Guild: ${member.guild.name}` })
            .setTimestamp();

        await logChannel.send({ embeds: [embed] });
    } catch (error) {
        console.error('[loggerService] Error logging user join event:', error);
    }
};

/**
 * Logs user leave event details to 'channel-log'.
 * 
 * @param {GuildMember} member - Leaving member
 */
const logUserLeave = async (member) => {
    try {
        const logChannel = await getOrCreateLogChannel(member.guild);
        if (!logChannel) return;

        const leaveTimestamp = `<t:${Math.floor(Date.now() / 1000)}:F>`;

        const embed = new EmbedBuilder()
            .setTitle('📤 Member Left Server')
            .setColor(0xFF0000) // Red
            .setThumbnail(member.user ? member.user.displayAvatarURL() : null)
            .addFields(
                { name: 'User', value: `${member.user ? member.user.tag : 'Unknown User'}\n(${member.id})`, inline: true },
                { name: 'Leave Time', value: leaveTimestamp, inline: true }
            )
            .setFooter({ text: `Guild: ${member.guild.name}` })
            .setTimestamp();

        await logChannel.send({ embeds: [embed] });
    } catch (error) {
        console.error('[loggerService] Error logging user leave event:', error);
    }
};

/**
 * Logs message creation to 'channel-log'.
 * 
 * @param {Message} message - Discord message object
 */
const logMessage = async (message) => {
    try {
        if (!message.guild || message.author.bot) return;

        const logChannel = await getOrCreateLogChannel(message.guild);
        if (!logChannel || message.channel.id === logChannel.id) return; // Prevent infinite loop!

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${message.author.tag} (${message.author.id})`,
                iconURL: message.author.displayAvatarURL()
            })
            .setDescription(message.content || '*[Attachment or Embed]*')
            .addFields(
                { name: 'Channel', value: `${message.channel}`, inline: true }
            )
            .setColor(0x3498DB) // Blue
            .setTimestamp();

        await logChannel.send({ embeds: [embed] });
    } catch (error) {
        console.error('[loggerService] Error logging message:', error);
    }
};

module.exports = {
    getOrCreateLogChannel,
    logUserJoin,
    logUserLeave,
    logMessage
};
