const { Client, CommandInteraction } = require("discord.js");
const { getListSelectMenu, getSelectMenuByName } = require("../services/SelectMenu");
const { sendAutocomplete } = require("../tools/autocomplete");
const { sendBadInteraction } = require("../tools/discord");

module.exports = {
    name: 'update_select_menu',
    group: "Select Menu",
    options: [
        {
            name: 'select_menu_name',
            type: "STRING",
            required: true,
            description: "Le nom du Select Menu à modifier",
            autocompete: true,
        },
        {
            name: 'select_menu_description',
            type: "STRING",
            required: true,
            description: "La description du Select Menu à modifier",
        },
        {
            name: 'select_menu_placeholder',
            type: "STRING",
            required: true,
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
    },
    autocompete: interaction => sendAutocomplete(interaction, getListSelectMenu(), 'name')
}