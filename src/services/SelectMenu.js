const { MessageSelectMenu } = require('discord.js');

/**
 * @type {Array<SelectMenu>}
 */
let listOfSelectMenu = [];

class SelectMenu {
    constructor (name, description, selectMenuUid, placeholder, options) {
        this.name = name;
        this.description = description;
        this.selectMenuUid = selectMenuUid;
        this.placeholder = placeholder;
        this.options = options;
    }

    async addOption() {

    }
}

/**
 *
 * @param {SelectMenu | undefined} name
 */
function getSelectMenuByName(name) {
    return listOfSelectMenu.find(selectMenu => selectMenu.name === name);
}

module.exports = {
    SelectMenu,
    getSelectMenuByName,
}