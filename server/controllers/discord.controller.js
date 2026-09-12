import DiscordServer from '../models/DiscordServer_model.js';
import DiscordChannel from '../models/DiscordChannel_model.js';
import EmailQueue from '../models/EmailQueue_model.js';
import xlsx from 'xlsx';
import axios from 'axios';

const triggerBotSync = () => {
    axios.post('http://127.0.0.1:3001/api/sync').catch(err => console.log('Bot sync webhook unreachable (Bot might be offline)'));
};
// --- Discord Server Operations ---

// Get all servers
export const getServers = async (req, res) => {
  try {
    const servers = await DiscordServer.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: servers });
  } catch (error) {
    console.error('Error fetching discord servers:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Add a new server
export const addServer = async (req, res) => {
  try {
    const { serverName, serverId, description } = req.body;
    
    if (!serverName || !serverId) {
      return res.status(400).json({ success: false, message: 'Server Name and Server ID are required.' });
    }

    const newServer = new DiscordServer({
      serverName,
      serverId,
      description,
    });

    await newServer.save();
    res.status(201).json({ success: true, data: newServer });
  } catch (error) {
    console.error('Error adding discord server:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Server ID already exists.' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Delete a server
export const deleteServer = async (req, res) => {
  try {
    const { id } = req.params;
    await DiscordServer.findByIdAndDelete(id);
    // Also delete associated channels
    await DiscordChannel.deleteMany({ server: id });
    res.status(200).json({ success: true, message: 'Server and its channels deleted successfully.' });
  } catch (error) {
    console.error('Error deleting discord server:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};


// --- Discord Channel Operations ---

// Get channels by server ID
export const getChannelsByServer = async (req, res) => {
  try {
    const { serverId } = req.params;
    const channels = await DiscordChannel.find({ server: serverId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: channels });
  } catch (error) {
    console.error('Error fetching discord channels:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Add a single channel
export const addChannel = async (req, res) => {
  try {
    const { serverId, channelName, members } = req.body;
    
    if (!serverId) {
      return res.status(400).json({ success: false, message: 'Server ID is required.' });
    }

    const newChannel = new DiscordChannel({
      server: serverId,
      channelName,
      members: members || [],
    });

    await newChannel.save();

    // Queue emails for pending members
    try {
      const emailTasks = [];
      const inviteLink = process.env.DISCORD_INVITE_LINK || "https://discord.gg/your-invite-link";
      for (const member of members || []) {
        if (member.email && member.username && member.status !== 'joined') {
          const existingTask = await EmailQueue.findOne({ recipientEmail: member.email, status: 'pending' });
          if (!existingTask) {
            emailTasks.push({
              recipientEmail: member.email,
              username: member.username,
              role: member.role || 'mentee',
              channelName: channelName,
              inviteLink: inviteLink
            });
          }
        }
      }
      if (emailTasks.length > 0) {
        await EmailQueue.insertMany(emailTasks);
      }
    } catch (emailErr) {
      console.error("Non-fatal: Failed to queue emails in addChannel", emailErr);
    }

    triggerBotSync();
    res.status(201).json({ success: true, data: newChannel });
  } catch (error) {
    console.error('Error adding discord channel:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update a single channel (edit name, members, roles)
export const updateChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const { channelName, members } = req.body;
    
    const updatedChannel = await DiscordChannel.findByIdAndUpdate(
      id,
      { channelName, members },
      { new: true, runValidators: true }
    );
    
    if (!updatedChannel) {
      return res.status(404).json({ success: false, message: 'Channel not found.' });
    }
    
    // Queue emails for pending members
    try {
      const emailTasks = [];
      const inviteLink = process.env.DISCORD_INVITE_LINK || "https://discord.gg/your-invite-link";
      for (const member of members || []) {
        if (member.email && member.username && member.status !== 'joined') {
          const existingTask = await EmailQueue.findOne({ recipientEmail: member.email, status: 'pending' });
          if (!existingTask) {
            emailTasks.push({
              recipientEmail: member.email,
              username: member.username,
              role: member.role || 'mentee',
              channelName: channelName,
              inviteLink: inviteLink
            });
          }
        }
      }
      if (emailTasks.length > 0) {
        await EmailQueue.insertMany(emailTasks);
      }
    } catch (emailErr) {
      console.error("Non-fatal: Failed to queue emails in updateChannel", emailErr);
    }

    triggerBotSync();
    res.status(200).json({ success: true, data: updatedChannel });
  } catch (error) {
    console.error('Error updating discord channel:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Delete a single channel
export const deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Tell bot to explicitly delete from Discord
    const channelToDelete = await DiscordChannel.findById(id);
    if (channelToDelete && channelToDelete.discordChannelId) {
      try {
        await axios.delete(`http://127.0.0.1:3001/api/channels/${channelToDelete.discordChannelId}`);
      } catch (e) {
        console.log("Failed to delete from Discord (Bot unreachable)");
      }
    }
    
    await DiscordChannel.findByIdAndDelete(id);
    triggerBotSync();
    res.status(200).json({ success: true, message: 'Channel deleted successfully.' });
  } catch (error) {
    console.error('Error deleting discord channel:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Bulk delete channels
export const bulkDeleteChannels = async (req, res) => {
  try {
    const { channelIds } = req.body;
    
    if (!channelIds || !Array.isArray(channelIds) || channelIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No channel IDs provided for deletion.' });
    }

    // Tell bot to explicitly delete from Discord
    const channelsToDelete = await DiscordChannel.find({ _id: { $in: channelIds } });
    for (const ch of channelsToDelete) {
      if (ch.discordChannelId) {
        try {
          await axios.delete(`http://127.0.0.1:3001/api/channels/${ch.discordChannelId}`);
        } catch (e) {
          console.log(`Failed to delete channel ${ch.discordChannelId} from Discord`);
        }
      }
    }

    await DiscordChannel.deleteMany({ _id: { $in: channelIds } });
    triggerBotSync();
    res.status(200).json({ success: true, message: `${channelIds.length} channels deleted successfully.` });
  } catch (error) {
    console.error('Error bulk deleting discord channels:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Bulk add channels (parsed from frontend)
export const bulkAddChannels = async (req, res) => {
  try {
    const { serverId, channels } = req.body;
    
    if (!serverId) {
      return res.status(400).json({ success: false, message: 'Server ID is required.' });
    }

    if (!channels || !Array.isArray(channels) || channels.length === 0) {
      return res.status(400).json({ success: false, message: 'Channels array is empty or missing.' });
    }

    // Filter out duplicate channels that already exist in the database
    const existingChannels = await DiscordChannel.find({ server: serverId });
    const existingChannelNames = new Set(existingChannels.map(c => c.channelName));

    const uniqueChannels = channels.filter(ch => ch.channelName && !existingChannelNames.has(ch.channelName));

    if (uniqueChannels.length === 0) {
      return res.status(200).json({ success: true, message: 'No new channels to add. All provided channels already exist.' });
    }

    const channelsToInsert = uniqueChannels.map(ch => ({
      server: serverId,
      channelName: ch.channelName,
      members: ch.members || []
    }));

    // Bulk insert
    await DiscordChannel.insertMany(channelsToInsert);

    // Queue emails for pending members
    const emailTasks = [];
    try {
      const inviteLink = process.env.DISCORD_INVITE_LINK || "https://discord.gg/your-invite-link";
      
      for (const ch of uniqueChannels) {
        for (const member of ch.members) {
          if (member.email && member.username) {
            // Check if they are already in the queue to prevent spam
            const existingTask = await EmailQueue.findOne({ recipientEmail: member.email, status: 'pending' });
            if (!existingTask) {
              emailTasks.push({
                recipientEmail: member.email,
                username: member.username,
                role: member.role || 'mentee',
                channelName: ch.channelName,
                inviteLink: inviteLink
              });
            }
          }
        }
      }
      
      if (emailTasks.length > 0) {
        await EmailQueue.insertMany(emailTasks);
      }
    } catch (emailErr) {
      console.error("Non-fatal: Failed to queue emails in bulkAddChannels", emailErr);
    }

    triggerBotSync();

    res.status(201).json({ 
      success: true, 
      message: `${channelsToInsert.length} channels added successfully. ${channels.length - uniqueChannels.length} duplicates skipped. ${emailTasks.length} emails queued.` 
    });
  } catch (error) {
    console.error('Error in bulkAddChannels:', error);
    res.status(500).json({ success: false, message: 'Error saving channels data.' });
  }
};
