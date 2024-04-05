const { Client, Message, Guild, Channel, TextChannel, Interaction, MessageActionRow, MessageButton } = require("discord.js");

/**
 *
 * @param {Client} client
 * @param {String} guildId
 * @returns {Guild}
 */
function getTheGuild(client, guildId) {
    return client.guilds.cache.get(guildId);
}

/**
 *
 * @param {Client} client
 * @param {String} channelId
 * @returns {Promise<Channel | null>}
 */
async function getTheChannel(client, channelId) {
    try {
        const channel = await client.channels.fetch(channelId);
        return channel;
    } catch (error) {
        return null;
    }
}

/**
 *
 * @param {TextChannel} channel
 * @param {String} messageId
 * @returns {Promise<Message | null>}
 */
async function getTheMessage(channel, messageId) {
    try {
        const message = await channel.messages.fetch(messageId);
        return message;
    } catch (error) {
        return null;
    }
}

/**
 *
 * @param {Client} client
 * @param {String} messageId
 * @returns {Promise<Message | null>}
 */
async function fetchMessageById (client, channelId, messageId) {
    try {
        const channel = await getTheChannel(client, channelId);
        if(channel === null) return null;
        return getTheMessage(channel, messageId);
    } catch (e) {
        return null;
    }
}

/**
 *
 * @param {Interaction} interaction
 */
function sendBadInteraction (interaction, error) {
    interaction.isRepliable() && interaction.reply({ content: error ||  "Something bad happened", ephemeral: true });
}

/**
 *
 * @param {String} customId
 * @returns {MessageActionRow}
 */
function generateButtonToSwitchSwiperImage (customId) {
    const nextButton = new MessageButton()
        .setCustomId(customId + '+next')
        .setEmoji("⏭️")
        .setLabel('Next image')
        .setStyle('PRIMARY')

    const previousButton = new MessageButton()
        .setCustomId(customId + '+previous')
        .setEmoji('⏮️')
        .setLabel('Previous image')
        .setStyle('PRIMARY')

    return new MessageActionRow().addComponents(previousButton, nextButton);
}

module.exports = {
    fetchMessageById,
    getTheGuild,
    getTheChannel,
    getTheMessage,
    sendBadInteraction,
    generateButtonToSwitchSwiperImage
}