import DiscordChannel from '../../server/models/DiscordChannel_model.js';
import { recentBotActions } from '../utils/locks.js';

export default async (client, channel) => {
    if (recentBotActions.has(channel.id) || channel.type !== 0) return;
    console.log(`[Discord->DB] Manual channel deleted: ${channel.name}`);

    await DiscordChannel.findOneAndDelete({ discordChannelId: channel.id });
};
