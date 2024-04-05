const { Client, CommandInteraction } = require("discord.js");
const { getEmbedByName, getListEmbed } = require("../services/Embed");
const { Embed } = require("../models");
const { sendAutocomplete } = require("../tools/autocomplete");

module.exports = {
    name: 'update_title_embed',
    description: "Modifie le titre d'un Embed",
    isDisabled: true,
    group: "Embed",
    options: [
        {
            name: 'embed_name',
            type: "STRING",
            required: true,
            description: "Le nom de l'Embed à modifier",
            autocomplete: true,
        },
        {
            name: 'new_title',
            type: 'STRING',
            required: true,
            description: "Le nouveau titre de l'Embed"
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: async (client, interaction) => {
        const embedName = interaction.options.getString('embed_name');
        const newTitle = interaction.options.getString('new_title');
        const embed = getEmbedByName(embedName);
        if(!embed) {
            return interaction.reply({
                content: "L'Embed que vous voulez modifier n'existe pas !",
                ephemeral: true,
            })
        }

        try {
            await Embed.update({ title: newTitle }, { where: { name: embedName } });
            embed.update('title', newTitle)
            return interaction.reply({
                content: "Le titre de l'Embed a bien été modifié",
                ephemeral: true,
                embeds: [embed.generateEmbed()]
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: "Something bad happened",
                ephemeral: true,
            });
        }
    },
    autocomplete: interaction => sendAutocomplete(interaction, getListEmbed(), 'name')
}