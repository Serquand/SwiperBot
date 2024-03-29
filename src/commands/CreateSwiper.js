const { Client, CommandInteraction } = require("discord.js");

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
            name: 'channel_to_send',
            type: 'CHANNEL',
            required: false,
            description: "Le channel où envoyer le swiper",
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: (client, interaction) => {
        const name = interaction.options.getString('name');
        const description = interaction.options.getString('description');
        const channelToSend = interaction.options.getChannel('channel_to_send');
        console.log(name, description, channelToSend?.name);

        return interaction.reply({
            content: 'Working on that',
            ephemeral: true,
        });
    }
}