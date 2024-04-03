const { Client, CommandInteraction } = require("discord.js");
const { getListSelectMenu, getSelectMenuByName, sendASelectMenu } = require("../services/SelectMenu");
const { sendAutocomplete } = require("../tools/autocomplete");

module.exports = {
    name: 'send_select_menu',
    description: "Envoie un Select Menu dans le channel souhaité",
    group: 'Select Menu',
    options: [
        {
            name: 'select_menu_name',
            type: 'STRING',
            required: true,
            description: "Le nom du Select Menu à envoyer",
            autocomplete: true,
        },
        {
            name: "channel",
            type: "CHANNEL",
            required: true,
            description: "Le nom du Channel où envoyer le Select Menu"
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: async (client, interaction) => {
        const selectMenuName = interaction.options.getString('select_menu_name');
        const channel = interaction.options.getChannel('channel');

        // Check if the selectMenuName exists
        const selectMenu = getSelectMenuByName(selectMenuName);
        if(!selectMenu) {
            return interaction.reply({
                content: "Le Select Menu que vous voulez envoyer n'existe pas !",
                ephemeral: true
            });
        }

        if(selectMenu.options.length === 0) {
            return interaction.reply({
                content: "Le Select Menu que vous voulez envoyer n'a pas de champ et ne peut donc pas être envoyé !",
                ephemeral: true
            });
        }

        if(!channel.isText()) {
            return interaction.reply({
                content: "Vous ne pouvez pas envoyer de message dans ce channel !",
                ephemeral: true
            });
        }

        try {
            const result = await sendASelectMenu(selectMenu, channel);
            if(result) {
                return interaction.reply({
                    content: "Le Select Menu a bien été envoyé !",
                    ephemeral: true
                })
            } else {
                return interaction.reply({
                    content: "Something went wrong",
                    ephemeral: true
                })
            }
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: "Something went wrong",
                ephemeral: true
            })
        }
    },
    autocomplete: interaction => sendAutocomplete(interaction, getListSelectMenu(), 'name')
}