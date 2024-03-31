const { Embed } = require("../models");
const { getEmbedByName } = require("../services/Embed");

module.exports = {
    name: "update_thumnail_embed",
    description: "Modifie le Thumbnail de l'Embed",
    options: [
        {
            name: 'embed_name',
            type: 'STRING',
            required: true,
            description: "Le nom de l'Embed à modifier"
        },
        {
            name: 'thumbnail_url',
            type: 'STRING',
            required: true,
            description: "L'URL du Thumbnail"
        },
        {
            name: 'wanna_delete',
            required: false,
            type: "BOOLEAN",
            description: "Voulez-vous supprimer la couleur de l'Embed ?"
        }
    ],
    runSlash: async (client, interaction) => {
        const embedName = interaction.options.getString('embed_name');
        const embed = getEmbedByName(embedName);
        if(!embed) {
            return interaction.reply({
                content: "L'Embed que vous voulez modifier n'existe pas !",
                ephemeral: true,
            })
        }

        const needToDelete = interaction.options.getBoolean('wanna_delete');
        const thumbnailUrl = needToDelete ? null : interaction.options.getString('thumbnail_url');

        try {
            await Embed.update({ thumbnailUrl }, { where: { name: embedName } });
            embed.update('thumbnailUrl', thumbnailUrl);
            return interaction.reply({
                content: "Le swiper de l'Embed a bien été modifié",
                ephemeral: true,
                embeds: [embed.generateEmbed()]
            });
        } catch (e) {
            console.error(e);
            return interaction.reply({
                content: "Something bad happened",
                ephemeral: true,
            });
        }
    }
}