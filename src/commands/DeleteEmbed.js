const { Client, CommandInteraction } = require("discord.js");
const { getEmbedByName, deleteEmbed, getListEmbed } = require("../services/Embed");
const { sendAutocomplete } = require("../tools/autocomplete");
const { sendBadInteraction } = require("../tools/discord");

module.exports = {
    name: "delete_embed",
    description: "Supprime un Embed",
    group: "Embed",
    options: [
        {
            name: 'embed_name',
            type: "STRING",
            required: true,
            description: "Le nom de l'Embed à supprimer",
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
        if(!embed) {
            return interaction.reply({
                content: "L'Embed demandé n'existe pas !",
                ephemeral: true,
            });
        }

        try {
            if(await deleteEmbed(embed)) return sendBadInteraction(interaction, 'L\'Embed a bien été supprimé');
            else return sendBadInteraction(interaction);
        } catch(err) {
            console.error(err);
            return sendBadInteraction(interaction);
        }
    },
    autocomplete: (interaction) => sendAutocomplete(interaction, getListEmbed(), 'name')
}