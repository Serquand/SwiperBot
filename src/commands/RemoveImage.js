const { Client, CommandInteraction, AutocompleteInteraction } = require("discord.js");
const { getSwiperByName, deleteSwiperImage, getAllSwipers, getAllSwipersTemplate } = require("../services/Swiper");
const { sendAutocomplete } = require("../tools/autocomplete");

module.exports = {
    name: 'remove_image',
    description: 'Supprime une image d\'un swiper',
    group: 'Swiper',
    options: [
        {
            name: 'swiper_name',
            required: true,
            type: "STRING",
            description: 'Le nom du swiper à modifier',
            autocomplete: true,
        },
        {
            name: 'image_name',
            required: true,
            type: "STRING",
            description: "Le nom de l'image à supprimer",
            autocomplete: true
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: async (client, interaction) => {
        const swiperName = interaction.options.getString('swiper_name');
        const imageName = interaction.options.getString('image_name');

        // Check if the swiper exists
        const swiper = getSwiperByName(swiperName);
        if(!swiper) {
            return interaction.reply({
                content: "Le swiper à modifier n'a pas été trouvé !",
                ephemeral: true,
            });
        }

        // Check if the swiper contains the image
        if (!swiper.getImageByName(imageName)) {
            return interaction.reply({
                content: "L'image a supprimé n'existe pas sur le swiper !",
                ephemeral: true,
            });
        }

        if(swiper.swiperImages.length < 2) {
            return interaction.reply({
                content: "L'image ne peut pas être supprimé car c'est la seule sur le swiper !",
                ephemeral: true,
            });
        }

        try {
            const result = await deleteSwiperImage(swiperName, imageName);
            if(!result) throw new Error('Something went wrong when removing image');
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: "Something bad happened",
                ephemeral: true,
            });
        }

        return interaction.reply({
            content: 'Image removed successfully',
            ephemeral: true,
        });
    },
    /**
     *
     * @param {AutocompleteInteraction} interaction
     */
    autocomplete: interaction => {
        if(interaction.options.getFocused(true).name === 'swiper_name') {
            return sendAutocomplete(interaction, getAllSwipersTemplate(), 'swiperName');
        } else {
            const swiperName = interaction.options.getString('swiper_name');
            const swiper = getSwiperByName(swiperName);
            if(!swiper) return null;
            return sendAutocomplete(interaction, swiper.swiperImages, 'imageName')
        }
    }
}