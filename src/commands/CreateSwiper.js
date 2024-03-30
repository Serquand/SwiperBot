const db = require('../models');
const Swiper = db.Swiper;
const SwiperImage = db.SwiperImage;
const { Client, CommandInteraction } = require("discord.js");
const { getSwiperByName, addSwiper } = require('../services/Swiper');

module.exports = {
    name: 'create_swiper',
    description: "Create a new swiper",
    options: [
        {
            name: 'name',
            type: 'STRING',
            required: true,
            description: "Le nom du swiper",
        },
        {
            name: 'description',
            type: 'STRING',
            required: true,
            description: "La description du swiper",
        },
        {
            name: 'first_image',
            type: 'STRING',
            required: true,
            description: "L'URL de la première image à envoyer",
        },
        {
            name: 'first_image_name',
            type: "STRING",
            required: true,
            description: 'Le nom de la première image à envoyer'
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: async (client, interaction) => {
        const name = interaction.options.getString('name');
        const description = interaction.options.getString('description');
        const firstImage = interaction.options.getString('first_image');
        const firstImageName = interaction.options.getString('first_image_name');

        // Check data => Check if the name already exists
        if(getSwiperByName()) {
            return interaction.reply({
                content: "Un swiper avec ce nom existe déjà !",
                ephemeral: true
            });
        }

        try {
            const result = await addSwiper(name, description, firstImageName, firstImage);
            if(!result) {
                return interaction.reply({
                    content: "Somethind bad happened",
                    ephemeral: true
                });
            }
        } catch (error) {
            return interaction.reply({
                content: 'Something bad happened',
                ephemeral: true
            });
        }

        return interaction.reply({
            content: 'Working on that',
            ephemeral: true,
        });
    }
}