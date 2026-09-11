/**
 * Channel and Category Name Constants
 */

const CHANNELS = {
    // Category Names
    PRIVATE_CHANNELS_CATEGORY: process.env.PRIVATE_CHANNELS_CATEGORY || 'Private Channels',
    ADMIN_CHANNELS_CATEGORY: process.env.ADMIN_CHANNELS_CATEGORY || 'Admin Channels',
    WELCOME_FAREWELL_CATEGORY: process.env.WELCOME_FAREWELL_CATEGORY || 'Welcome and Farewell',

    // Channels
    CHANGE_LOG_CHANNEL: process.env.LOG_CHANNEL_NAME || 'change-log',
    WELCOME_CHANNEL: process.env.WELCOME_CHANNEL_NAME || 'welcome',
    FAREWELL_CHANNEL: process.env.FAREWELL_CHANNEL_NAME || 'farewell',
    
    // Aliases for matching existing log channels
    CHANGE_LOG_ALIASES: [
        (process.env.LOG_CHANNEL_NAME || 'change-log').toLowerCase(),
        'change-log',
        'channel-log',
        'change_log',
        'channel_log'
    ]
};

module.exports = CHANNELS;
