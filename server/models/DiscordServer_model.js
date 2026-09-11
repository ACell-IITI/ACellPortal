import mongoose from 'mongoose';

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
  { timestamps: true }
);

export default mongoose.model('DiscordServer', DiscordServerSchema);
