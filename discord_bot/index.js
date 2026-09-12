import dotenv from 'dotenv';
import { Client, GatewayIntentBits, Events, PermissionsBitField, OverwriteType } from 'discord.js';
import DiscordServer from '../server/models/DiscordServer_model.js';
import DiscordChannel from '../server/models/DiscordChannel_model.js';

dotenv.config();
if (!process.env.MONGODB_LINK) {
    dotenv.config({ path: '../server/.env' });
}

const mongoose = DiscordServer.base;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
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
            deny: [PermissionsBitField.Flags.ViewChannel],
        },
        {
            id: client.user.id, 
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
                allow: allowFlags,
            });
        } else if (member.userId) {
            console.log(`⚠️ Skipping invalid User ID format: "${member.userId}" for ${member.username || 'unknown user'}`);
        }
    }
    return permissionOverwrites;
}

// ==========================================
// DATABASE -> DISCORD SYNC (CHANGE STREAMS)
// ==========================================
async function setupDatabaseListeners() {
    console.log("🎧 Starting MongoDB Change Streams...");
    
    DiscordChannel.watch().on('change', async (change) => {
        try {
            if (change.operationType === 'insert') {
                const dbChannel = change.fullDocument;
                if (dbChannel.discordChannelId) return; // Already has ID, ignore

                const server = await DiscordServer.findById(dbChannel.server);
                if (!server) return;

                const guild = client.guilds.cache.get(server.serverId);
                if (!guild) return;

                const channelName = dbChannel.channelName || `team-channel-${dbChannel._id.toString().slice(-4)}`;
                const permissionOverwrites = buildPermissionOverwrites(guild, dbChannel.members);

                console.log(`[DB->Discord] Creating channel: ${channelName}`);
                try {
                    const newDiscordChannel = await guild.channels.create({
                        name: channelName,
                        type: 0,
                        permissionOverwrites,
                    });

                    lockAction(newDiscordChannel.id); // Prevent discord event from re-triggering DB update
                    
                    // Save ID back to DB
                    await DiscordChannel.findByIdAndUpdate(dbChannel._id, { discordChannelId: newDiscordChannel.id });
                    unlockAction(newDiscordChannel.id);
                } catch (createErr) {
                    console.error(`❌ [DB->Discord] Failed to create channel "${channelName}". It might have invalid User IDs or the bot lacks permissions:`, createErr.message);
                    await DiscordChannel.findByIdAndDelete(dbChannel._id);
                    console.log(`🗑️ [DB->Discord] Auto-deleted failed channel "${channelName}" from database.`);
                }
            }
            else if (change.operationType === 'update') {
                const dbChannel = await DiscordChannel.findById(change.documentKey._id).populate('server');
                if (!dbChannel || !dbChannel.discordChannelId) return;

                const server = await DiscordServer.findById(dbChannel.server);
                if (!server) return;

                const guild = client.guilds.cache.get(server.serverId);
                if (!guild) return;

                const discordChannel = guild.channels.cache.get(dbChannel.discordChannelId);
                if (!discordChannel) return;

                lockAction(discordChannel.id);
                console.log(`[DB->Discord] Updating channel: ${discordChannel.name}`);
                
                if (change.updateDescription.updatedFields.channelName) {
                    await discordChannel.setName(dbChannel.channelName);
                }

                if (change.updateDescription.updatedFields.members || Object.keys(change.updateDescription.updatedFields).some(k => k.startsWith('members'))) {
                    const permissionOverwrites = buildPermissionOverwrites(guild, dbChannel.members);
                    try {
                        await discordChannel.permissionOverwrites.set(permissionOverwrites);
                    } catch (updateErr) {
                        console.error(`❌ [DB->Discord] Failed to update permissions for "${discordChannel.name}". It might have invalid User IDs:`, updateErr.message);
                    }
                }
                unlockAction(discordChannel.id);
            }
            else if (change.operationType === 'delete') {
                console.log(`[DB->Discord] Channel deleted from DB. Triggering sync to clean Discord.`);
                syncChannels();
            }
        } catch (error) {
            console.error("Error in DB Change Stream:", error);
        }
    });
}

// ==========================================
// DISCORD -> DATABASE SYNC (DISCORD EVENTS)
// ==========================================

client.on(Events.ChannelCreate, async (channel) => {
    if (recentBotActions.has(channel.id) || channel.type !== 0) return;
    console.log(`[Discord->DB] Manual channel created: ${channel.name}`);
    
    const server = await DiscordServer.findOne({ serverId: channel.guild.id });
    if (!server) return;

    const existing = await DiscordChannel.findOne({ discordChannelId: channel.id });
    if (existing) return;

    await DiscordChannel.create({
        server: server._id,
        channelName: channel.name,
        discordChannelId: channel.id,
        members: []
    });
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
            role
        });
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
async function syncChannels() {
    try {
        console.log('--- Starting Full Channel Sync ---');
        const servers = await DiscordServer.find();

        for (const server of servers) {
            const guild = client.guilds.cache.get(server.serverId);
            if (!guild) continue;

            const dbChannels = await DiscordChannel.find({ server: server._id });
            const activeDiscordChannelIds = new Set(guild.channels.cache.filter(c => c.type === 0).keys());

            for (const [id, channel] of guild.channels.cache.filter(c => c.type === 0)) {
                const inDb = dbChannels.find(dbC => dbC.discordChannelId === id);
                if (!inDb) {
                    console.log(`[Sync] Found orphaned Discord channel ${channel.name}, adding to DB.`);
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
                        const newChannel = await guild.channels.create({
                            name: channelName,
                            type: 0,
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
                        console.log(`🗑️ [Sync] Auto-deleted failed channel "${channelName}" from database.`);
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
    setupDatabaseListeners();
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
