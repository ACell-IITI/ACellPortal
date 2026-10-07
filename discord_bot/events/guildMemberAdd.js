import DiscordChannel from '../../server/models/DiscordChannel_model.js';
import { buildPermissionOverwrites } from '../utils/permissions.js';
import { lockAction, unlockAction } from '../utils/locks.js';

export default async (client, member) => {
    try {
        console.log(`[Auto-Onboarding] User joined server: ${member.user.username}`);

        const channels = await DiscordChannel.find({
            'members.username': member.user.username,
            'members.status': 'pending'
        });

        if (channels.length === 0) {
            console.log(`[Auto-Onboarding] No pending channels found for ${member.user.username}`);
            return;
        }

        console.log(`[Auto-Onboarding] Found ${channels.length} pending channels for ${member.user.username}. Auto-Resolving ID...`);

        for (const ch of channels) {
            const memberIndex = ch.members.findIndex(m => m.username === member.user.username && m.status === 'pending');
            if (memberIndex !== -1) {
                ch.members[memberIndex].userId = member.user.id;
                ch.members[memberIndex].status = 'joined';
                await ch.save();

                const discordChannel = member.guild.channels.cache.get(ch.discordChannelId);
                if (discordChannel) {
                    lockAction(discordChannel.id);
                    const permissionOverwrites = buildPermissionOverwrites(member.guild, ch.members, client.user.id);
                    await discordChannel.permissionOverwrites.set(permissionOverwrites);
                    unlockAction(discordChannel.id);
                    console.log(`[Auto-Onboarding] Successfully assigned ${member.user.username} to #${discordChannel.name}`);
                }
            }
        }
    } catch (err) {
        console.error("Error in GuildMemberAdd Auto-Onboarding:", err);
    }
};
