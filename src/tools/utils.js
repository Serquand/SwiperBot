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
                .setPlaceholder('Test')
            )

        const message = await channel.send({ components: [component] });
        await message.delete();
        return true;
    } catch {
        return false;
    }
}

/**
 *
 * @param {String} color
 * @returns {boolean}
 */
function isValidColor(color) {
    if(!color.startsWith('#') || !color.split('#').length === 1 || color.length !== 7) return false;
    const codeHexa = color.split('#')[1];
    const codeDeci = parseInt(codeHexa, 16);
    return codeDeci >= 0 && codeDeci <= 16777215;
}

module.exports = {
    getAllFilesFromDirectory,
    getNextIndex,
    getPreviousIndex,
    isGoodEmoji,
    isValidColor,
}