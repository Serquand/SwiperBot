const { Client, CommandInteraction, AutocompleteInteraction } = require("discord.js");
const { getSwiperByName, getAllSwipers, getAllSwipersTemplate } = require("../services/Swiper");
const { sendAutocomplete } = require("../tools/autocomplete");

module.exports = {
    name: 'show_swiper_image',
    description: "Affiche une image d'un swiper",
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
        const swiperName = interaction.options.getString('swiper_name');
        const imageName = interaction.options.getString('image_name');
        const swiper = getSwiperByName(swiperName);
        if(!swiper) {
            return interaction.reply({
                content: "Le swiper que vous avez demandé n'existe pas !",
                ephemeral: true
            });
        }
        const swiperImage = swiper.getImageByName(imageName);
        if(!swiperImage) {
            return interaction.reply({
                content: "L'image que vous avez demandé n'existe pas !",
                ephemeral: true
            });
        }
        return interaction.reply({
            content: swiperImage.imageUrl,
            ephemeral: true
        });
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