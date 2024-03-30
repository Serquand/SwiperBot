const { Client, CommandInteraction } = require("discord.js");
const { getSwiperByName } = require("../services/Swiper");

module.exports = {
    name: 'show_swiper_image',
    description: "Affiche une image d'un swiper",
    options: [
        {
            name: 'swiper_name',
            type: 'STRING',
            required: true,
            description: "Le nom du swiper à afficher",
        },
        {
            name: 'image_name',
            type: 'STRING',
            required: true,
            description: "Le nom de l'image à afficher",
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
    }
}