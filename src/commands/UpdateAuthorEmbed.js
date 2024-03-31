const db = require('../models');
const Embed = db.Embed;
const { Client, CommandInteraction } = require("discord.js");
const { getEmbedByName, getListEmbed } = require("../services/Embed");
const { sendAutocomplete } = require('../tools/autocomplete');

module.exports = {
    name: "udpate_author_embed",
    description: 'Modifier l\'auteur d\'un embed',
    options: [
        {
            name: 'embed_name',
            required: true,
            type: "STRING",
            description: "Le nom de l'Embed à envoyer",
            autocomplete: true,
        },
        {
            name: 'author_name',
            required: false,
            type: "STRING",
            description: "Le nom de l'auteur",
        },
        {
            name: 'author_icon_url',
            required: false,
            type: "STRING",
            description: "L'URL de l'auteur",
        },
        {
            name: 'author_url',
            required: false,
            type: "STRING",
            description: 'L\'URL de l\'auteur',
        },
        {
            name: 'wanna_delete',
            required: false,
            type: "BOOLEAN",
            description: "Voulez-vous supprimer l'auteur de l'Embed ?"
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
        const authorName = needToDelete ? null : interaction.options.getString('author_name');
        const authorIconUrl = needToDelete ? null : interaction.options.getString('author_icon_url');
        const authorUrl = needToDelete ? null : interaction.options.getString('author_url');
        const authorObject = needToDelete ? null : { iconUrl: authorIconUrl, name: authorName, url: authorUrl };

        if(authorObject && authorObject.name && authorObject.name.length > 250) {
            return interaction.reply({
                content: "Le nom de l'auteur est invalide",
                ephemeral: true,
            })
        }

        try {
            await Embed.update({ authorName, authorIconUrl, authorUrl }, { where: { name: embedName } });
            embed.update('author', authorObject);
            return interaction.reply({
                content: "L'auteur de l'Embed a bien été modifié",
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