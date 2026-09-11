const dotenv = require('dotenv');
const DiscordChannel = require('./models/DiscordChannel.js');
const DiscordServer = require('./models/DiscordServer.js');
const mongoose = require('mongoose');

// Load environment variables (.env in bot folder first, fallback to server folder)
dotenv.config();
if (!process.env.MONGODB_LINK && !process.env.MONGO_URI) {
    dotenv.config({ path: '../server/.env' });
}

/**
 * Directly clears all documents from the DiscordChannel collection,
 * and seeds initial channel documents (channel-1, channel-2, channel-3).
 */
async function clearAndSeedDiscordChannels() {
    console.log('\n=============================================');
    console.log('🧹 CLEARING & SEEDING DISCORD CHANNELS IN DB');
    console.log('=============================================\n');

    const mongoUri = process.env.MONGODB_LINK || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/acellportal";

    let createdConnection = false;
    if (mongoose.connection.readyState === 0) {
        console.log('📦 Connecting to MongoDB...');
        try {
            await mongoose.connect(mongoUri);
            createdConnection = true;
            console.log('✅ Connected to MongoDB successfully.');
        } catch (err) {
            console.error('❌ MongoDB connection error:', err.message);
            return { success: false, reason: 'MONGO_ERROR', error: err };
        }
    }

    try {
        const db = mongoose.connection.db;

        // 1. Cleanup all existing channels in both 'discordchannel' and 'discordchannels' collections
        const deleteResult = await DiscordChannel.deleteMany({});
        await db.collection('discordchannels').deleteMany({});
        console.log(`✅ Successfully cleared channel(s) from database.`);

        // Print contents of discordchannel collection right after cleanup
        const channelsAfterCleanup = await DiscordChannel.find({}).lean();
        console.log('\n📋 Contents of \'discordchannel\' collection after cleanup:');
        console.log(JSON.stringify(channelsAfterCleanup, null, 2));
        console.log(`   (Total items in collection: ${channelsAfterCleanup.length})\n`);

        // 2. Ensure server record with ID 6aa406d188df8f5a1ddb3e2c exists in discordserver and discordservers
        const serverId = "6aa406d188df8f5a1ddb3e2c";
        const anyServer = await DiscordServer.findOne();
        const serverData = {
            _id: new mongoose.Types.ObjectId(serverId),
            serverName: anyServer ? anyServer.serverName : 'Test Server',
            serverId: anyServer ? anyServer.serverId : '1547928619660214332',
            description: anyServer ? anyServer.description : 'Auto-registered'
        };
        await DiscordServer.deleteMany({});
        await db.collection('discordservers').deleteMany({});
        await DiscordServer.create(serverData);
        await db.collection('discordservers').insertOne({ ...serverData });
        console.log(`✨ Ensured server records match server ID: ${serverId}`);

        // 3. Define the 3 channel documents requested with valid member schema objects
        const initialChannels = [
            {
                _id: new mongoose.Types.ObjectId("6aa4093c6175e78d35801649"),
                server: new mongoose.Types.ObjectId("6aa406d188df8f5a1ddb3e2c"),
                channelName: "channel-1",
                discordChannelId: "1547969266337456280",
                members: [
                    {
                        userId: "1271768114987798644",
                        username: "sarangvthakare"
                    }
                ]
            },
            {
                _id: new mongoose.Types.ObjectId("6aa4093c6175e78d3580164a"),
                server: new mongoose.Types.ObjectId("6aa406d188df8f5a1ddb3e2c"),
                channelName: "channel-2",
                discordChannelId: "1547969266337456281",
                members: [
                    {
                        userId: "1271768114987798644",
                        username: "sarangvthakare"
                    }
                ]
            },
            {
                _id: new mongoose.Types.ObjectId("6aa4093c6175e78d3580164b"),
                server: new mongoose.Types.ObjectId("6aa406d188df8f5a1ddb3e2c"),
                channelName: "channel-3",
                discordChannelId: "1547969266337456282",
                members: [
                    {
                        userId: "anshu03079",
                        username: "anshu03079"
                    }
                ]
            }
        ];

        // 4. Insert into both 'discordchannel' and 'discordchannels'
        const insertResult = await DiscordChannel.insertMany(initialChannels);
        await db.collection('discordchannels').insertMany(initialChannels.map(doc => ({ ...doc })));

        console.log(`✅ Successfully seeded ${insertResult.length} channel(s):`);
        insertResult.forEach(ch => {
            console.log(`   • [${ch.channelName}] _id: ${ch._id} | discordChannelId: ${ch.discordChannelId} | server: ${ch.server}`);
        });

        // 5. Query and PRINT the actual contents of the collection from MongoDB after seeding
        const channelsAfterSeeding = await DiscordChannel.find({}).lean();
        console.log('\n📦 Contents of collection after seeding (populated in MongoDB):');
        console.log(JSON.stringify(channelsAfterSeeding, null, 2));
        console.log(`   (Verified: ${channelsAfterSeeding.length} documents present in DB)\n`);

        return { success: true, deletedCount: deleteResult.deletedCount, insertedCount: insertResult.length };
    } catch (err) {
        console.error('❌ Failed to clear or seed Discord channels:', err);
        return { success: false, error: err };
    } finally {
        if (createdConnection && require.main === module) {
            await mongoose.disconnect();
            console.log('\n🔌 MongoDB connection closed.\n');
        }
    }
}

// Run directly if called from command line
if (require.main === module) {
    clearAndSeedDiscordChannels().then(() => {
        process.exit(0);
    }).catch((err) => {
        console.error('Fatal error during sync job:', err);
        process.exit(1);
    });
}

module.exports = {
    clearDiscordChannels: clearAndSeedDiscordChannels,
    clearAndSeedDiscordChannels,
    runManualSync: clearAndSeedDiscordChannels
};


