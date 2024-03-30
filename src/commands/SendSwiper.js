const { Client, CommandInteraction } = require("discord.js");
const { getSwiperByName, sendSwiper } = require("../services/Swiper");

module.exports = {
    name: "send_swiper",
    description: 'Envoie un swiper',
    options: [
        {
            name: 'swiper_name',
            type: "STRING",
            description: 'Le nom du swiper à envoyer',
            required: true
        },
        {
            name: 'channel',
            type: "CHANNEL",
            description: 'Le channel où envoyer le swiper',
            required: true
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: async (client, interaction) => {
        const channel = interaction.options.getChannel('channel');
        const swiperName = interaction.options.getString('swiper_name');

        if(!channel.isText()) {
            return interaction.reply({
                content: "Vous ne pouvez pas envoyer ce swiper dans ce channel !",
                ephemeral: true,
            });
        }

        const swiper = getSwiperByName(swiperName);
        if(!swiper) {
            return interaction.reply({
                content: "Le swiper demandé n'existe pas !",
                ephemeral: true,
            });
        }

        try {
            const res = await sendSwiper(swiperName, channel);
            if(!res) throw new Error('Error when sending swiper ' + swiperName);
        } catch (error) {
            console.error(error);
        }

        return interaction.reply({
            content: "Le swiper a bien été envoyé !",
            ephemeral: true,
        });
    }
}