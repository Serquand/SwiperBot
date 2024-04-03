const { Client, CommandInteraction } = require("discord.js");
const { getListSelectMenu, getSelectMenuByName } = require("../services/SelectMenu");
const { sendAutocomplete } = require("../tools/autocomplete");
const { sendBadInteraction } = require("../tools/discord");
const { getEmbedByUid } = require("../services/Embed");

module.exports = {
    name: "list_options_for_select_menu",
    group: "Select Menu",
    description: "Liste les options assignées à un Select Menu",
    options: [
        {
            name: 'select_menu_name',
            type: "STRING",
            required: true,
            description: "Le nom du Select Menu à modifier",
            autocomplete: true,
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: (client, interaction) => {
        const selectMenuName = interaction.options.getString('select_menu_name');
        const selectMenu = getSelectMenuByName(selectMenuName);
        if(!selectMenu) return sendBadInteraction(interaction, "Aucun Select Menu n'a été trouvé pour ce nom !");

        let content = 'Voici la liste des options : \n';
        selectMenu.options.forEach(option => {
            const embedNeedToSend = getEmbedByUid(option.needToSend);
            content += `- L'option **${option.label}**, ${option.description ? 'avec la description suivante : _*' + option.description + '*_': 'sans description'} envoie l'Embed : "${embedNeedToSend.name}".\n`;
        });

        return sendBadInteraction(interaction, content);
    },
    autocomplete: interaction => sendAutocomplete(interaction, getListSelectMenu(), 'name'),
}