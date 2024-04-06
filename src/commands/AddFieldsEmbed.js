const { Client, CommandInteraction } = require("discord.js");
const { getEmbedByName, getListEmbed } = require("../services/Embed");
const { sendAutocomplete } = require('../tools/autocomplete');

module.exports = {
    name: "add_fields_embed",
    group: "Embed",
    isDisabled: true,
    description: "Add a fields to an Embed",
    options: [
        {
            name: "embed_name",
            type: "STRING",
            reuqired: true,
            description: "Le nom de l'Embed",
            autocomplete: true,
        },
        {
            name: "field_name",
            type: "STRING",
            reuqired: true,
            description: "Le nom du champ à ajouter"
        },
        {
            name: "field_value",
            type: "STRING",
            reuqired: true,
            description: "La valeur du champ à ajouter"
        },
        {
            name: "field_inline",
            type: "BOOLEAN",
            reuqired: true,
            description: "Champ inline ?"
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: async (client, interaction) => {
        const embedName = interaction.options.getString('embed_name');
        const fieldName = interaction.options.getString('field_name');
        const fieldValue = interaction.options.getString('field_value');
        const fieldInline = interaction.options.getBoolean('field_inline');

        // Check if the embed really exists
        const embed = getEmbedByName(embedName);
        if(!embed) {
            return interaction.reply({
                content: "L'embed que vous voulez modifier n'a pas été trouvé !",
                ephemeral: true,
            });
        }

        // Check if the field already exists in the Embed
        if(embed.getFieldByName(fieldName)) {
            return interaction.reply({
                content: "Le champ que vous voulez créer existe déjà !",
                ephemeral: true,
            });
        }

        if(!fieldName) {
            return interaction.reply({
                content: "Vous devez remplir le nom du champ à ajouter",
                ephemeral: true,
            });
        }

        if(!fieldValue) {
            return interaction.reply({
                content: "Vous devez remplir la valeur du champ à ajouter",
                ephemeral: true,
            });
        }

        // Add the field to the Embed
        try {
            if(await embed.addFields(fieldName, fieldValue, fieldInline)) {
                return interaction.reply({
                    content: "Le champ a bien été ajouté !",
                    ephemeral: true,
                });
            } else {
                return interaction.reply({
                    content: "Somethind bad happened",
                    ephemeral: true,
                });
            }
        } catch (error) {
            return interaction.reply({
                content: "Somethind bad happened",
                ephemeral: true,
            });
        }
    },
    autocomplete: (interaction) => sendAutocomplete(interaction, getListEmbed(), 'name')
};