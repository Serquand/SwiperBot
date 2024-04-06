const { v4 } = require('uuid');
const { SelectMenu: ModelSelectMenu, SelectMenuInChannel: ModelSelectMenuInChannel, SelectMenuOption: ModelSelectMenuOption } = require('../models');
const { MessageSelectMenu, TextChannel, MessageActionRow, MessageComponentInteraction, Message, Client } = require('discord.js');
const { getEmbedByUid } = require('./Embed');
const { sendBadInteraction, fetchMessageById, generateButtonToSwitchSwiperImage } = require('../tools/discord');
const { getEmbedInteractManager } = require('./EmbedInteract');

/**
 * @typedef SelectMenuOption
 * @type {object}
 * @property {string} needToSend - The Embed that will be sent
 * @property {string} linkedTo - The Select Menu link
 * @property {string} label - The label of the option
 * @property {string} description - The description of the option
 * * @property {string} emoji - The emoji of the option
 */

/**
 * @type {Array<SelectMenu>}
 */
let listOfSelectMenu = [];

/**
 * @type {Array<SelectMenuInChannel>}
 */
let listOfSelectMenuInChannel = [];

class SelectMenuInChannel {
    constructor (channelId, messageId, linkedTo, customId) {
        this.channelId = channelId;
        this.messageId = messageId;
        this.linkedTo = linkedTo;
        this.customId = customId;
    }

    /**
     *
     * @param {MessageComponentInteraction} interaction
     */
    async respondToInteraction(interaction, client) {
        try {
            // Generate and send Embed
            const embed = getEmbedByUid(interaction.values[0]);
            if(!embed) return sendBadInteraction(interaction);
            interaction.reply({
                embeds: [embed.generateEmbed()],
                ephemeral: true,
                components: embed.hasSwiper ? [generateButtonToSwitchSwiperImage(this.customId)] : undefined,
            });
            const interactionManager = getEmbedInteractManager();
            interactionManager.addEmbedInteract(this.customId, interaction.values[0], interaction);
        } finally {
            // Update the initial message
            const selectMenu = getSelectMenuByUid(this.linkedTo);
            const components = [new MessageActionRow().addComponents(selectMenu.generateSelectMenu(this.customId))];
            const message = await fetchMessageById(client, this.channelId, this.messageId);
            message.edit({ components });
        }
    }
}

class SelectMenu {
    constructor (name, description, selectMenuUid, placeholder, options) {
        this.name = name;
        this.description = description;
        this.selectMenuUid = selectMenuUid;
        this.placeholder = placeholder;
        /**
         * @type {Array<SelectMenuOption>}
         */
        this.options = options;
    }

