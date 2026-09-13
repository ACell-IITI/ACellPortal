import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client, GatewayIntentBits, Events, PermissionsBitField, OverwriteType } from 'discord.js';
import DiscordServer from '../server/models/DiscordServer_model.js';
import DiscordChannel from '../server/models/DiscordChannel_model.js';
import EmailQueue from '../server/models/EmailQueue_model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.MONGODB_LINK) {
    dotenv.config({ path: path.join(__dirname, '../server/.env') });
}

const mongoose = DiscordServer.base;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// ==========================================
// LOOP PREVENTION SYSTEM
// ==========================================
// When Bot makes a change on Discord, Discord fires an event.
// We ignore Discord events for channels in this Set.
const recentBotActions = new Set();

const lockAction = (id) => recentBotActions.add(id);
const unlockAction = (id) => {
    setTimeout(() => recentBotActions.delete(id), 5000); // Unlock after 5s
};

// ==========================================
// PERMISSIONS BUILDER
// ==========================================
function buildPermissionOverwrites(guild, members) {
    const permissionOverwrites = [
        {
            id: guild.roles.everyone.id,
            type: OverwriteType.Role,
            deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
            id: client.user.id,
            type: OverwriteType.Member,
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles],
        }
    ];

    for (const member of members) {
        // Validate Discord Snowflake format (17-20 digits)
        const isValidSnowflake = /^\d{17,20}$/.test(member.userId);

        if (member.userId && isValidSnowflake) {
            const isMentor = member.role === 'mentor';
            const allowFlags = [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages];

            if (isMentor) {
                allowFlags.push(PermissionsBitField.Flags.ManageChannels);
                allowFlags.push(PermissionsBitField.Flags.ManageMessages);
            }

            permissionOverwrites.push({
                id: member.userId,
                type: OverwriteType.Member,
                allow: allowFlags,
            });
        } else if (member.userId) {
            console.log(`⚠️ Skipping invalid User ID format: "${member.userId}" for ${member.username || 'unknown user'}`);
        }
    }
    return permissionOverwrites;
}

// ==========================================
// DB -> DISCORD SYNC (WEBHOOK LISTENER)
// ==========================================
import express from 'express';
const app = express();

app.post('/api/sync', (req, res) => {
    console.log("⚡ Received instant sync trigger from Admin Panel!");
    syncChannels();
    res.sendStatus(200);
});

