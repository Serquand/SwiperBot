const { CommandInteraction, Client }  = require('discord.js');
const { getSwiperByName, addSwiperImage, getAllSwipers, getAllSwipersTemplate } = require("../services/Swiper");
const { sendAutocomplete } = require("../tools/autocomplete");
const { sendBadInteraction } = require('../tools/discord');

module.exports = {
    name: 'add_images',
    description: 'Ajoute une image au swiper',
    group: 'Swiper',
    options: [
        {
            name: 'swiper_name',
            type: 'STRING',
            required: true,
            description: 'Le nom du swiper à modifier',
            autocomplete: true,
        },
        {
            name: 'image_name',
            type: 'STRING',
            required: true,
            description: 'Le nom de l\'image à ajouter',
        },
        {
            name: 'image_url',
            type: 'STRING',
            required: true,
            description: 'L\'url de l\'image à ajouter',
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: async (client, interaction) => {
        const swiperName = interaction.options.getString('swiper_name');
        const imageName = interaction.options.getString('image_name');
        const imageUrl = interaction.options.getString('image_url');

        // Check if the swiper really exists
        const swiper = getSwiperByName(swiperName);
        if(!swiper) {
            return interaction.reply({
                content: "Le swiper que vous voulez modifier n'existe pas !",
                ephemeral: true,
            });
        }

        if (imageName.length > 250) {
            return sendBadInteraction(interaction, "Le nom de l'image est trop longue. Longueur maximale autorisé : 250 caractères");
        }

        // Check if the image exists in the swiper
        if(swiper.getImageByName(imageName)) {
            return interaction.reply({
                content: "Une image avec le même nom existe déjà dans le swiper !",
                ephemeral: true,
            });
        }

        if(!await addSwiperImage(swiperName, imageName, imageUrl)) {
            return interaction.reply({
                content: "Something bad happened",
                ephemeral: true,
            });
        }

        return interaction.reply({
            content: "L'image a bien été ajouté dans le swiper !",
            ephemeral: true,
        });
    },
    autocomplete: (interaction) => sendAutocomplete(interaction, getAllSwipersTemplate(), 'swiperName')
}