const mongoose = require('mongoose');

/**
 * Connects to MongoDB database using MONGODB_LINK environment variable.
 */
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_LINK;
        if (!mongoUri) {
            console.error('Error: MONGODB_LINK is not defined in environment variables.');
            process.exit(1);
        }

        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
        return conn;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

/**
 * Test function to verify DB reading capability, list collections, and print their document contents.
 */
const testDatabaseConnection = async () => {
    try {
        const db = mongoose.connection.db;
        // const collections = await db.listCollections().toArray();
        const collectionNames = ["discordchannels"]

        console.log(`\n=================== DB CONTENTS CHECK ===================`);
        console.log(`Database Name: ${db.databaseName}`);
        console.log(`Found ${collectionNames.length} Collections:`, collectionNames);

        for (const colName of collectionNames) {
            const docs = await db.collection(colName).find({}).toArray();
            console.log(`\n--- Collection: '${colName}' (${docs.length} documents) ---`);
            if (docs.length > 0) {
                console.log(JSON.stringify(docs, null, 2));
            } else {
                console.log(`(Collection '${colName}' is empty)`);
            }
        }
        console.log(`=========================================================\n`);
    } catch (error) {
        console.error('Error during database contents check:', error);
    }
};

module.exports = {
    connectDB,
    testDatabaseConnection,
};
