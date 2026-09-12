import dotenv from 'dotenv';
import DiscordServer from '../server/models/DiscordServer_model.js';
import DiscordChannel from '../server/models/DiscordChannel_model.js';

dotenv.config();
if (!process.env.MONGODB_LINK) {
    dotenv.config({ path: '../server/.env' });
}

const mongoose = DiscordServer.base;
const mongoUri = process.env.MONGODB_LINK || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/acellportal";

// Parse CLI arguments: e.g. node prefill.js --serverId=123456789012345678 --userId=987654321098765432
function getCliArgs() {
    const args = {};
    for (const arg of process.argv.slice(2)) {
        if (arg.startsWith('--')) {
            const [key, value] = arg.slice(2).split('=');
            args[key] = value;
        }
    }
    return args;
}

async function prefill() {
    console.log('\n=============================================');
    console.log('🌱 PREFILLING DISCORD DATA IN DATABASE');
    console.log('=============================================\n');

    const args = getCliArgs();
    const serverId = args.serverId || process.env.DISCORD_SERVER_ID || '123456789012345678';
    const serverName = args.serverName || 'ACell Main Server';
    const testUserId = args.userId || '987654321098765432';

    console.log(`Connecting to MongoDB at: ${mongoUri.replace(/:([^:@]+)@/, ':****@')}`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    // 1. Create or retrieve Discord Server
    let server = await DiscordServer.findOne({ serverId });
    if (!server) {
        server = await DiscordServer.create({
            serverName: serverName,
            serverId: serverId,
            description: 'Prefilled Test Discord Server for ACell Portal',
        });
        console.log(`✅ Created Discord Server record: "${server.serverName}" (Server ID: ${server.serverId})`);
    } else {
        console.log(`ℹ️ Discord Server "${server.serverName}" (Server ID: ${server.serverId}) already exists.`);
    }

    // 2. Prefill sample channels if none exist for this server
    const existingChannels = await DiscordChannel.find({ server: server._id });
    if (existingChannels.length === 0) {
        const sampleChannels = [
            {
                channelName: 'team-alpha',
                server: server._id,
                members: [
                    { userId: testUserId, username: 'TeamLeader' },
                    { userId: '111111111111111111', username: 'Member_One' },
                    { userId: '222222222222222222', username: 'Member_Two' },
                ],
            },
            {
                channelName: 'team-beta',
                server: server._id,
                members: [
                    { userId: testUserId, username: 'TeamLeader' },
                    { userId: '333333333333333333', username: 'Member_Three' },
                ],
            },
            {
                channelName: 'announcements-private',
                server: server._id,
                members: [
                    { userId: testUserId, username: 'TeamLeader' },
                ],
            }
        ];

        for (const chData of sampleChannels) {
            const created = await DiscordChannel.create(chData);
            console.log(`   ➕ Created sample channel: #${created.channelName} with ${created.members.length} member(s)`);
        }
        console.log('\n✅ Prefilled 3 sample channels successfully!');
    } else {
        console.log(`ℹ️ Server already has ${existingChannels.length} channel(s) in DB.`);
    }

    console.log('\n=============================================');
    console.log('📌 NOTE:');
    console.log('To prefill with your real Discord Server ID & User ID, run:');
    console.log('node prefill.js --serverId=<YOUR_DISCORD_SERVER_ID> --userId=<YOUR_DISCORD_USER_ID>');
    console.log('=============================================\n');

    await mongoose.disconnect();
    console.log('👋 Database connection closed.');
}

prefill().catch((err) => {
    console.error('❌ Prefill error:', err);
    process.exit(1);
});
