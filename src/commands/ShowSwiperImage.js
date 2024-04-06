const { Client, CommandInteraction, AutocompleteInteraction } = require("discord.js");
const { getSwiperByName, getAllSwipers, getAllSwipersTemplate } = require("../services/Swiper");
const { sendAutocomplete } = require("../tools/autocomplete");
const { sendBadInteraction } = require("../tools/discord");

module.exports = {
    name: 'show_swiper_image',
    description: "Affiche une image d'un swiper",
    group: 'Swiper',
    options: [
        {
            name: 'swiper_name',
            type: 'STRING',
            required: true,
            description: "Le nom du swiper à afficher",
            autocomplete: true,
        },
        {
            name: 'image_name',
            type: 'STRING',
            required: true,
            description: "Le nom de l'image à afficher",
            autocomplete: true,
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: (client, interaction) => {
        const swiper = getSwiperByName(interaction.options.getString('swiper_name'));
        if(!swiper) return sendBadInteraction(interaction, "Le swiper que vous avez demandé n'existe pas !");

        const swiperImage = swiper.getImageByName(interaction.options.getString('image_name'));
        if(!swiperImage) return sendBadInteraction(interaction, "L'image que vous avez demandé n'existe pas !");

        return sendBadInteraction(interaction, swiperImage.imageUrl);
    },
    /**
     *
     * @param {AutocompleteInteraction} interaction
     */
    autocomplete: interaction => {
        if(interaction.options.getFocused(true).name === 'swiper_name') {
            return sendAutocomplete(interaction, getAllSwipersTemplate(), 'swiperName')
        } else {
            const swiperName = interaction.options.getString('swiper_name');
            const swiper = getSwiperByName(swiperName);
            if(!swiper) return null;
            return sendAutocomplete(interaction, swiper.swiperImages, 'imageName')
        }
    }
}