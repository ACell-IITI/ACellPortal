/**
 * Bot Notifier Utility
 * 
 * Sends HTTP notifications to the Discord bot's sync service
 * when the backend mutates Discord-related data.
 * 
 * Fire-and-forget: failures are logged but don't block the backend response.
 */

const BOT_SYNC_URL = process.env.BOT_SYNC_URL || 'http://localhost:3500';

/**
 * Sends a notification to the bot's sync service.
 * @param {string} action - Sync action path (e.g., 'channel-added', 'member-added')
 * @param {Object} payload - Data to send to the bot
 */
export const notifyBot = async (action, payload) => {
    const url = `${BOT_SYNC_URL}/sync/${action}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`[botNotifier] ✅ Bot sync '${action}' succeeded:`, data);
        } else {
            console.warn(`[botNotifier] ⚠️ Bot sync '${action}' returned ${response.status}:`, data);
        }
    } catch (error) {
        // Fire-and-forget: bot might be offline, don't crash the backend
        console.warn(`[botNotifier] ⚠️ Could not reach bot sync service at ${url}:`, error.message);
    }
};

/**
 * Triggers a full sync between DB and Discord.
 * @param {string} [serverMongoId] - Optional: sync only a specific server
 */
export const triggerFullSync = async (serverMongoId) => {
    return notifyBot('full-sync', { serverMongoId });
};
