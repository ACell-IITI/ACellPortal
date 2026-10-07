import { Events } from 'discord.js';
import guildMemberAdd from './guildMemberAdd.js';
import channelCreate from './channelCreate.js';
import channelDelete from './channelDelete.js';
import channelUpdate from './channelUpdate.js';

export function setupEvents(client) {
    client.on(Events.GuildMemberAdd, (member) => guildMemberAdd(client, member));
    client.on(Events.ChannelCreate, (channel) => channelCreate(client, channel));
    client.on(Events.ChannelDelete, (channel) => channelDelete(client, channel));
    client.on(Events.ChannelUpdate, (oldChannel, newChannel) => channelUpdate(client, oldChannel, newChannel));
}
