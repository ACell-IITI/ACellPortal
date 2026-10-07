import { config } from './config/env.js';
import { Client, GatewayIntentBits, Events } from 'discord.js';
import { setupWebhooks } from './webhooks/api.js';
import { setupEvents } from './events/index.js';
import { syncChannels } from './services/syncService.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// Setup Webhooks
const app = setupWebhooks(client);
app.listen(config.PORT, '0.0.0.0', () => {
    console.log(`🎧 Bot Webhook Listener started on port ${config.PORT}`);
});

// Setup Discord Events
setupEvents(client);

import DiscordServer from '../server/models/DiscordServer_model.js';
const mongoose = DiscordServer.base;

// Connect to MongoDB
mongoose.connect(config.MONGODB_LINK).then(() => {
    console.log('Bot connected to MongoDB successfully.');
}).catch((err) => console.error('MongoDB connection error', err));

// Client Ready
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    syncChannels(client);
});

// Login
if (!config.BOT_TOKEN || config.BOT_TOKEN === 'your_discord_bot_token_here' || config.BOT_TOKEN.trim() === '') {
    console.log('⚠️ Notice: BOT_TOKEN is not yet configured in discord_bot/.env.');
} else {
    client.login(config.BOT_TOKEN).catch(err => {
        console.error('❌ Failed to login to Discord:', err.message);
    });
}
