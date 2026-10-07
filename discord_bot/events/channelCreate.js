import DiscordServer from '../../server/models/DiscordServer_model.js';
import DiscordChannel from '../../server/models/DiscordChannel_model.js';
import { recentBotActions } from '../utils/locks.js';

export default async (client, channel) => {
    if (channel.type !== 0) return;

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
};
