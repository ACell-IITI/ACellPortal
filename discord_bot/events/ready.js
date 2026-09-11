const { Events } = require('discord.js');
const { getOrCreateLogChannel } = require('../services/loggerService');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`[Bot Ready] Logged in as ${client.user.tag}`);

        // Ensure change-log channel is created with admin-only access on all servers
        try {
            const guilds = await client.guilds.fetch();
            for (const [guildId, oauthGuild] of guilds) {
                const guild = await oauthGuild.fetch();
                await getOrCreateLogChannel(guild);
            }
        } catch (error) {
            console.error('[Bot Ready] Error initializing log channels on startup:', error);
        }
    },
};
