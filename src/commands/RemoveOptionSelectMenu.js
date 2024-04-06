const { Client, CommandInteraction, AutocompleteInteraction } = require("discord.js");
const { sendAutocomplete } = require("../tools/autocomplete");
const { getListSelectMenu, getSelectMenuByName } = require("../services/SelectMenu");
const { sendBadInteraction } = require("../tools/discord");

module.exports = {
    name: 'remove_option_select_menu',
    description: "Supprime une option d'un Select Menu",
    group: "Select Menu",
    options: [
        {
            name: 'select_menu_name',
            type: "STRING",
            required: true,
            autocomplete: true,
            description: "Le nom du Select Menu à modifier"
        },
        {
            name: "option_label",
            type: "STRING",
            required: true,
            description: "Le label de l'option à supprimer",
            autocomplete: true,
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: async (client, interaction) => {
        const optionLabel = interaction.options.getString('option_label');
        const selectMenu = getSelectMenuByName(interaction.options.getString('select_menu_name'));

        if(!selectMenu) return sendBadInteraction(interaction, "Aucun Select Menu n'a été trouvé avec ce nom !");
        if(!selectMenu.getOptionByLabel(optionLabel)) return sendBadInteraction(interaction, "Aucun label n'a été trouvé avec ce nom !");

        try {
            const result = await selectMenu.removeOption(optionLabel, client);
            if(result) return sendBadInteraction(interaction, "L'option a bien été supprimé !");
            return sendBadInteraction(interaction);
        } catch(e) {
            console.error(e);
            return sendBadInteraction(interaction);
        }
    },
    /**
     *
     * @param {AutocompleteInteraction} interaction
     */
    autocomplete: interaction => {
        if(interaction.options.getFocused(true).name === 'select_menu_name') {
            return sendAutocomplete(interaction, getListSelectMenu(), 'name')
        } else {
            const selectMenu = getSelectMenuByName(interaction.options.getString('select_menu_name'));
            if(selectMenu) return sendAutocomplete(interaction, selectMenu.options, 'label');
        }
    }
}