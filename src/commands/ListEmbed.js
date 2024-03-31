const { getListEmbed } = require("../services/Embed")

module.exports = {
    name: 'list_embed',
    description: 'Liste les Embeds',
    runSlash: (client, interaction) => {
        const allEmbed = getListEmbed();
        return interaction.reply({
            content: '### Voici la liste des Embeds :\n' + allEmbed.map(embed => '- ' + embed.name).join('\n'),
            ephemeral: true,
        });
    }
}