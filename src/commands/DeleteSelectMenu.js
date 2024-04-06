const { sendAutocomplete } = require('../tools/autocomplete');
const { getListSelectMenu, getSelectMenuByName, getListOfSelectMenuInChannel, deleteAllSelectMenuByUid } = require('../services/SelectMenu');
const { Client, CommandInteraction } = require('discord.js');
const { sendBadInteraction, fetchMessageById } = require('../tools/discord');
const { SelectMenu } = require('../models');

module.exports = {
    name: 'delete_select_menu',
    group: "Select Menu",
    description: "Supprime un Select Menu et tous ses enfants envoyés",
    options: [
        {
            name: 'select_menu_name',
            type: "STRING",
            autocomplete: true,
            description: "Le nom du Select Menu à supprimer",
            required: true,
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: async (client, interaction) => {
        // Check if the select menu really exists
        const selectMenu = getSelectMenuByName(interaction.options.getString('select_menu_name'));
        if(!selectMenu) return sendBadInteraction(interaction, "Le Select Menu que vous voulez supprimer n'existe pas !");

        try {
            await SelectMenu.destroy({ where: { uid: selectMenu.selectMenuUid } });

            // Fetch all the messages and delete those
            const listOfSMToDelete = getListOfSelectMenuInChannel().filter(sm => sm.linkedTo === selectMenu.selectMenuUid);
            for(const sm of listOfSMToDelete) {
                const messageToDelete = await fetchMessageById(client, sm.channelId, sm.messageId);
                await messageToDelete.delete();
            }

            deleteAllSelectMenuByUid(selectMenu.selectMenuUid);

            return sendBadInteraction(interaction, "Le Select Menu a bien été supprimé");
        } catch (err) {
            console.error(err);
            return sendBadInteraction(interaction);
        }
    },
    autocomplete: interaction => sendAutocomplete(interaction, getListSelectMenu(), 'name'),
}