const { CommandInteraction, Client } = require("discord.js");
const { getListEmbed, getEmbedByName } = require("../services/Embed");
const { sendAutocomplete } = require("../tools/autocomplete");
const { sendBadInteraction, generateButtonToUpdateEmbed } = require("../tools/discord");
const { v4 } = require("uuid");
const { getEmbedUpdaterManager } = require("../services/EmbedUpdater");

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
            content: `Modification de l'Embed ${embed.name}`,
            components: generateButtonToUpdateEmbed(embed.uid),
            embeds: [embed.generateEmbed()]
        });

        const embedUpdaterManager = getEmbedUpdaterManager();
        embedUpdaterManager.addEmbedUpdater(embed.uid, interaction, embed.uid);
    },
    autocomplete: interaction => sendAutocomplete(interaction, getListEmbed(), 'name'),
}