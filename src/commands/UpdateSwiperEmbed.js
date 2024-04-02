const { AutocompleteInteraction } = require("discord.js");
const { Embed } = require("../models");
const { getEmbedByName, getListEmbed } = require("../services/Embed");
const { getSwiperByName, getAllSwipersTemplate } = require("../services/Swiper");
const { sendAutocomplete } = require("../tools/autocomplete");

module.exports = {
    name: 'update_swiper_embed',
    description: "Modifie le swiper d'un Embed",
    options: [
        {
            name: 'embed_name',
            type: 'STRING',
            description: "Nom de l'Embed à modifier",
            required: true,
            autocomplete: true,
        },
        {
            name: 'swiper_name',
            type: 'STRING',
            description: "Nom du swiper",
            autocomplete: true,
            required: true,
        },
        {
            name: 'wanna_delete',
            required: false,
            type: "BOOLEAN",
            description: "Voulez-vous supprimer le Swiper de l'Embed ?"
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
            await Embed.update({ swiperUid, imageUrl: null }, { where: { name: embedName } });
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
    },
    /**
     *
     * @param {AutocompleteInteraction} interaction
     */
    autocomplete: interaction => {
        if(interaction.options.getFocused(true).name === 'embed_name') {
            sendAutocomplete(interaction, getListEmbed(), 'name')
        } else {
            sendAutocomplete(interaction, getAllSwipersTemplate(), 'swiperName')
        }
    }
}