const { Client, CommandInteraction } = require("discord.js");
const { getSwiperByName, getAllSwipers, getAllSwipersTemplate } = require("../services/Swiper");
const { sendAutocomplete } = require("../tools/autocomplete");

module.exports = {
    name: 'show_swiper_list_image',
    description: "Affiche la liste des images pour un swiper",
    group: 'Swiper',
    options: [
        {
            name: 'swiper_name',
            type: "STRING",
            description: "Le nom du swiper à afficher",
            required: true,
            autocomplete: true
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: (client, interaction) => {
        const swiperName = interaction.options.getString('swiper_name');
        const swiper = getSwiperByName(swiperName);
        if(!swiper) {
            return interaction.reply({
                content: "Aucun swiper avec ce nom n'a été trouvé",
                ephemeral: true,
            })
        }
        const content = "### Voici la liste des images rattachés à ce swiper :\n" +
            swiper.swiperImages
            .map(image => '- ' + image.imageName)
            .join('\n');

        return interaction.reply({ content, ephemeral: true });
    },
    autocomplete: interaction => sendAutocomplete(interaction, getAllSwipersTemplate(), 'swiperName')
}