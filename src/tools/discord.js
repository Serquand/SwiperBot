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
 * @param {Channel}
 */
function getTheChannel(client, channelId) {
    return client.channels.fetch(channelId);
}

/**
 *
 * @param {TextChannel} channel
 * @param {String} messageId
 */
function getTheMessage(channel, messageId) {
    return channel.messages.fetch(messageId);
}

/**
 *
 * @param {Client} client
 * @param {String} messageId
 * @returns {Message}
 */
async function fetchMessageById (client, channelId, messageId) {
    return getTheMessage(getTheChannel(client, channelId), messageId);
}

module.exports = {
    fetchMessageById,
    getTheGuild,
    getTheChannel,
    getTheMessage,
}