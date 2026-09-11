const { Events } = require('discord.js');
const { logUserLeave } = require('../services/loggerService');
const { sendFarewellMessage } = require('../services/welcomeService');

module.exports = {
    name: Events.GuildMemberRemove,
    once: false,
    async execute(member) {
        console.log(`[GuildMemberRemove] User left: ${member.user ? member.user.tag : 'Unknown'} (ID: ${member.id}) from Guild: ${member.guild.name}`);
        try {
            // 1. Log event in change-log channel
            await logUserLeave(member);

            // 2. Drop farewell message in farewell channel
            await sendFarewellMessage(member);
        } catch (error) {
            console.error('[GuildMemberRemove] Error handling member leave:', error);
        }
    },
};
