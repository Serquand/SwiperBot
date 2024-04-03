const { SelectMenu: ModelSelectMenu, SelectMenuInChannel: ModelSelectMenuInChannel, SelectMenuOption: ModelSelectMenuOption } = require('../models');
const { MessageSelectMenu, TextChannel, MessageActionRow } = require('discord.js');

/**
 * @typedef SelectMenuOption
 * @type {object}
 * @property {string} needToSend - The Embed that will be sent
 * @property {string} linkedTo - The Select Menu link
 * @property {string} label - The label of the option
 * @property {string} description - The description of the option
 */

/**
 * @type {Array<SelectMenu>}
 */
let listOfSelectMenu = [];
let listOfSelectMenuInChannel = [];

class SelectMenuInChannel {
    constructor (channelId, messageId, linkedTo) {
        this.channelId = channelId;
        this.messageId = messageId;
        this.linkedTo = linkedTo;
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
     * @returns {Promise<boolean>}
     */
    async addOption(needToSend, label, description) {
        try {
            await ModelSelectMenuOption.create({ description, label, needToSend, linkedTo: this.selectMenuUid });
            await this.synchronize();
            this.options.push({ description, label, needToSend, linkedTo: this.selectMenuUid });
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    update(key, value) {
        this[key] = value;
    }

    async removeOption(label) {
        try {
            await ModelSelectMenuOption.destroy({ where: { linkedTo: this.selectMenuUid, label } });
            await this.synchronize();
            this.options = this.options.filter(option => option.label !== label);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    getOptionByLabel(labelOption) {
        return this.options.find(option => option.label === labelOption);
    }

    async synchronize() {

    }



    generateSelectMenu () {
        const optionsToSend = this.options.map((option) => ({ label: option.label, value: option.needToSend, description: option.description }));
        return new MessageSelectMenu()
            .setOptions(...optionsToSend)
            .setCustomId(this.selectMenuUid)
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
        const component = new MessageActionRow().addComponents(selectMenu.generateSelectMenu());
        const message = await channel.send({ components: [component] });
        await ModelSelectMenuInChannel.create({ linkedTo: selectMenu.selectMenuUid, channelId: channel.id, messageId: message.id });
        listOfSelectMenuInChannel.push(new SelectMenuInChannel(channel.id, message.id, selectMenu.selectMenuUid));
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
                description: option.description
            }));
        const newSelectMenu = new SelectMenu(sm.name, sm.description, sm.uid, sm.placeholder, listOptionAssigned);
        listOfSelectMenu.push(newSelectMenu);
    });

    allSelectMenuInChannels.forEach(inChannel => {
        listOfSelectMenuInChannel.push(new SelectMenuInChannel(inChannel.channelId, inChannel.messageId, inChannel.linkedTo));
    })
}

module.exports = {
    SelectMenu,
    getSelectMenuByName,
    getListSelectMenu,
    sendASelectMenu,
    createSelectMenu,
    initializeSelectMenu,
}