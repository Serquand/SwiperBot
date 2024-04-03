const { Client, CommandInteraction } = require("discord.js");
const { getSelectMenuByName } = require("../services/SelectMenu");

module.exports = {
    name: 'create_select_menu',
    group: 'Select Menu',
    options: [
        {
            name: 'select_menu_name',
            type: 'STRING',
            required: true,
            description: "Le nom du menu à créer"
        },
        {
            name: 'select_menu_description',
            type: 'STRING',
            required: true,
            description: "La description nom du menu à créer"
        },
        {
            name: 'select_menu_title',
            type: 'STRING',
            required: true,
            description: "Le nom du menu à créer"
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: (client, interaction) => {
        const selectMenuName = interaction.options.getString('select_menu_name');
        const selectMenuDescription = interaction.options.getString('select_menu_description');
        const selectMenuTitle = interaction.options.getString('select_menu_title');
        console.log(selectMenuName, selectMenuDescription, selectMenuTitle);

        // Check length of selectMenuName
        if(selectMenuName.length > 250) {
            return interaction.reply({
                content: "Le nom est trop long. Limite : 250 caractères.",
                ephemeral: true
            });
        }

        // Check if selectMenuName is already selected
        if (getSelectMenuByName(selectMenuName)) {
            return interaction.reply({
                content: "Ce nom est déjà pris.",
                ephemeral: true
            });
        }

        // Check if the description is too long
        if (selectMenuDescription.length > 4_000) {
            return interaction.reply({
                content: "La description est trop longue. Limite : 4 000 caractères.",
                ephemeral: true,
            });
        }

        if(selectMenuTitle.length > 50) {
            return interaction.reply({
                content: "Le titre est trop long. Limite : 50 caractères.",
                ephemeral: true,
            });
        }
    }
}