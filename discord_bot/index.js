require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { connectDB, testDatabaseConnection } = require('./config/db');
const { startSyncServer } = require('./services/syncService');

// Import Event Handlers
const readyEvent = require('./events/ready');
const guildMemberAddEvent = require('./events/guildMemberAdd');
const guildMemberRemoveEvent = require('./events/guildMemberRemove');
const messageCreateEvent = require('./events/messageCreate');

// Initialize Discord Client with required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// Register Event Handlers
client.once(readyEvent.name, (...args) => readyEvent.execute(...args));
client.on(guildMemberAddEvent.name, (...args) => guildMemberAddEvent.execute(...args));
client.on(guildMemberRemoveEvent.name, (...args) => guildMemberRemoveEvent.execute(...args));
client.on(messageCreateEvent.name, (...args) => messageCreateEvent.execute(...args));

// Start function to connect to DB and login bot
const startBot = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // await testDatabaseConnection();

        // Read BOT_TOKEN from env
        const token = process.env.BOT_TOKEN;
        if (!token) {
            console.error('Error: Please set a valid BOT_TOKEN in your .env file.');
            process.exit(1);
        }

        // Login to Discord
        await client.login(token);

        // Start the sync HTTP server so backend can push real-time notifications
        const syncPort = parseInt(process.env.SYNC_PORT, 10) || 3500;
        startSyncServer(client, syncPort);
    } catch (error) {
        console.error('Failed to start Discord Bot:', error);
        process.exit(1);
    }
};

startBot();