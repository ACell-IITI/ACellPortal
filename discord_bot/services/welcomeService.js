const { EmbedBuilder, ChannelType } = require('discord.js');
const { WELCOME_CHANNEL, FAREWELL_CHANNEL, WELCOME_FAREWELL_CATEGORY } = require('../channels');
const { getOrCreateCategory } = require('./categoryService');

/**
 * Finds or creates a text channel in the guild under a designated category.
 * 
 * @param {Guild} guild - Discord Guild
 * @param {string} channelName - Name of the channel
 * @param {string} categoryName - Name of the parent category
 * @returns {Promise<TextChannel|null>}
 */
const getOrCreateTextChannel = async (guild, channelName, categoryName) => {
    try {
        let channels;
        try {
            channels = await guild.channels.fetch();
        } catch (e) {
            channels = guild.channels.cache;
        }

        let channel = channels.find(
            ch => ch && ch.isTextBased() && ch.name.toLowerCase() === channelName.toLowerCase()
        );

        if (channel) {
            return channel;
        }

        // If not found, find or create category and then create the channel
        const category = await getOrCreateCategory(guild, categoryName);

        channel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: category ? category.id : undefined,
        });

        console.log(`[welcomeService] Created missing channel '${channelName}' in guild '${guild.name}'`);
        return channel;
    } catch (error) {
        console.error(`[welcomeService] Error finding or creating channel '${channelName}':`, error);
        return null;
    }
};

/**
 * Sends a welcome message and embed to the 'welcome' channel.
 * 
 * @param {GuildMember} member - Joining member
 */
const sendWelcomeMessage = async (member) => {
    try {
        const welcomeChannel = await getOrCreateTextChannel(
            member.guild,
            WELCOME_CHANNEL,
            WELCOME_FAREWELL_CATEGORY
        );

        if (!welcomeChannel) {
            console.warn(`[welcomeService] Could not find or create welcome channel in '${member.guild.name}'`);
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('🎉 Welcome to the Server!')
            .setDescription(`Welcome to **${member.guild.name}**, ${member}! We're thrilled to have you join us.`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setColor(0x00FF7F) // Spring Green
            .addFields(
                { name: 'User', value: `${member.user.tag} (${member.id})`, inline: true },
                { name: 'Member Count', value: `#${member.guild.memberCount}`, inline: true }
            )
            .setFooter({ text: `Guild: ${member.guild.name}` })
            .setTimestamp();

        await welcomeChannel.send({
            content: `Hey ${member}, welcome to **${member.guild.name}**! 👋`,
            embeds: [embed]
        });

        console.log(`[welcomeService] Dropped welcome message for '${member.user.username}' in #${welcomeChannel.name}`);
    } catch (error) {
        console.error('[welcomeService] Error sending welcome message:', error);
    }
};

/**
 * Sends a farewell message and embed to the 'farewell' channel.
 * 
 * @param {GuildMember} member - Leaving member
 */
const sendFarewellMessage = async (member) => {
    try {
        const farewellChannel = await getOrCreateTextChannel(
            member.guild,
            FAREWELL_CHANNEL,
            WELCOME_FAREWELL_CATEGORY
        );

        if (!farewellChannel) {
            console.warn(`[welcomeService] Could not find or create farewell channel in '${member.guild.name}'`);
            return;
        }

        const username = member.user ? member.user.tag : 'Unknown Member';
        const avatarUrl = member.user ? member.user.displayAvatarURL({ dynamic: true }) : null;

        const embed = new EmbedBuilder()
            .setTitle('👋 Member Left')
            .setDescription(`**${username}** has left **${member.guild.name}**. We wish them the best!`)
            .setThumbnail(avatarUrl)
            .setColor(0xE74C3C) // Red
            .addFields(
                { name: 'User', value: `${username} (${member.id})`, inline: true },
                { name: 'Remaining Members', value: `${member.guild.memberCount}`, inline: true }
            )
            .setFooter({ text: `Guild: ${member.guild.name}` })
            .setTimestamp();

        await farewellChannel.send({
            content: `**${username}** has left the server. 👋`,
            embeds: [embed]
        });

        console.log(`[welcomeService] Dropped farewell message for '${username}' in #${farewellChannel.name}`);
    } catch (error) {
        console.error('[welcomeService] Error sending farewell message:', error);
    }
};

module.exports = {
    sendWelcomeMessage,
    sendFarewellMessage,
    getOrCreateTextChannel
};
