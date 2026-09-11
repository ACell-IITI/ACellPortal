const DiscordServer = require('../models/DiscordServer');
const DiscordChannel = require('../models/DiscordChannel');

/**
 * Helper function to find a DiscordServer document by Discord Guild ID.
 * @param {string} guildId - Discord Guild ID
 * @returns {Promise<Object|null>}
 */
const findServerByGuildId = async (guildId) => {
    try {
        return await DiscordServer.findOne({ serverId: guildId });
    } catch (error) {
        console.error(`[mappingService] Error finding server by guildId (${guildId}):`, error);
        throw error;
    }
};

/**
 * Helper function to find channel mappings for a user in a specific Discord guild/server.
 * Checks against both userId and username in members list.
 * 
 * @param {string} guildId - Discord Guild ID
 * @param {string} userId - Discord User ID (numeric string)
 * @param {string} [username] - Discord Username / Tag
 * @returns {Promise<{ serverFound: boolean, server: Object|null, mappedChannels: Array }>}
 */
const getUserChannelMappings = async (guildId, userId, username = '') => {
    try {
        const serverDoc = await findServerByGuildId(guildId);
        if (!serverDoc) {
            return {
                serverFound: false,
                server: null,
                mappedChannels: []
            };
        }

        // Build search conditions for member matching (by userId or username)
        const memberConditions = [{ 'members.userId': userId }];
        if (username) {
            memberConditions.push({ 'members.username': username });
        }

        const mappedChannels = await DiscordChannel.find({
            server: serverDoc._id,
            $or: memberConditions
        });

        return {
            serverFound: true,
            server: serverDoc,
            mappedChannels
        };
    } catch (error) {
        console.error(`[mappingService] Error checking user channel mappings for user (${userId}):`, error);
        throw error;
    }
};

/**
 * Creates a new DiscordChannel document mapping in MongoDB.
 * 
 * @param {ObjectId|string} serverMongoId - MongoDB _id of the DiscordServer document
 * @param {string} channelName - Name of the channel
 * @param {string} userId - Discord User ID
 * @param {string} username - Discord Username
 * @returns {Promise<Object>} Created DiscordChannel document
 */
const createChannelMapping = async (serverMongoId, channelName, userId, username) => {
    try {
        const newChannel = new DiscordChannel({
            server: serverMongoId,
            channelName,
            members: [{ userId, username }]
        });
        await newChannel.save();
        console.log(`[mappingService] Created new channel mapping in DB for channel '${channelName}' and user '${username}'`);
        return newChannel;
    } catch (error) {
        console.error(`[mappingService] Error creating channel mapping for channel '${channelName}':`, error);
        throw error;
    }
};

/**
 * Adds a member to an existing DiscordChannel document if not already present.
 * 
 * @param {ObjectId|string} channelMongoId - MongoDB _id of the DiscordChannel document
 * @param {string} userId - Discord User ID
 * @param {string} username - Discord Username
 */
const addMemberToChannel = async (channelMongoId, userId, username) => {
    try {
        await DiscordChannel.findByIdAndUpdate(
            channelMongoId,
            {
                $addToSet: { members: { userId, username } }
            },
            { new: true }
        );
        console.log(`[mappingService] Added member '${username}' to channel mapping ID ${channelMongoId}`);
    } catch (error) {
        console.error(`[mappingService] Error adding member '${username}' to channel ID ${channelMongoId}:`, error);
        throw error;
    }
};

module.exports = {
    findServerByGuildId,
    getUserChannelMappings,
    createChannelMapping,
    addMemberToChannel
};

