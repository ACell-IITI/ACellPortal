const express = require('express');
const { ChannelType, PermissionFlagsBits } = require('discord.js');
const DiscordServer = require('../models/DiscordServer');
const DiscordChannel = require('../models/DiscordChannel');
const { getOrCreatePrivateCategory } = require('./categoryService');

let discordClient = null;

/**
 * Initializes the sync service with a reference to the Discord client.
 * @param {Client} client - Discord.js client instance
 */
const setClient = (client) => {
    discordClient = client;
};

/**
 * Resolves a Discord Guild from a server MongoDB document ID.
 * Looks up the DiscordServer record to find the Discord guild ID,
 * then fetches the guild from the Discord client cache.
 * 
 * @param {string} serverMongoId - MongoDB _id of the DiscordServer document
 * @returns {Promise<{guild: Guild|null, serverDoc: Object|null}>}
 */
const resolveGuild = async (serverMongoId) => {
    const serverDoc = await DiscordServer.findById(serverMongoId);
    if (!serverDoc) return { guild: null, serverDoc: null };

    let guild = null;
    try {
        guild = await discordClient.guilds.fetch(serverDoc.serverId);
    } catch (err) {
        console.warn(`[syncService] Could not fetch guild for serverId ${serverDoc.serverId}:`, err.message);
    }

    return { guild, serverDoc };
};

/**
 * Handles POST /sync/channel-added
 * Creates the Discord channel corresponding to a newly added DB channel record.
 */
