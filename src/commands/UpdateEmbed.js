const { CommandInteraction, Client } = require("discord.js");
const { getListEmbed, getEmbedByName } = require("../services/Embed");
const { sendAutocomplete } = require("../tools/autocomplete");
const { sendBadInteraction, generateButtonToUpdateEmbed } = require("../tools/discord");

module.exports = {
    name: 'update_embed',
    group: 'Embed',
    description: "Modifie un Embed",
    options: [
        {
            name: 'embed_name',
            type: "STRING",
            required: true,
            autocomplete: true,
            description: "Le nom de l'Embed à envoyer"
        }
    ],
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: async (client, interaction) => {
        const embedName = interaction.options.getString('embed_name');
        const embed = getEmbedByName(embedName);
        if(!embed) return sendBadInteraction(interaction, "L'Embed que vous voulez modifier n'a pas été trouvé !");

        interaction.reply({
            content: `Modification de l'Embed ${embed.name}\nSwiper associé à l'Embed : ${embed.swiper?.swiperName ?? 'Aucun'}`,
            components: generateButtonToUpdateEmbed(embed.uid),
            embeds: [embed.generateEmbed()]
        });
    },
    autocomplete: interaction => sendAutocomplete(interaction, getListEmbed(), 'name'),
}