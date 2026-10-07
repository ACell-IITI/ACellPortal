import { PermissionsBitField, OverwriteType } from 'discord.js';
import DiscordChannel from '../../server/models/DiscordChannel_model.js';
import { recentBotActions } from '../utils/locks.js';

export default async (client, oldChannel, newChannel) => {
    if (recentBotActions.has(newChannel.id) || newChannel.type !== 0) return;

    const dbChannel = await DiscordChannel.findOne({ discordChannelId: newChannel.id });
    if (!dbChannel) return;

    let needsSave = false;

    if (oldChannel.name !== newChannel.name) {
        console.log(`[Discord->DB] Manual name update: ${newChannel.name}`);
        dbChannel.channelName = newChannel.name;
        needsSave = true;
    }

    const membersMap = new Map(); 

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
};
