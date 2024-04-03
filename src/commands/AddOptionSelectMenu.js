const { Client, CommandInteraction, AutocompleteInteraction } = require("discord.js");
const { sendAutocomplete } = require("../tools/autocomplete");
const { getListSelectMenu, getSelectMenuByName } = require("../services/SelectMenu");
const { getListEmbed, getEmbedByName } = require("../services/Embed");
const { sendBadInteraction } = require("../tools/discord");

module.exports = {
    name: 'add_option_select_menu',
    description: 'Ajoute une option à un Select Menu',
    group: 'Select Menu',
    options: [
        {
            name: 'select_menu_name',
            type: "STRING",
            required: true,
            description: "Le nom du Select Menu à modifier",
            autocomplete: true,
        },
        {
            name: 'option_label',
            type: "STRING",
            required: true,
            description: "Le titre de l'option"
        },
        {
            name: 'embed_name',
            type: "STRING",
            required: true,
            description: "Le nom de l'Embed à envoyer quand l'option sera sélectionné",
            autocomplete: true,
        },
        {
            name: "option_description",
            type: "STRING",
            required: false,
            description: "La description de l'option"
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: async (client, interaction) => {
        const selectMenuName = interaction.options.getString('select_menu_name');
        const optionLabel = interaction.options.getString('option_label');
        const embedName = interaction.options.getString('embed_name');
        const optionDescription = interaction.options.getString('option_description');

        // Check if the menu exists
        const selectMenu = getSelectMenuByName(selectMenuName);
        if(!selectMenu) return sendBadInteraction(interaction, "Le Select Menu n'existe pas !");

        // Check if the embed exists
        const embed = getEmbedByName(embedName);
        if(!embed) return sendBadInteraction(interaction, "Aucun Embed n'a été trouvé avec ce nom !");

        // Check if the option exists
        if(selectMenu.getOptionByLabel(optionLabel)) return sendBadInteraction(interaction, "Une option avec ce label existe déjà dans ce Select Menu !");

        // Check the length of the option label
        if(optionLabel.length > 25) return sendBadInteraction(interaction, "Le label est trop long. Longueur maximale : 25 caracteres");

        // Check the length of the option description
        if(optionDescription.length > 50) return sendBadInteraction(interaction, "La description est trop longue. Longueur maximale : 50 caracteres");

        try {
            if (await selectMenu.addOption(embed.uid, optionLabel, optionDescription)) return sendBadInteraction(interaction, "L'option a bien été ajouté");
            else return sendBadInteraction(interaction);
        } catch (error) {
            console.error(error);
            return sendBadInteraction();
        }
    },
    /**
     *
     * @param {AutocompleteInteraction} interaction
     */
    autocomplete: interaction => {
        const list = interaction.options.getFocused(true).name === 'select_menu_name' ? getListSelectMenu() : getListEmbed();
        return sendAutocomplete(interaction, list, 'name');
    }
}