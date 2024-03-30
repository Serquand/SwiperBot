const { Client, CommandInteraction } = require("discord.js");
const { getSwiperByName, deleteSwiper } = require("../services/Swiper");

module.exports = {
    name: "delete_swiper",
    description: "Supprime un swiper",
    options: [
        {
            name: 'swiper_name',
            required: true,
            description: "Nom du swiper à supprimer",
            type: "STRING"
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: async (client, interaction) => {
        const swiperName = interaction.options.getString('swiper_name');

        // Check if swiper exists
        if(!getSwiperByName(swiperName)) {
            return interaction.reply({
                content: "Le swiper n'existe pas !",
                ephemeral: true,
            });
        }

        try {
            const result = await deleteSwiper(swiperName);
            if(!result) throw new Error('Something went wrong when deleting a swiper');
        } catch (e) {

            return interaction.reply({
                content: "Something bad happened",
                ephemeral: true,
            });
        }

        return interaction.reply({
            content: "Le swiper a bien été supprimé !",
            ephemeral: true,
        });
    }
}