const { Client, CommandInteraction } = require("discord.js");
const { getSwiperByName, addSwiper } = require('../services/Swiper');
const { sendBadInteraction } = require("../tools/discord");

module.exports = {
    name: 'create_swiper',
    description: "Create a new swiper",
    group: 'Swiper',
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

        if(name.length > 250) return sendBadInteraction(interaction, "Le nom du swiper est trop long. Longueur maximale : 250 caractères.");
        if(getSwiperByName(name)) return sendBadInteraction(interaction, "Un swiper avec ce nom existe déjà !");

        if(name.trim() === 'Aucun') return sendBadInteraction(interaction, "Vous ne pouvez pas appeler le Swiper de cette manière");

        try {
            if(!await addSwiper(name, description)) return sendBadInteraction(interaction);
            else return sendBadInteraction(interaction, "Le Swiper a bien été créé !");
        } catch (error) {
            console.error(error);
            return sendBadInteraction(interaction);
        }
    }
}