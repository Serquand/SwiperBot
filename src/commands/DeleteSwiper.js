const { Client, CommandInteraction } = require("discord.js");
const { getSwiperByName, deleteSwiper, getAllSwipersTemplate } = require("../services/Swiper");
const { sendAutocomplete } = require("../tools/autocomplete");
const { sendBadInteraction } = require("../tools/discord");

module.exports = {
    name: "delete_swiper",
    description: "Supprime un swiper",
    group: 'Swiper',
    options: [
        {
            name: 'swiper_name',
            required: true,
            description: "Nom du swiper à supprimer",
            type: "STRING",
            autocomplete: true,
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: async (client, interaction) => {
        const swiperName = interaction.options.getString('swiper_name');
        if(!getSwiperByName(swiperName)) return sendBadInteraction(interaction, "Le swiper n'existe pas !");

        try {
            if (await deleteSwiper(swiperName, client)) return sendBadInteraction(interaction, "Le swiper a bien été supprimé !");
            else return sendBadInteraction(interaction);
        } catch (e) {
            console.error(e);
            return sendBadInteraction(interaction);
        }
    },
    autocomplete: interaction => sendAutocomplete(interaction, getAllSwipersTemplate(), 'swiperName')
}