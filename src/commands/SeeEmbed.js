const { Client, CommandInteraction } = require("discord.js");
const { getEmbedByName, getListEmbed } = require("../services/Embed");
const { sendAutocomplete } = require("../tools/autocomplete");

module.exports = {
    name: 'see_embed',
    description: "Affiche un Embed",
    group: "Embed",
    isDisabled: true,
    options: [
        {
            name: 'embed_name',
            description: "Le nom de l'Embed à afficher",
            required: true,
            type: 'STRING',
            autocomplete: true,
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: async (client, interaction) => {
        const embedName = interaction.options.getString('embed_name');
        const embed = getEmbedByName(embedName);
        if(!embed) {
            return interaction.reply({ content: "Aucun embed n'a été trouvé avec ce nom !", ephemeral: true });
        } else {
            return interaction.reply({ embeds: [embed.generateEmbed()], ephemeral: true });
        }
    },
    autocomplete: (interaction) => sendAutocomplete(interaction, getListEmbed(), 'name')
}