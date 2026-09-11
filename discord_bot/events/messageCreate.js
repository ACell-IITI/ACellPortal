const { Events } = require('discord.js');
const { logMessage } = require('../services/loggerService');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {
        // Handle ping command
        if (!message.author.bot && message.content.toLowerCase() === '!ping') {
            message.reply('Pong!');
        }

        // Log messages to 'channel-log'
        try {
            await logMessage(message);
        } catch (error) {
            console.error('[MessageCreate] Error logging message:', error);
        }
    },
};
