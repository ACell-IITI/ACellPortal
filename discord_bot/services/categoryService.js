const { ChannelType, PermissionFlagsBits, OverwriteType } = require('discord.js');
const { PRIVATE_CHANNELS_CATEGORY, ADMIN_CHANNELS_CATEGORY } = require('../channels');

/**
 * Finds or creates a category channel in the guild.
 * 
 * @param {Guild} guild - Discord Guild instance
 * @param {string} categoryName - Name of the category
 * @param {boolean} [adminOnly=false] - Whether the category should be restricted to Admins only
 * @returns {Promise<CategoryChannel|null>}
 */
const getOrCreateCategory = async (guild, categoryName, adminOnly = false) => {
    try {
        let guildChannels;
        try {
            guildChannels = await guild.channels.fetch();
        } catch (err) {
            guildChannels = guild.channels.cache;
        }

        let category = guildChannels.find(
            ch => ch && ch.type === ChannelType.GuildCategory && ch.name.toLowerCase() === categoryName.toLowerCase()
        );

        if (category) {
            return category;
        }

        console.log(`[categoryService] Category '${categoryName}' not found in '${guild.name}'. Creating it...`);

        const overwrites = [];

        if (adminOnly) {
            try {
                await guild.roles.fetch();
            } catch (e) {
                // fallback to cache
            }

            let owner = null;
            try {
                owner = await guild.fetchOwner();
            } catch (e) {
                // fallback
            }

            overwrites.push(
                {
                    id: guild.roles.everyone.id,
                    type: OverwriteType.Role,
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: guild.client.user.id,
                    type: OverwriteType.Member,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ManageChannels,
                        PermissionFlagsBits.ReadMessageHistory
                    ],
                }
            );

            const addedIds = new Set([guild.roles.everyone.id, guild.client.user.id]);

            if (owner && !addedIds.has(owner.id)) {
                overwrites.push({
                    id: owner.id,
                    type: OverwriteType.Member,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ],
                });
                addedIds.add(owner.id);
            }

            guild.roles.cache.forEach(role => {
                if (
                    !addedIds.has(role.id) &&
                    role.id !== guild.roles.everyone.id &&
                    (role.permissions.has(PermissionFlagsBits.Administrator) ||
                     role.name.toLowerCase().includes('admin'))
                ) {
                    overwrites.push({
                        id: role.id,
                        type: OverwriteType.Role,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory
                        ],
                    });
                    addedIds.add(role.id);
                }
            });
        }

        category = await guild.channels.create({
            name: categoryName,
            type: ChannelType.GuildCategory,
            permissionOverwrites: overwrites
        });

        console.log(`[categoryService] ✅ Created category '${categoryName}' (ID: ${category.id}) in '${guild.name}'`);
        return category;
    } catch (error) {
        console.error(`[categoryService] Error getting or creating category '${categoryName}':`, error);
        return null;
    }
};

/**
 * Finds or creates the 'Private Channels' category.
 * @param {Guild} guild - Discord Guild instance
 * @returns {Promise<CategoryChannel|null>}
 */
const getOrCreatePrivateCategory = async (guild) => {
    return await getOrCreateCategory(guild, PRIVATE_CHANNELS_CATEGORY, false);
};

/**
 * Finds or creates the 'Admin Channels' category.
 * @param {Guild} guild - Discord Guild instance
 * @returns {Promise<CategoryChannel|null>}
 */
const getOrCreateAdminCategory = async (guild) => {
    return await getOrCreateCategory(guild, ADMIN_CHANNELS_CATEGORY, true);
};

module.exports = {
    getOrCreateCategory,
    getOrCreatePrivateCategory,
    getOrCreateAdminCategory
};
