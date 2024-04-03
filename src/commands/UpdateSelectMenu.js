const { Client, CommandInteraction } = require("discord.js");
const { getListSelectMenu, getSelectMenuByName } = require("../services/SelectMenu");
const { sendAutocomplete } = require("../tools/autocomplete");
const { sendBadInteraction } = require("../tools/discord");
const { SelectMenu } = require("../models");

module.exports = {
    name: 'update_select_menu',
    description: "Modifie un Select Menu",
    group: "Select Menu",
    options: [
        {
            name: 'select_menu_name',
            type: "STRING",
            required: true,
            description: "Le nom du Select Menu à modifier",
            autocomplete: true,
        },
        {
            name: 'select_menu_description',
            type: "STRING",
            required: false,
            description: "La description du Select Menu à modifier",
        },
        {
            name: 'select_menu_placeholder',
            type: "STRING",
            required: false,
            description: "Le placeholder du Select Menu à modifier",
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: async (client, interaction) => {
        const selectMenuName = interaction.options.getString('select_menu_name');
        const selectMenuDescription = interaction.options.getString('select_menu_description');
        const selectMenuPlaceholder = interaction.options.getString('select_menu_placeholder');
        const selectMenu = getSelectMenuByName(selectMenuName);
        if(!selectMenu) return sendBadInteraction(interaction, "");

        if(!selectMenuDescription && !selectMenuPlaceholder) return sendBadInteraction(interaction, "Vous devez modifier soit le placeholder, soit la description, soit les deux !");

        const newValue = {
            description: selectMenuDescription ?? selectMenu.description,
            placeholder: selectMenuPlaceholder ?? selectMenu.placeholder,
        };

        try {
            await SelectMenu.update(newValue, { where: { uid: selectMenu.selectMenuUid } });
            selectMenu.update('description', newValue.description);
            selectMenu.update('placeholder', newValue.placeholder);
            selectMenu.synchronize();
            return sendBadInteraction(interaction, "Vous avez bien modifié le SelectMenu !");
        } catch (e) {
            console.error(e);
            return sendBadInteraction(interaction);
        }
    },
    autocomplete: interaction => sendAutocomplete(interaction, getListSelectMenu(), 'name')
}