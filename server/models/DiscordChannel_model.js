import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  userId: {
    type: String,
    // No longer required, as it will be auto-resolved when they join via invite
  },
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  role: {
    type: String,
    enum: ['mentor', 'mentee'],
    default: 'mentee',
  },
  status: {
    type: String,
    enum: ['pending', 'joined'],
    default: 'pending'
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
