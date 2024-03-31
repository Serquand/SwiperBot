const { Embed } = require("../models");
const { getEmbedByName } = require("../services/Embed");
const { getSwiperByName } = require("../services/Swiper");

module.exports = {
    name: 'update_swiper_embed',
    description: "Modifie le swiper d'un Embed",
    options: [
        {
            name: 'embed_name',
            type: 'STRING',
            description: "Nom de l'Embed à modifier",
            required: true,
        },
        {
            name: 'swiper_name',
            type: 'STRING',
            description: "Nom du swiper",
            required: true,
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
        const swiperUid = needToDelete ? null : getSwiperByName(interaction.options.getString('swiper_name'))?.swiperUid ?? null;

        try {
            await Embed.update({ imageUrl: swiperUid }, { where: { name: embedName } });
            embed.updateSwiper(swiperUid);
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