import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  role: {
    type: String,
    enum: ['mentor', 'mentee'],
    default: 'mentee',
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
  { timestamps: true }
);

export default mongoose.model('DiscordChannel', DiscordChannelSchema);
