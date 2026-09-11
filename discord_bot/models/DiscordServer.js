const mongoose = require('mongoose');

const serverCollection = process.env.SERVER_COL || 'discordserver';

const DiscordServerSchema = new mongoose.Schema(
    {
        serverName: {
            type: String,
            required: true,
        },
        serverId: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: serverCollection
    }
);

module.exports = mongoose.models.DiscordServer || mongoose.model('DiscordServer', DiscordServerSchema, serverCollection);
