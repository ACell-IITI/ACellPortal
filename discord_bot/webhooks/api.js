import express from 'express';
import DiscordServer from '../../server/models/DiscordServer_model.js';
import { syncChannels } from '../services/syncService.js';
import { lockAction, unlockAction } from '../utils/locks.js';

export function setupWebhooks(client) {
    const app = express();
    
    app.use(express.json());

    app.post('/api/sync', (req, res) => {
        console.log("⚡ Received instant sync trigger from Admin Panel!");
        syncChannels(client);
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
            
            if (!guild) {
                console.error("Invite generation failed: No guild found.");
                return res.status(404).json({ error: 'No guild found' });
            }

            let channel = guild.systemChannel;
            if (!channel) channel = guild.channels.cache.find(c => c.name.toLowerCase().includes('welcome') && c.type === 0);
            if (!channel) channel = guild.channels.cache.find(c => c.type === 0);

            if (!channel) {
                console.error("Invite generation failed: No suitable channel found in guild", guild.name);
                return res.status(404).json({ error: 'No suitable channel found' });
            }

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

    return app;
}
