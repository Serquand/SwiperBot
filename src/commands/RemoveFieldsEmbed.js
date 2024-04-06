const { Client, CommandInteraction, AutocompleteInteraction } = require("discord.js");
const { getEmbedByName, getListEmbed } = require("../services/Embed");
const { sendAutocomplete } = require("../tools/autocomplete");
const { sendBadInteraction } = require("../tools/discord");

module.exports = {
    name: 'remove_field_embed',
    description: "Supprime un champ d'un Embed",
    group: "Embed",
    options: [
        {
            name: 'embed_name',
            description: "Le nom de l'Embed à modifier",
            type: 'STRING',
            required: true,
            autocomplete: true,
        },
        {
            name: 'field_name',
            description: "Le nom du champ à supprimer",
            type: 'STRING',
            required: true,
            autocomplete: true,
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: async (client, interaction) => {
        const embed = getEmbedByName(interaction.options.getString('embed_name'));
        const fieldName = interaction.options.getString('field_name');

        if(!embed) return sendBadInteraction(interaction, "L'Embed que vous voulez supprimer n'existe pas !");
        if(!embed.getFieldByName(fieldName)) return sendBadInteraction(interaction, "Le champ que vous supprimer n'existe pas !")

        try {
            if(await embed.removeFieldsByName(fieldName, client)) return sendBadInteraction(interaction, "Le champ a bien été supprimé !");
            else return sendBadInteraction(interaction);
        } catch (e) {
            console.error(e);
            return sendBadInteraction(interaction);
        }
    },
    /**
     *
     * @param {AutocompleteInteraction} interaction
     */
    autocomplete: interaction => {
        if(interaction.options.getFocused(true).name === 'embed_name') {
            sendAutocomplete(interaction, getListEmbed(), 'name')
        } else if(interaction.options.getFocused(true).name === 'field_name') {
            const embed = getEmbedByName(interaction.options.getString('embed_name'));
            if(!embed) return null;
            sendAutocomplete(interaction, embed.fields, 'name');
        }
    }
}