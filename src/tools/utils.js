const { promisify } = require("util");
const { glob } = require("glob");
const { MessageSelectMenu, MessageActionRow } = require('discord.js');

/**
 *
 * @param {String} path
 * @returns {Promise<Array<String>>}
 */
const getAllFilesFromDirectory = async (path) => {
    return await promisify(glob)(path);
}

const getNextIndex = (currentIndex, length) => {
    if(currentIndex >= length - 1) return 0;
    return currentIndex + 1;
}

const getPreviousIndex = (currentIndex, length) => {
    if (currentIndex === 0) return length - 1;
    return currentIndex - 1;
}

/**
 *
 * @param {Channel} channel
 * @param {String} emoji
 * @returns {Promise<boolean>}
 */
async function isGoodEmoji (channel, emoji) {
    try {
        const component = new MessageActionRow()
            .addComponents(new MessageSelectMenu()
                .setOptions({ label: 'Test', value: 'Test', emoji })
                .setCustomId('customId')
                .setPlaceholder('this.placeholder')
            )

        const message = await channel.send({ components: [component] });
        await message.delete();
        return true;
    } catch {
        return false;
    }
}

module.exports = {
    getAllFilesFromDirectory,
    getNextIndex,
    getPreviousIndex,
    isGoodEmoji,
}