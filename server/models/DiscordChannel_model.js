import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: '',
  },
  username: {
    type: String,
    default: '',
  }
}, { _id: false });

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
  { timestamps: true, collection: 'discordchannel' }
);

export default mongoose.models.DiscordChannel || mongoose.model('DiscordChannel', DiscordChannelSchema);
