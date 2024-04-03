const { Client, CommandInteraction } = require("discord.js");
const { getEmbedByName, getListEmbed } = require("../services/Embed");
const { Embed } = require("../models");
const { sendAutocomplete } = require("../tools/autocomplete");

module.exports = {
    name: 'update_image_embed',
    description: "Modifie l'image d'un Embed",
    group: "Embed",
    options: [
        {
            name: 'embed_name',
            description: "Nom de l'Embed",
            type: 'STRING',
            required: true,
            autocomplete: true,
        },
        {
            name: "new_value",
            description: "Nouvelle valeur",
            type: 'STRING',
            required: true,
        },
        {
            name: 'wanna_delete',
            required: false,
            type: "BOOLEAN",
            description: "Voulez-vous supprimer l'image de l'Embed ?"
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
            });
        }

        const needToDelete = interaction.options.getBoolean('wanna_delete');
        const embedImage = needToDelete ? null : interaction.options.getString('new_value');

        try {
            await Embed.update(
                { imageUrl: embedImage, swiper: null },
                { where: { name: embedName } }
            );
            embed.update('imageUrl', embedImage);
            embed.update('swiper', null);
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
    autocomplete: interaction => sendAutocomplete(interaction, getListEmbed(), 'name'),
}