app.get('/api/invite/:serverId', async (req, res) => {
    try {
        const serverId = req.params.serverId;
        let guild;
        if (serverId && serverId !== 'default' && serverId !== 'undefined') {
            const dbServer = await DiscordServer.findById(serverId);
            if (dbServer) {
                guild = client.guilds.cache.get(dbServer.serverId);
            }
        }
        
        if (!guild) {
            guild = client.guilds.cache.first();
        }
        
        if (!guild) return res.status(404).json({ error: 'No guild found' });

        let channel = guild.systemChannel;
        if (!channel) channel = guild.channels.cache.find(c => c.name.toLowerCase().includes('welcome') && c.type === 0);
        if (!channel) channel = guild.channels.cache.find(c => c.type === 0);

        if (!channel) return res.status(404).json({ error: 'No suitable channel found' });

        const invites = await channel.fetchInvites();
        let invite = invites.find(i => i.inviter && i.inviter.id === client.user.id && i.maxAge === 0);

        if (!invite) {
            invite = await channel.createInvite({ maxAge: 0, maxUses: 0 });
        }

        res.json({ inviteLink: invite.url });
    } catch (err) {
        console.error("Failed to generate invite via webhook:", err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/channels/:id', async (req, res) => {
    try {
        const channelId = req.params.id;
        for (const guild of client.guilds.cache.values()) {
            const channel = guild.channels.cache.get(channelId);
            if (channel) {
                lockAction(channel.id);
                try {
                    await channel.delete();
                } finally {
                    unlockAction(channel.id);
                }
                console.log(`[Webhook] Successfully deleted channel ${channel.name} from Discord.`);
                return res.sendStatus(200);
            }
        }
        res.sendStatus(404);
    } catch (err) {
        console.error("Failed to delete channel via webhook:", err);
        res.status(500).send(err.message);
    }
});

app.listen(3001, '0.0.0.0', () => {
    console.log('🎧 Bot Webhook Listener started on port 3001');
});

// ==========================================
// DISCORD -> DATABASE SYNC (DISCORD EVENTS)
// ==========================================

client.on(Events.GuildMemberAdd, async (member) => {
    try {
        console.log(`[Auto-Onboarding] User joined server: ${member.user.username}`);

        // Find channels where this user is pending
        const channels = await DiscordChannel.find({
            'members.username': member.user.username,
            'members.status': 'pending'
        });

        if (channels.length === 0) {
            console.log(`[Auto-Onboarding] No pending channels found for ${member.user.username}`);
            return;
        }

        console.log(`[Auto-Onboarding] Found ${channels.length} pending channels for ${member.user.username}. Auto-Resolving ID...`);

        // Update DB and re-sync their permissions
        for (const ch of channels) {
            const memberIndex = ch.members.findIndex(m => m.username === member.user.username && m.status === 'pending');
            if (memberIndex !== -1) {
                ch.members[memberIndex].userId = member.user.id;
                ch.members[memberIndex].status = 'joined';
                await ch.save();

                // Trigger Permission Sync
                const discordChannel = member.guild.channels.cache.get(ch.discordChannelId);
                if (discordChannel) {
                    lockAction(discordChannel.id);
                    const permissionOverwrites = buildPermissionOverwrites(member.guild, ch.members);
                    await discordChannel.permissionOverwrites.set(permissionOverwrites);
                    unlockAction(discordChannel.id);
                    console.log(`[Auto-Onboarding] Successfully assigned ${member.user.username} to #${discordChannel.name}`);
                }
            }
        }
    } catch (err) {
        console.error("Error in GuildMemberAdd Auto-Onboarding:", err);
    }
});

client.on(Events.ChannelCreate, async (channel) => {
    if (channel.type !== 0) return;

    // Delay 2000ms to allow DB save, but check BOTH id and name for locks
    setTimeout(async () => {
        if (recentBotActions.has(channel.id) || recentBotActions.has(channel.name)) return;

        const server = await DiscordServer.findOne({ serverId: channel.guild.id });
        if (!server) return;

        const existing = await DiscordChannel.findOne({ discordChannelId: channel.id });
        if (existing) return;

        console.log(`[Discord->DB] Manual channel created: ${channel.name}`);
        await DiscordChannel.create({
            server: server._id,
            channelName: channel.name,
            discordChannelId: channel.id,
            members: []
        });
    }, 2000);
});

client.on(Events.ChannelDelete, async (channel) => {
    if (recentBotActions.has(channel.id) || channel.type !== 0) return;
    console.log(`[Discord->DB] Manual channel deleted: ${channel.name}`);

    await DiscordChannel.findOneAndDelete({ discordChannelId: channel.id });
});

client.on(Events.ChannelUpdate, async (oldChannel, newChannel) => {
    if (recentBotActions.has(newChannel.id) || newChannel.type !== 0) return;

    const dbChannel = await DiscordChannel.findOne({ discordChannelId: newChannel.id });
    if (!dbChannel) return;

    let needsSave = false;

    if (oldChannel.name !== newChannel.name) {
        console.log(`[Discord->DB] Manual name update: ${newChannel.name}`);
        dbChannel.channelName = newChannel.name;
        needsSave = true;
    }

    const membersMap = new Map(); // userId -> role

    newChannel.permissionOverwrites.cache.forEach(overwrite => {
        if (overwrite.type === OverwriteType.Member && overwrite.id !== client.user.id) {
            const hasView = overwrite.allow.has(PermissionsBitField.Flags.ViewChannel);
            if (hasView) {
                const isMentor = overwrite.allow.has(PermissionsBitField.Flags.ManageChannels);
                membersMap.set(overwrite.id, isMentor ? 'mentor' : 'mentee');
            }
        }
    });

    const newMembersList = [];
    for (const [userId, role] of membersMap.entries()) {
        const existingMember = dbChannel.members.find(m => m.userId === userId);
        newMembersList.push({
            userId,
            username: existingMember ? existingMember.username : '',
            email: existingMember ? existingMember.email : '',
            status: existingMember ? existingMember.status : 'joined',
            role
        });
    }

    // Preserve any 'pending' members that Discord doesn't know about yet
    const pendingMembers = dbChannel.members.filter(m => m.status === 'pending');
    for (const pm of pendingMembers) {
        if (!newMembersList.find(m => m.username === pm.username)) {
            newMembersList.push(pm);
        }
    }

    dbChannel.members = newMembersList;
    needsSave = true;

    if (needsSave) {
        console.log(`[Discord->DB] Manual permissions updated for: ${newChannel.name}`);
        await dbChannel.save();
    }
});


// ==========================================
// FALLBACK SYNC (Runs on Startup)
// ==========================================
let isSyncing = false;
let syncQueued = false;

async function syncChannels() {
    if (isSyncing) {
        syncQueued = true;
        console.log('--- Sync already in progress, queuing another sync for later ---');
        return;
    }
    isSyncing = true;
    try {
        console.log('--- Starting Full Channel Sync ---');
        const servers = await DiscordServer.find();

        for (const server of servers) {
            const guild = client.guilds.cache.get(server.serverId);
            if (!guild) continue;

            const dbChannels = await DiscordChannel.find({ server: server._id });

            // Retroactive Auto-Resolve: If a pending user is *already* in the server, resolve them immediately!
            try {
                // Only fetch from API if there are actually pending members to avoid rate limits
                const hasPending = dbChannels.some(ch => ch.members.some(m => m.status === 'pending'));
                if (hasPending) {
                    try { await guild.members.fetch(); } catch (e) { /* ignore rate limits and use local cache */ }
                }

                for (const dbChannel of dbChannels) {
                    let channelModified = false;

                    // 1. Sanitize invalid usernames and user IDs provided via Excel/UI
                    const validMembersMap = new Map();
                    for (const member of dbChannel.members) {
                        let isInvalid = false;

                        if (member.userId && !/^\d{17,20}$/.test(member.userId)) {
                            console.log(`⚠️ Removing invalid User ID from DB: "${member.userId}" for ${member.username}`);
                            isInvalid = true;
                        }

                        if (member.username) {
                            // Discord usernames: 2-32 chars, no spaces, no special characters (except _ and .)
                            const isValidUsername = /^[a-zA-Z0-9_.]{2,32}$/.test(member.username);
                            if (!isValidUsername) {
                                console.log(`⚠️ Removing invalid Discord Username format from DB: "${member.username}"`);
                                isInvalid = true;
                            }
                            // Always store as lowercase since Discord usernames are strictly lowercase now
                            member.username = member.username.toLowerCase();
                        } else if (!member.userId) {
                            isInvalid = true; // No username and no ID is useless
                        }

                        if (isInvalid) {
                            // Delete their email from queue so we don't send rubbish
                            try {
                                if (member.email) {
                                    await EmailQueue.deleteMany({ recipientEmail: member.email, channelName: dbChannel.channelName, status: 'pending' });
                                }
                            } catch (e) { }
                            channelModified = true;
                            continue; // Skip adding to validMembersMap
                        }

                        // Deduplicate members by username, prioritizing the 'mentor' role
                        if (validMembersMap.has(member.username)) {
                            const existing = validMembersMap.get(member.username);
                            if (member.role === 'mentor') {
                                existing.role = 'mentor';
                            }
                            if (!existing.userId && member.userId) {
                                existing.userId = member.userId;
                            }
                            channelModified = true; // Merged a duplicate, so DB changed
                        } else {
                            validMembersMap.set(member.username, member);
                        }
                    }
                    dbChannel.members = Array.from(validMembersMap.values());

                    // 2. Retroactive Auto-Resolve
                    for (const member of dbChannel.members) {
                        if (member.status === 'pending' && member.username) {
                            // Find them by username in the server
                            const foundDiscordUser = guild.members.cache.find(m => m.user.username === member.username);
                            if (foundDiscordUser) {
                                console.log(`[Auto-Onboarding] Retroactively resolved ${member.username} (already in server)`);
                                member.userId = foundDiscordUser.id;
                                member.status = 'joined';
                                channelModified = true;
                            }
                        }
                    }
                    if (channelModified) {
                        dbChannel.markModified('members');
                        await dbChannel.save();
                    }
                }
            } catch (err) {
                console.error("Error retroactively resolving members:", err);
            }

            // Find or create the Private Channels category first so we can restrict syncing to it
            const categoryName = 'Private Channels';
            let category = guild.channels.cache.find(c => c.type === 4 && c.name.toLowerCase() === categoryName.toLowerCase());
            if (!category) {
                category = await guild.channels.create({
                    name: categoryName,
                    type: 4 // Category type
                });
            }

            const activeDiscordChannelIds = new Set(
                guild.channels.cache.filter(c => c.type === 0 && c.parentId === category.id).keys()
            );

            for (const [id, channel] of guild.channels.cache.filter(c => c.type === 0 && c.parentId === category.id)) {
                const inDb = dbChannels.find(dbC => dbC.discordChannelId === id);
                if (!inDb) {
                    console.log(`[Sync] Found orphaned Private channel ${channel.name}, adding to DB.`);
                    await DiscordChannel.create({
                        server: server._id,
                        channelName: channel.name,
                        discordChannelId: channel.id,
                        members: []
                    });
                }
            }

            for (const dbChannel of dbChannels) {
                if (!dbChannel.discordChannelId) {
                    const channelName = dbChannel.channelName || `team-channel-${dbChannel._id.toString().slice(-4)}`;
                    const permissionOverwrites = buildPermissionOverwrites(guild, dbChannel.members);

                    try {
                        // Pre-lock the channel name because the WebSocket event arrives before the HTTP request returns the ID!
                        lockAction(channelName);

                        // Find or create a category to keep channels organized
                        // (Category is already guaranteed to exist from the sync initialization)

                        const newChannel = await guild.channels.create({
                            name: channelName,
                            type: 0,
                            parent: category.id,
                            permissionOverwrites,
                        });

                        lockAction(newChannel.id);
                        dbChannel.discordChannelId = newChannel.id;
                        await dbChannel.save();
                        unlockAction(newChannel.id);
                        console.log(`[Sync] Created missing Discord channel: ${channelName}`);
                    } catch (createErr) {
                        console.error(`❌ [Sync] Failed to create channel "${channelName}":`, createErr.message);
                        await DiscordChannel.findByIdAndDelete(dbChannel._id);

                        // Clean up any pending emails for this failed channel to prevent false notifications
                        try {
                            const emailsDeleted = await EmailQueue.deleteMany({ channelName: channelName, status: 'pending' });
                            console.log(`🗑️ [Sync] Auto-deleted failed channel "${channelName}" and ${emailsDeleted.deletedCount} pending emails from database.`);
                        } catch (e) {
                            console.error("Failed to cleanup emails for failed channel", e);
                        }
                    }
                } else if (!activeDiscordChannelIds.has(dbChannel.discordChannelId)) {
                    console.log(`[Sync] Channel missing from Discord. Deleting from DB: ${dbChannel.channelName}`);
                    await DiscordChannel.findByIdAndDelete(dbChannel._id);
                } else {
                    const discordChannel = guild.channels.cache.get(dbChannel.discordChannelId);
                    if (discordChannel) {
                        lockAction(discordChannel.id);
                        const permissionOverwrites = buildPermissionOverwrites(guild, dbChannel.members);

                        try {
                            await discordChannel.permissionOverwrites.set(permissionOverwrites);
                        } catch (updateErr) {
                            console.error(`❌ [Sync] Failed to update permissions for "${discordChannel.name}":`, updateErr.message);
                        }

                        if (dbChannel.channelName && discordChannel.name !== dbChannel.channelName) {
                            lockAction(discordChannel.id);
                            await discordChannel.setName(dbChannel.channelName);
                        }
                        unlockAction(discordChannel.id);
                    }
                }
            }
        }
        console.log('--- Finished Full Channel Sync ---');
    } catch (error) {
        console.error('Error during syncChannels:', error);
    } finally {
        isSyncing = false;
        if (syncQueued) {
            syncQueued = false;
            setTimeout(syncChannels, 1000);
        }
    }
}

// ==========================================
// STARTUP
// ==========================================
mongoose.connect(process.env.MONGODB_LINK || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/acellportal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Bot connected to MongoDB successfully.');
}).catch((err) => console.error('MongoDB connection error', err));

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    syncChannels();
});

const token = process.env.BOT_TOKEN;
if (!token || token === 'your_discord_bot_token_here' || token.trim() === '') {
    console.log('⚠️ Notice: BOT_TOKEN is not yet configured in discord_bot/.env.');
} else {
    client.login(token).catch(err => {
        console.error('❌ Failed to login to Discord:', err.message);
    });
}
