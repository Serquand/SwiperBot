const { Client, CommandInteraction } = require("discord.js");
const { getEmbedByName } = require("../services/Embed");
const { Embed } = require("../models");

module.exports = {
    name: "",
    description: "",
    options: [
        {
            name: 'embed_name',
            type: "STRING",
            required: true,
            description: "Le nom de l'Embed"
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
                content: "L'auteur de l'Embed a bien été modifié",
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: "Something bad happened",
                ephemeral: true,
            });
        }
    }
}