import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
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
    members: [memberSchema],
  },
  { timestamps: true }
);

export default mongoose.model('DiscordChannel', DiscordChannelSchema);
