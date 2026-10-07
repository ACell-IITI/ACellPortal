// ==========================================
// LOOP PREVENTION SYSTEM
// ==========================================
// When Bot makes a change on Discord, Discord fires an event.
// We ignore Discord events for channels in this Set.
export const recentBotActions = new Set();

export const lockAction = (id) => recentBotActions.add(id);

export const unlockAction = (id) => {
    setTimeout(() => recentBotActions.delete(id), 5000); // Unlock after 5s
};
