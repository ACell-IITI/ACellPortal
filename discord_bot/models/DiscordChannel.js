const mongoose = require('mongoose');

const channelCollection = process.env.CHANNEL_COL || 'discordchannel';

const memberSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            default: '',
        },
        username: {
            type: String,
            default: '',
        }
    },
    { _id: false }
);

const DiscordChannelSchema = new mongoose.Schema(
    {
        server: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DiscordServer',
            required: true,
        },
        channelName: {
            type: String,
        },
        discordChannelId: {
            type: String,
        },
        members: [memberSchema],
    },
    {
        timestamps: true,
        collection: channelCollection
    }
);

module.exports = mongoose.models.DiscordChannel || mongoose.model('DiscordChannel', DiscordChannelSchema, channelCollection);