    /**
     *
     * @param {String} needToSend
     * @param {String} label
     * @param {String} description
     * @param {String} emoji
     * @param {Client} client
     * @returns {Promise<boolean>}
     */
    async addOption(needToSend, label, description, emoji, client) {
        try {
            await ModelSelectMenuOption.create({ description, label, needToSend, linkedTo: this.selectMenuUid, emoji });
            this.options.push({ description, label, needToSend, linkedTo: this.selectMenuUid, emoji });
            await this.synchronize(client);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    selectMenuHaAlreadyTheEmbed(embedUid) {
        return this.options.filter(option => option.needToSend === embedUid).length > 0;
    }

    update(key, value) {
        this[key] = value;
    }

    /**
     *
     * @param {String} label
     * @param {Client} client
     * @returns
     */
    async removeOption(label, client) {
        try {
            await ModelSelectMenuOption.destroy({ where: { linkedTo: this.selectMenuUid, label } });
            this.options = this.options.filter(option => option.label !== label);
            await this.synchronize(client);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    getOptionByLabel(labelOption) {
        return this.options.find(option => option.label === labelOption);
    }

    /**
     *
     * @param {Client} client
     */
    async synchronize(client) {
        const listOfSelectMenuSent = listOfSelectMenuInChannel.filter(sm => sm.linkedTo === this.selectMenuUid);
        for(const msgSend of listOfSelectMenuSent) {
            const components = [new MessageActionRow().addComponents(this.generateSelectMenu(msgSend.customId))];
            const msg = await fetchMessageById(client, msgSend.channelId, msgSend.messageId);
            if(this.options.length === 0) {
                await this.removeSelectMenu();
                await msg.delete();
            } else {
                await msg.edit({ components });
            }
        }
    }

    async removeSelectMenu() {

    }

    generateSelectMenu (customId) {
        const optionsToSend = this.options.map((option) => ({
            label: option.label,
            value: option.needToSend,
            description: option.description,
            emoji: option.emoji,
        }));
        return new MessageSelectMenu()
            .setOptions(...optionsToSend)
            .setCustomId(customId)
            .setPlaceholder(this.placeholder)
    }
}

/**
 *
 * @param {SelectMenu} selectMenu
 * @param {TextChannel} channel
 *
 */
async function sendASelectMenu(selectMenu, channel) {
    try {
        const customId = v4();
        const component = new MessageActionRow().addComponents(selectMenu.generateSelectMenu(customId));
        const message = await channel.send({ components: [component] });
        await ModelSelectMenuInChannel.create({ linkedTo: selectMenu.selectMenuUid, channelId: channel.id, messageId: message.id, uid: customId });
        listOfSelectMenuInChannel.push(new SelectMenuInChannel(channel.id, message.id, selectMenu.selectMenuUid, customId));
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

/**
 * @return {Array<SelectMenu>}
 */
function getListSelectMenu() {
    return listOfSelectMenu
}

/**
 *
 * @param {SelectMenu | undefined} name
 */
function getSelectMenuByName(name) {
    return listOfSelectMenu.find(selectMenu => selectMenu.name === name);
}

/**
 *
 * @param {String} name
 * @param {String} description
 * @param {String} placeholder
 * @returns {Promise<boolean>}
 */
async function createSelectMenu(name, description, placeholder) {
    try {
        const {dataValues: data} = await ModelSelectMenu.create({ name, description, placeholder });
        listOfSelectMenu.push(new SelectMenu(name, description, data.uid, placeholder, []));
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

/**
 *
 * @param {SelectMenuInChannel | undefined} customId
 * @returns
 */
function getSelectMenuInChannelByCustomId (customId) {
    return listOfSelectMenuInChannel.find(sm => sm.customId === customId);
}

/**
 *
 * @param {String} uid
 * @returns {SelectMenu | undefined}
 */
function getSelectMenuByUid(uid) {
    return listOfSelectMenu.find(sm => sm.selectMenuUid === uid);
}

async function initializeSelectMenu() {
    const [allSelectMenus, allSelectMenuInChannels, allSelectMenuOptions] = await Promise.all([
        ModelSelectMenu.findAll({ raw: true }),
        ModelSelectMenuInChannel.findAll({ raw: true }),
        ModelSelectMenuOption.findAll({ raw: true }),
    ]);
    allSelectMenus.forEach(sm => {
        const listOptionAssigned = allSelectMenuOptions
            .filter(option => option.linkedTo === sm.uid)
            .map(option => ({
                needToSend: option.needToSend,
                linkedTo: option.linkedTo,
                label: option.label,
                description: option.description,
                emoji: option.emoji
            }));
        const newSelectMenu = new SelectMenu(sm.name, sm.description, sm.uid, sm.placeholder, listOptionAssigned);
        listOfSelectMenu.push(newSelectMenu);
    });
    allSelectMenuInChannels.forEach(inChannel => {
        listOfSelectMenuInChannel.push(new SelectMenuInChannel(inChannel.channelId, inChannel.messageId, inChannel.linkedTo, inChannel.uid));
    });
}

/**
 *
 * @returns {Array<SelectMenuInChannel>}
 */
function getListOfSelectMenuInChannel() {
    return listOfSelectMenuInChannel;
}

function deleteAllSelectMenuByUid(uid) {
    listOfSelectMenu = listOfSelectMenu.filter(sm => sm.selectMenuUid !== uid);
    listOfSelectMenuInChannel = listOfSelectMenuInChannel.filter(sm => sm.linkedTo !== uid);
}

module.exports = {
    SelectMenu,
    getSelectMenuByName,
    getListSelectMenu,
    sendASelectMenu,
    createSelectMenu,
    initializeSelectMenu,
    getSelectMenuInChannelByCustomId,
    getSelectMenuByUid,
    getListOfSelectMenuInChannel,
    deleteAllSelectMenuByUid
}