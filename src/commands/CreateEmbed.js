const { Client, CommandInteraction } = require("discord.js");
const { getSwiperByName, getAllSwipersTemplate } = require("../services/Swiper");
const { addEmbed, getEmbedByName } = require("../services/Embed");
const { sendAutocomplete } = require("../tools/autocomplete");
const { isValidColor } = require("../tools/utils");
const { sendBadInteraction } = require("../tools/discord");

module.exports = {
    name: 'create_embed',
    description: "Créer un nouvel Embed",
    group: "Embed",
    options: [
        {
            name: "name",
            type: "STRING",
            required: true,
            description: "Le nom de l'Embed à créer"
        },
        {
            name: "embed_title",
            type: "STRING",
            required: true,
            description: "Le titre de l'Embed à créer"
        },
        // {
        //     name: "embed_description",
        //     type: "STRING",
        //     required: false,
        //     description: "Le titre de l'Embed à créer"
        // },
        // {
        //     name: "embed_swiper_name",
        //     type: "STRING",
        //     required: false,
        //     description: "Le swiper à ajouter dans l'Embed",
        //     autocomplete: true
        // },
        // {
        //     name: "embed_image_url",
        //     type: "STRING",
        //     required: false,
        //     description: "L'URL de l'image à ajouter dans l'Embed",
        // },
        // {
        //     name: "embed_author_name",
        //     type: "STRING",
        //     required: false,
        //     description: "Le nom de l'auteur de l'Embed"
        // },
        // {
        //     name: "embed_author_icon_url",
        //     type: "STRING",
        //     description: "L'URL de l'icone l'auteur de l'Embed",
        //     required: false,
        // },
        // {
        //     name: "embed_author_url",
        //     type: "STRING",
        //     description: "L'URL de l'auteur de l'Embed",
        //     required: false,
        // },
        // {
        //     name: "embed_thumbnail_url",
        //     type: "STRING",
        //     description: "L'URL du thumbnail de l'Embed",
        //     required: false,
        // },
        // {
        //     name: 'color',
        //     type: 'STRING',
        //     description: "La couleur de l'Embed",
        //     required: false,
        // }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: async (client, interaction) => {
        const name = interaction.options.getString('name');
        const embedTitle = interaction.options.getString('embed_title');
        const embedDescription = interaction.options.getString('embed_description');
        const embedSwiper = interaction.options.getString('embed_swiper_name');
        const embedAuthorName = interaction.options.getString('embed_author_name');
        const embedAuthorIconUrl = interaction.options.getString('embed_author_icon_url');
        const embedAuthorUrl = interaction.options.getString('embed_author_url');
        const embedThumbnailUrl = interaction.options.getString('embed_thumbnail_url');
        const color = interaction.options.getString('color');
        const embedImageUrl = interaction.options.getString('embed_image_url');

        if(color && !isValidColor(color)) return sendBadInteraction(interaction, "La couleur saisie n'est pas correcte !");

        // Check if the swiper really exists
        const swiper = getSwiperByName(embedSwiper);
        if(embedSwiper && !swiper) {
            return interaction.reply({
                content: "Le swiper que vous voulez utilisé n'existe pas !",
                ephemeral: true
            });
        }

        // Check if the name of the Embed already exists
        if (getEmbedByName(name)) {
            return interaction.reply({
                content: "Un Embed avec ce nom existe déjà !",
                ephemeral: true
            });
        }

        // Check if the description.length < 4000 chars
        if(embedDescription && embedDescription.length > 4_000) {
            return interaction.reply({
                content: "La description de l'Embed ne peut pas dépasser les 4 000 caractères !",
                ephemeral: true
            });
        }

        // Check if the title.length < 250 chars
        if(embedTitle.length > 250) {
            return interaction.reply({
                content: "Le titre de l'Embed ne peut pas dépasser les 250 caractères !",
                ephemeral: true
            });
        }

        // Check if the author.name < 250 chars
        if(embedAuthorName && embedAuthorName.length > 250) {
            return interaction.reply({
                content: "Le nom de l'auteur de l'Embed ne peut pas dépasser les 250 caractères !",
                ephemeral: true
            });
        }

        // Add the Embed
        try {
            const result = await addEmbed(color, embedAuthorIconUrl, embedAuthorUrl, embedAuthorName, embedTitle, embedDescription, embedImageUrl, embedThumbnailUrl, name, swiper);
            if(result) {
                return interaction.reply({
                    content: "L'Embed a bien été créé !",
                    ephemeral: true,
                });
            } else {
                return interaction.reply({
                    content: "Something bad happened",
                    ephemeral: true
                });
            }
        } catch (e) {
            console.error(e);
            return interaction.reply({
                content: "Something bad happened",
                ephemeral: true
            });
        };
    },
    autocomplete: interaction => sendAutocomplete(interaction, getAllSwipersTemplate(), 'swiperName'),
}