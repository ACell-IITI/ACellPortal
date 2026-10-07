import DiscordServer from '../../server/models/DiscordServer_model.js';
import DiscordChannel from '../../server/models/DiscordChannel_model.js';
import EmailQueue from '../../server/models/EmailQueue_model.js';
import { buildPermissionOverwrites } from '../utils/permissions.js';
import { lockAction, unlockAction } from '../utils/locks.js';

let isSyncing = false;
let syncQueued = false;

export async function syncChannels(client) {
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

            // Retroactive Auto-Resolve
            try {
                const hasPending = dbChannels.some(ch => ch.members.some(m => m.status === 'pending'));
                if (hasPending) {
                    try { await guild.members.fetch(); } catch (e) { /* ignore rate limits and use local cache */ }
                }

                for (const dbChannel of dbChannels) {
                    let channelModified = false;

                    const validMembersMap = new Map();
                    for (const member of dbChannel.members) {
                        let isInvalid = false;

                        if (member.userId && !/^\d{17,20}$/.test(member.userId)) {
                            console.log(`⚠️ Removing invalid User ID from DB: "${member.userId}" for ${member.username}`);
                            isInvalid = true;
                        }

                        if (member.username) {
                            const isValidUsername = /^[a-zA-Z0-9_.]{2,32}$/.test(member.username);
                            if (!isValidUsername) {
                                console.log(`⚠️ Removing invalid Discord Username format from DB: "${member.username}"`);
                                isInvalid = true;
                            }
                            member.username = member.username.toLowerCase();
                        } else if (!member.userId) {
                            isInvalid = true; 
                        }

                        if (isInvalid) {
                            try {
                                if (member.email) {
                                    await EmailQueue.deleteMany({ recipientEmail: member.email, channelName: dbChannel.channelName, status: 'pending' });
                                }
                            } catch (e) { }
                            channelModified = true;
                            continue; 
                        }

                        if (validMembersMap.has(member.username)) {
                            const existing = validMembersMap.get(member.username);
                            if (member.role === 'mentor') {
                                existing.role = 'mentor';
                            }
                            if (!existing.userId && member.userId) {
                                existing.userId = member.userId;
                            }
                            channelModified = true; 
                        } else {
                            validMembersMap.set(member.username, member);
                        }
                    }
                    dbChannel.members = Array.from(validMembersMap.values());

                    for (const member of dbChannel.members) {
                        if (member.status === 'pending' && member.username) {
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

            const categoryName = 'Private Channels';
            let category = guild.channels.cache.find(c => c.type === 4 && c.name.toLowerCase() === categoryName.toLowerCase());
            if (!category) {
                category = await guild.channels.create({
                    name: categoryName,
                    type: 4 
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
                    const permissionOverwrites = buildPermissionOverwrites(guild, dbChannel.members, client.user.id);

                    try {
                        lockAction(channelName);

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
                        const permissionOverwrites = buildPermissionOverwrites(guild, dbChannel.members, client.user.id);

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
            setTimeout(() => syncChannels(client), 1000);
        }
    }
}
