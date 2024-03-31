const { Client, CommandInteraction } = require("discord.js");
const { getEmbedByName } = require("../services/Embed");

module.exports = {
    name: 'remove_field_embed',
    description: "Supprime un champ d'un Embed",
    options: [
        {
            name: 'embed_name',
            description: "Le nom de l'Embed à modifier",
            type: 'STRING',
            required: true,
        },
        {
            name: 'field_name',
            description: "Le nom du champ à supprimer",
            type: 'STRING',
            required: true,
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: async (client, interaction) => {
        const embedName = interaction.options.getString('embed_name');
        const fieldName = interaction.options.getString('field_name');

        const embed = getEmbedByName(embedName);
        if(!embed) {
            return interaction.reply({
                content: "L'Embed que vous voulez supprimer n'existe pas !",
                ephemeral: true,
            });
        }

        if(!embed.getFieldByName(fieldName)) {
            return interaction.reply({
                content: "Le champ que vous supprimer n'existe pas !",
                ephemeral: true,
            });
        }

        try {
            const result = await embed.removeFieldsByName(fieldName);
            if(result) {
                return interaction.reply({
                    content: "Le champ a bien été supprimé !",
                    ephemeral: true,
                    });
            } else {
                return interaction.reply({
                    content: "Something went wrong",
                    ephemeral: true,
                });
            }
        } catch (e) {
            return interaction.reply({
                content: "Something went wrong",
                ephemeral: true,
            });
        }
    }
}