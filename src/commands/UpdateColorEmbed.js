const { Client, CommandInteraction } = require("discord.js");
const { getEmbedByName, getListEmbed } = require("../services/Embed");
const { Embed } = require("../models");
const { sendAutocomplete } = require("../tools/autocomplete");

module.exports = {
    name: "update_color_embed",
    description: "Modifie la couleur d'un Embed",
    group: "Embed",
    isDisabled: true,
    options: [
        {
            name: 'embed_name',
            type: "STRING",
            required: true,
            description: "Le nom de l'Embed",
            autocomplete: true,
        },
        {
            name: "embed_color",
            type: 'STRING',
            required: true,
            description: "La nouvelle couleur de l'Embed"
        },
        {
            name: 'wanna_delete',
            required: false,
            type: "BOOLEAN",
            description: "Voulez-vous supprimer la couleur de l'Embed ?"
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @returns
     */
    runSlash: async (client, interaction) => {
        const embedName = interaction.options.getString('embed_name');
        const embed = getEmbedByName(embedName);
        if(!embed) {
            return interaction.reply({
                content: "L'Embed que vous voulez modifier n'existe pas !",
                ephemeral: true,
            })
        }

        const needToDelete = interaction.options.getBoolean('wanna_delete');
        const newColor = needToDelete ? null : interaction.options.getString('embed_color');

        try {
            await Embed.update({ color: newColor }, { where: { name: embedName } });
            embed.update('color', newColor);
            return interaction.reply({
                content: "La couleur de l'Embed a bien été modifié",
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