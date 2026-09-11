import DiscordServer from '../models/DiscordServer_model.js';
import DiscordChannel from '../models/DiscordChannel_model.js';
import xlsx from 'xlsx';

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
    res.status(201).json({ success: true, data: newChannel });
  } catch (error) {
    console.error('Error adding discord channel:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Delete a single channel
export const deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;
    await DiscordChannel.findByIdAndDelete(id);
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

    await DiscordChannel.deleteMany({ _id: { $in: channelIds } });
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

    const channelsToInsert = channels.map(ch => ({
      server: serverId,
      channelName: ch.channelName || '',
      members: ch.members || []
    }));

    // Bulk insert
    await DiscordChannel.insertMany(channelsToInsert);

    res.status(201).json({ 
      success: true, 
      message: `${channelsToInsert.length} channels added successfully.` 
    });
  } catch (error) {
    console.error('Error in bulkAddChannels:', error);
    res.status(500).json({ success: false, message: 'Error saving channels data.' });
  }
};
