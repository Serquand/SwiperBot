const { Client, CommandInteraction } = require("discord.js");
const { getEmbedByName } = require("../services/Embed");

module.exports = {
    name: "send_embed",
    description: "Envoie un Embed dans un channel",
    options: [
        {
            name: 'embed_name',
            required: true,
            type: "STRING",
            description: "Le nom de l'Embed à envoyer"
        },
        {
            name: 'channel',
            required: true,
            type: "CHANNEL",
            description: "Le channel où envoyer l'Embed"
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @returns
     */
    runSlash: (client, interaction) => {
        const embedName = interaction.options.getString('embed_name');
        const channel = interaction.options.getChannel('channel');
        const embed = getEmbedByName(embedName);
        if(!embed) {
            return interaction.reply({ content: "Aucun embed n'a été trouvé avec ce nom !", ephemeral: true });
        } else if(!channel.isText()) {
            return interaction.reply({ content: "Le channel d'envoi n'est pas valide !", ephemeral: true });
        }

        embed.sendEmbedInChannel(channel);
        return interaction.reply({
            content: "L'Embed a bien été envoyé",
            ephemeral: true
        });
    }
}