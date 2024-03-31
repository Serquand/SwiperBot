const { Client, CommandInteraction } = require("discord.js");
const { getEmbedByName, deleteEmbed } = require("../services/Embed");
const { sendAutocomplete } = require("../tools/autocomplete");

module.exports = {
    name: "delete_embed",
    description: "Supprime un Embed",
    options: [
        {
            name: 'embed_name',
            type: "STRING",
            required: true,
            description: "Le nom de l'Embed à supprimer",
            autocomplete: true,
        },
        {
            name: "cascade",
            type: 'BOOLEAN',
            required: false,
            description: "Voulez-vous supprimer tous les Embeds envoyés en rapport avec celui-ci ?"
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: async (client, interaction) => {
        const embedName = interaction.options.getString('embed_name');
        const cascade = interaction.options.getBoolean('cascade');

        // Check if the emebd exists
        const embed = getEmbedByName(embedName);
        if(!embed) {
            return interaction.reply({
                content: "L'Embed demandé n'existe pas !",
                ephemeral: true,
            });
        }

        try {
            if(await deleteEmbed(embed, cascade)) {
                return interaction.reply({
                    content: 'L\'Embed a bien été supprimé',
                    ephemeral: true,
                });
            } else {
                return interaction.reply({
                    content: 'Something went wrong',
                    ephemeral: true,
                });
            }
        } catch(err) {
            console.error(err);
            return interaction.reply({
                content: 'Something went wrong',
                ephemeral: true,
            });
        }
    },
    autocomplete: (interaction) => sendAutocomplete(interaction, getListEmbed(), 'name')
}