const { Client, Message, Guild, Channel, TextChannel } = require("discord.js");

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

module.exports = {
    fetchMessageById,
    getTheGuild,
    getTheChannel,
    getTheMessage,
}