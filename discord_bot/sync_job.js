import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client, GatewayIntentBits, OverwriteType } from 'discord.js';
import DiscordServer from '../server/models/DiscordServer_model.js';
import DiscordChannel from '../server/models/DiscordChannel_model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (.env in bot folder first, fallback to server folder)
dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.BOT_TOKEN) {
    dotenv.config({ path: path.join(__dirname, '../server/.env') });
}

// Ensure we use the exact same mongoose instance as the models
const mongoose = DiscordServer.base;

export async function runManualSync() {
    console.log('\n=============================================');
    console.log('🔄 STARTING REVERSE SYNCHRONIZATION (DISCORD -> DB)');
    console.log('   Discord is treated as the Source of Truth.');
    console.log('=============================================\n');

    const token = process.env.BOT_TOKEN;
    if (!token || token === 'your_discord_bot_token_here' || token.trim() === '') {
        console.error('❌ Error: BOT_TOKEN is not configured.');
        return { success: false, reason: 'MISSING_BOT_TOKEN' };
    }

    const mongoUri = process.env.MONGODB_LINK || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/acellportal";

    if (mongoose.connection.readyState === 0) {
        console.log('📦 Connecting to MongoDB...');
        try {
            await mongoose.connect(mongoUri);
            console.log('✅ Connected to MongoDB successfully.');
        } catch (err) {
            console.error('❌ MongoDB connection error:', err.message);
            return { success: false, reason: 'MONGO_ERROR', error: err };
        }
    }

    // Initialize Discord Client
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers, // Needed to fetch member usernames
        ],
    });

    console.log('🤖 Logging in to Discord...');
    try {
        await client.login(token);
        console.log(`✅ Logged in as Discord Bot: ${client.user.tag} (ID: ${client.user.id})\n`);
    } catch (err) {
        console.error('❌ Discord login failed:', err.message);
        return { success: false, reason: 'LOGIN_FAILED', error: err };
    }

    let stats = {
        serversScanned: 0,
        channelsCreatedInDB: 0,
        channelsUpdatedInDB: 0,
        channelsDeletedFromDB: 0,
        errors: 0
    };

    try {
        console.log(`🔍 Auto-discovering servers the bot is in...`);
        const oauthGuilds = await client.guilds.fetch();
        console.log(`📋 Bot is currently in ${oauthGuilds.size} server(s).`);

        // First, ensure all discovered servers are in the DB
        for (const [guildId, oauthGuild] of oauthGuilds) {
            let dbServer = await DiscordServer.findOne({ serverId: guildId });
            if (!dbServer) {
                dbServer = await DiscordServer.create({
                    serverId: guildId,
                    serverName: oauthGuild.name,
                    description: 'Auto-discovered from Discord'
                });
                console.log(`   ✨ Auto-added Discord Server to DB: "${oauthGuild.name}"`);
            } else if (dbServer.serverName !== oauthGuild.name) {
                dbServer.serverName = oauthGuild.name;
                await dbServer.save();
                console.log(`   🔄 Updated Server Name in DB: "${oauthGuild.name}"`);
            }
        }

        // Fetch all servers from DB (which now includes the auto-discovered ones)
        // We only process servers that the bot is actually in to avoid errors
        const servers = await DiscordServer.find();
        
        let validServers = [];
        for (const server of servers) {
            if (oauthGuilds.has(server.serverId)) {
                validServers.push(server);
            } else {
                console.warn(`   ⚠️ Warning: Bot is no longer in server "${server.serverName}" [ID: ${server.serverId}]. Skipping sync for it.`);
            }
        }
        
        stats.serversScanned = validServers.length;
        console.log(`\n🚀 Starting channel sync for ${validServers.length} active server(s)...\n`);

        for (const server of validServers) {
            console.log(`---------------------------------------------`);
            console.log(`🏢 Syncing Server: "${server.serverName}" [Discord ID: ${server.serverId}]`);
            console.log(`---------------------------------------------`);

            let guild;
            try {
                guild = await client.guilds.fetch(server.serverId);
            } catch (err) {
                console.error(`❌ Bot cannot access Discord Server ${server.serverId}. Skipping.`);
                stats.errors++;
                continue;
            }

            // Fetch all channels in the guild
            const guildChannels = await guild.channels.fetch();
            
            // Only care about Text Channels (type 0)
            const textChannels = guildChannels.filter(c => c && c.type === 0);
            
            // Track which discord channel IDs we've seen on Discord
            const activeDiscordChannelIds = new Set();

            for (const [channelId, discordChannel] of textChannels) {
                activeDiscordChannelIds.add(channelId);
                
                // Extract members who have explicit allow overwrites for ViewChannel
                const members = [];
                const overwrites = discordChannel.permissionOverwrites.cache;
                
                for (const [id, overwrite] of overwrites) {
                    // Check if overwrite is for a user (type 1 / OverwriteType.Member)
                    if (overwrite.type === OverwriteType.Member || overwrite.type === 1) {
                        // Check if they are explicitly allowed to view the channel
                        if (overwrite.allow.has('ViewChannel')) {
                            // Don't add the bot itself as a member in the DB
                            if (id === client.user.id) continue;
                            
                            // Try to get their username
                            let username = 'Unknown User';
                            try {
                                const user = await client.users.fetch(id);
                                username = user.username;
                            } catch (e) {
                                // User might have left discord or invalid ID, ignore error
                            }
                            
                            members.push({
                                userId: id,
                                username: username
                            });
                        }
                    }
                }

                // Check if this channel exists in our DB
                let dbChannel = await DiscordChannel.findOne({ server: server._id, discordChannelId: channelId });

                if (!dbChannel) {
                    // It's in Discord but not in DB -> Create it in DB
                    try {
                        await DiscordChannel.create({
                            server: server._id,
                            channelName: discordChannel.name,
                            discordChannelId: channelId,
                            members: members
                        });
                        console.log(`   ➕ Created DB record for Discord channel: #${discordChannel.name} (${members.length} members)`);
                        stats.channelsCreatedInDB++;
                    } catch (err) {
                        console.error(`   ❌ Failed to create DB record for #${discordChannel.name}:`, err.message);
                        stats.errors++;
                    }
                } else {
                    // It exists in both -> Update DB to match Discord exactly
                    try {
                        dbChannel.channelName = discordChannel.name;
                        dbChannel.members = members;
                        await dbChannel.save();
                        console.log(`   🔄 Updated DB record for #${discordChannel.name} to match Discord (${members.length} members)`);
                        stats.channelsUpdatedInDB++;
                    } catch (err) {
                        console.error(`   ❌ Failed to update DB record for #${discordChannel.name}:`, err.message);
                        stats.errors++;
                    }
                }
            }

            // Cleanup DB channels that no longer exist on Discord
            const allDbChannels = await DiscordChannel.find({ server: server._id });
            for (const dbCh of allDbChannels) {
                // If the channel has a discordChannelId but it's no longer in the guild, delete it from DB
                // Or if it was never created on Discord (null discordChannelId), we might want to delete it too
                // since Discord is the source of truth here.
                if (dbCh.discordChannelId && !activeDiscordChannelIds.has(dbCh.discordChannelId)) {
                    console.log(`   🗑️ Channel "${dbCh.channelName}" no longer exists on Discord. Deleting from DB.`);
                    await DiscordChannel.findByIdAndDelete(dbCh._id);
                    stats.channelsDeletedFromDB++;
                } else if (!dbCh.discordChannelId) {
                     // It was in DB but never had a Discord ID (maybe created manually in DB)
                     // Since Discord is truth, and it's not on Discord, we purge it.
                     console.log(`   🗑️ Purging un-synced DB channel "${dbCh.channelName}" (no Discord ID).`);
                     await DiscordChannel.findByIdAndDelete(dbCh._id);
                     stats.channelsDeletedFromDB++;
                }
            }
        }
    } catch (err) {
        console.error('❌ Unexpected error during synchronization:', err);
    } finally {
        console.log('\n=============================================');
        console.log('📊 SYNCHRONIZATION SUMMARY:');
        console.log(`   • Servers Scanned:           ${stats.serversScanned}`);
        console.log(`   • Channels Added to DB:      ${stats.channelsCreatedInDB}`);
        console.log(`   • Channels Updated in DB:    ${stats.channelsUpdatedInDB}`);
        console.log(`   • Channels Deleted from DB:  ${stats.channelsDeletedFromDB}`);
        console.log(`   • Errors Encountered:        ${stats.errors}`);
        console.log('=============================================\n');

        client.destroy();
        console.log('👋 Discord client disconnected.');
    }

    return { success: true, stats };
}

// Run directly if called from command line
if (process.argv[1] && process.argv[1].endsWith('sync_job.js')) {
    runManualSync().then(() => {
        process.exit(0);
    }).catch((err) => {
        console.error('Fatal sync error:', err);
        process.exit(1);
    });
}
