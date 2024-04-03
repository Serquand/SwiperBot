const { Client, CommandInteraction } = require("discord.js");
const { getAllSwipersTemplate } = require("../services/Swiper");

module.exports = {
    name: 'list_swiper',
    description: "Liste les swipers",
    group: 'Swiper',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @returns
     */
    runSlash: async (client, interaction) => {
        const allSwipers = getAllSwipersTemplate();
        const content = '### Liste des swipers :\n' + allSwipers
            .map(swiper => `- **${swiper.swiperName}** => ${swiper.swiperDescription}`)
            .join('\n');

        return interaction.reply({ content, ephemeral: true });
    },
}