const handleChannelAdded = async (req, res) => {
    try {
        const { channelId } = req.body; // MongoDB _id of the DiscordChannel document
        if (!channelId) return res.status(400).json({ error: 'channelId required' });

        const channelDoc = await DiscordChannel.findById(channelId);
        if (!channelDoc) return res.status(404).json({ error: 'Channel document not found' });

        const { guild } = await resolveGuild(channelDoc.server);
        if (!guild) return res.status(404).json({ error: 'Guild not found for this server' });

        const sanitizedName = (channelDoc.channelName || '').toLowerCase().trim();
        if (!sanitizedName) return res.status(400).json({ error: 'Channel name is empty' });

        // Check if channel already exists in Discord
        const channels = await guild.channels.fetch();
        let existingChannel = channels.find(ch =>
            ch && ch.isTextBased() && ch.name.toLowerCase() === sanitizedName
        );

        if (existingChannel) {
            // Update DB with the existing channel's Discord ID
            channelDoc.discordChannelId = existingChannel.id;
            await channelDoc.save();
            return res.json({ success: true, action: 'already_exists', discordChannelId: existingChannel.id });
        }

        // Create private channel under 'Private Channels' category
        const privateCategory = await getOrCreatePrivateCategory(guild);

        const overwrites = [
            {
                id: guild.roles.everyone.id,
                deny: [PermissionFlagsBits.ViewChannel],
            },
            {
                id: discordClient.user.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
            },
        ];

        // Add permission overwrites for all members listed in the DB channel
        if (channelDoc.members && channelDoc.members.length > 0) {
            for (const m of channelDoc.members) {
                if (m.userId) {
                    try {
                        const member = await guild.members.fetch(m.userId);
                        if (member) {
                            overwrites.push({
                                id: m.userId,
                                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                            });
                        }
                    } catch (e) {
                        // Member not in guild, skip
                    }
                }
            }
        }

        const newChannel = await guild.channels.create({
            name: sanitizedName,
            type: ChannelType.GuildText,
            parent: privateCategory ? privateCategory.id : undefined,
            permissionOverwrites: overwrites,
        });

        // Save Discord channel ID back to DB
        channelDoc.discordChannelId = newChannel.id;
        await channelDoc.save();

        console.log(`[syncService] ✅ Created Discord channel '${sanitizedName}' (${newChannel.id}) via backend sync`);
        res.json({ success: true, action: 'created', discordChannelId: newChannel.id });
    } catch (error) {
        console.error('[syncService] Error in handleChannelAdded:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Handles POST /sync/channel-deleted
 * Deletes the Discord channel matching the given discordChannelId.
 */
const handleChannelDeleted = async (req, res) => {
    try {
        const { serverMongoId, discordChannelId, channelName } = req.body;
        if (!serverMongoId) return res.status(400).json({ error: 'serverMongoId required' });

        const { guild } = await resolveGuild(serverMongoId);
        if (!guild) return res.status(404).json({ error: 'Guild not found' });

        let channel = null;

        // Try to find by Discord channel ID first
        if (discordChannelId) {
            try {
                channel = await guild.channels.fetch(discordChannelId);
            } catch (e) {
                // Channel doesn't exist in Discord, that's fine
            }
        }

        // Fallback: find by name
        if (!channel && channelName) {
            const channels = await guild.channels.fetch();
            channel = channels.find(ch =>
                ch && ch.isTextBased() && ch.name.toLowerCase() === channelName.toLowerCase().trim()
            );
        }

        if (channel) {
            await channel.delete(`Deleted via admin panel sync`);
            console.log(`[syncService] 🗑️ Deleted Discord channel '${channel.name}' (${channel.id}) via backend sync`);
            res.json({ success: true, action: 'deleted' });
        } else {
            res.json({ success: true, action: 'not_found', message: 'Channel was not found in Discord (may have been already deleted)' });
        }
    } catch (error) {
        console.error('[syncService] Error in handleChannelDeleted:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Handles POST /sync/member-added
 * Grants a member access to a specific Discord channel.
 */
const handleMemberAdded = async (req, res) => {
    try {
        const { channelId, userId, username } = req.body;
        if (!channelId) return res.status(400).json({ error: 'channelId required' });

        const channelDoc = await DiscordChannel.findById(channelId);
        if (!channelDoc) return res.status(404).json({ error: 'Channel document not found' });

        const { guild } = await resolveGuild(channelDoc.server);
        if (!guild) return res.status(404).json({ error: 'Guild not found' });

        // Find the Discord channel
        let discordChannel = null;
        if (channelDoc.discordChannelId) {
            try {
                discordChannel = await guild.channels.fetch(channelDoc.discordChannelId);
            } catch (e) { /* not found */ }
        }

        if (!discordChannel && channelDoc.channelName) {
            const channels = await guild.channels.fetch();
            discordChannel = channels.find(ch =>
                ch && ch.isTextBased() && ch.name.toLowerCase() === channelDoc.channelName.toLowerCase().trim()
            );
        }

        if (!discordChannel) {
            return res.json({ success: true, action: 'channel_not_in_discord', message: 'Discord channel not yet created' });
        }

        // Find the guild member by userId
        const targetUserId = userId || username;
        if (!targetUserId) return res.status(400).json({ error: 'userId or username required' });

        let member = null;
        try {
            member = await guild.members.fetch(targetUserId);
        } catch (e) {
            // Try by username search
            if (username) {
                const members = await guild.members.fetch({ query: username, limit: 1 });
                member = members.first();
            }
        }

        if (!member) {
            return res.json({ success: true, action: 'member_not_in_guild', message: 'User is not currently in the Discord server' });
        }

        // Grant permissions
        await discordChannel.permissionOverwrites.create(member.id, {
            [PermissionFlagsBits.ViewChannel]: true,
            [PermissionFlagsBits.SendMessages]: true,
        });

        console.log(`[syncService] ✅ Granted '${member.user.username}' access to #${discordChannel.name} via backend sync`);
        res.json({ success: true, action: 'granted' });
    } catch (error) {
        console.error('[syncService] Error in handleMemberAdded:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Handles POST /sync/member-removed
 * Revokes a member's access to a specific Discord channel.
 */
const handleMemberRemoved = async (req, res) => {
    try {
        const { channelId, userId, username } = req.body;
        if (!channelId) return res.status(400).json({ error: 'channelId required' });

        const channelDoc = await DiscordChannel.findById(channelId);
        if (!channelDoc) return res.status(404).json({ error: 'Channel document not found' });

        const { guild } = await resolveGuild(channelDoc.server);
        if (!guild) return res.status(404).json({ error: 'Guild not found' });

        // Find the Discord channel
        let discordChannel = null;
        if (channelDoc.discordChannelId) {
            try {
                discordChannel = await guild.channels.fetch(channelDoc.discordChannelId);
            } catch (e) { /* not found */ }
        }

        if (!discordChannel && channelDoc.channelName) {
            const channels = await guild.channels.fetch();
            discordChannel = channels.find(ch =>
                ch && ch.isTextBased() && ch.name.toLowerCase() === channelDoc.channelName.toLowerCase().trim()
            );
        }

        if (!discordChannel) {
            return res.json({ success: true, action: 'channel_not_in_discord' });
        }

        // Find the guild member
        const targetUserId = userId || username;
        let member = null;
        try {
            member = await guild.members.fetch(targetUserId);
        } catch (e) {
            if (username) {
                const members = await guild.members.fetch({ query: username, limit: 1 });
                member = members.first();
            }
        }

        if (!member) {
            return res.json({ success: true, action: 'member_not_in_guild' });
        }

        // Revoke permissions
        await discordChannel.permissionOverwrites.delete(member.id, 'Removed via admin panel sync');

        console.log(`[syncService] ✅ Revoked '${member.user.username}' access from #${discordChannel.name} via backend sync`);
        res.json({ success: true, action: 'revoked' });
    } catch (error) {
        console.error('[syncService] Error in handleMemberRemoved:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Handles POST /sync/full-sync
 * Performs a full reconciliation: ensures every DB channel exists in Discord
 * and all members have correct permissions.
 */
const handleFullSync = async (req, res) => {
    try {
        const { serverMongoId } = req.body;

        let serverDocs;
        if (serverMongoId) {
            const doc = await DiscordServer.findById(serverMongoId);
            serverDocs = doc ? [doc] : [];
        } else {
            serverDocs = await DiscordServer.find();
        }

        if (serverDocs.length === 0) {
            return res.json({ success: true, message: 'No servers found in DB' });
        }

        const results = [];

        for (const serverDoc of serverDocs) {
            let guild;
            try {
                guild = await discordClient.guilds.fetch(serverDoc.serverId);
            } catch (e) {
                results.push({ server: serverDoc.serverName, error: `Could not fetch guild: ${e.message}` });
                continue;
            }

            const channelDocs = await DiscordChannel.find({ server: serverDoc._id });
            const privateCategory = await getOrCreatePrivateCategory(guild);
            const guildChannels = await guild.channels.fetch();

            for (const channelDoc of channelDocs) {
                const sanitizedName = (channelDoc.channelName || '').toLowerCase().trim();
                if (!sanitizedName) continue;

                // Find or create the Discord channel
                let discordChannel = null;

                if (channelDoc.discordChannelId) {
                    discordChannel = guildChannels.get(channelDoc.discordChannelId) || null;
                }

                if (!discordChannel) {
                    discordChannel = guildChannels.find(ch =>
                        ch && ch.isTextBased() && ch.name.toLowerCase() === sanitizedName
                    );
                }

                if (!discordChannel) {
                    // Create the channel
                    const overwrites = [
                        {
                            id: guild.roles.everyone.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: discordClient.user.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                    ];

                    discordChannel = await guild.channels.create({
                        name: sanitizedName,
                        type: ChannelType.GuildText,
                        parent: privateCategory ? privateCategory.id : undefined,
                        permissionOverwrites: overwrites,
                    });

                    console.log(`[syncService] Full-sync: Created channel '${sanitizedName}'`);
                }

                // Save Discord channel ID back
                if (!channelDoc.discordChannelId || channelDoc.discordChannelId !== discordChannel.id) {
                    channelDoc.discordChannelId = discordChannel.id;
                    await channelDoc.save();
                }

                // Ensure permissions for all members
                if (channelDoc.members && channelDoc.members.length > 0) {
                    for (const m of channelDoc.members) {
                        if (!m.userId) continue;
                        try {
                            const guildMember = await guild.members.fetch(m.userId);
                            if (guildMember) {
                                await discordChannel.permissionOverwrites.create(guildMember.id, {
                                    [PermissionFlagsBits.ViewChannel]: true,
                                    [PermissionFlagsBits.SendMessages]: true,
                                });
                            }
                        } catch (e) {
                            // Member not in guild, skip
                        }
                    }
                }

                // Move to private category if not already
                if (privateCategory && discordChannel.parentId !== privateCategory.id) {
                    try {
                        await discordChannel.setParent(privateCategory.id, { lockPermissions: false });
                    } catch (e) {
                        // Can't move, skip
                    }
                }

                results.push({ channel: sanitizedName, discordId: discordChannel.id, status: 'synced' });
            }
        }

        console.log(`[syncService] ✅ Full sync complete. ${results.length} channel(s) processed.`);
        res.json({ success: true, results });
    } catch (error) {
        console.error('[syncService] Error in handleFullSync:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Creates and starts the sync HTTP server.
 * @param {Client} client - Discord.js client
 * @param {number} port - Port to listen on
 */
const startSyncServer = (client, port = 3500) => {
    setClient(client);

    const app = express();
    app.use(express.json());

    // Health check
    app.get('/sync/health', (req, res) => {
        res.json({ status: 'ok', bot: client.user ? client.user.tag : 'not ready' });
    });

    // Sync endpoints
    app.post('/sync/channel-added', handleChannelAdded);
    app.post('/sync/channel-deleted', handleChannelDeleted);
    app.post('/sync/member-added', handleMemberAdded);
    app.post('/sync/member-removed', handleMemberRemoved);
    app.post('/sync/full-sync', handleFullSync);

    app.listen(port, () => {
        console.log(`[syncService] 🔄 Sync HTTP server listening on port ${port}`);
    });
};

module.exports = {
    startSyncServer,
    setClient,
};
