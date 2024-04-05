const { Client, CommandInteraction } = require("discord.js");
const { Embed } = require("../models");
const { getEmbedByName, getListEmbed } = require("../services/Embed");
const { sendAutocomplete } = require("../tools/autocomplete");

module.exports = {
    name: 'update_description_embed',
    description: "Modifie la description d'un Embed",
    group: "Embed",
    isDisabled: true,
    options: [
        {
            name: 'embed_name',
            type: 'STRING',
            required: true,
            description: "Nom de l'Embed à modifier",
            autocomplete: true,
        },
        {
            name: 'new_description',
            type: "STRING",
            required: true,
            description: "Nouvelle description de l'Embed"
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
        const embedDescription = needToDelete ? null : interaction.options.getString('new_description');

        try {
            await Embed.update({ description: embedDescription }, { where: { name: embedName } });
            embed.update('description', embedDescription);
            return interaction.reply({
                content: "La description de l'Embed a bien été modifié",
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