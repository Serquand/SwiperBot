module.exports = {
    name: 'ping',
    description: 'Reply with Pong !',
    async runSlash(client, interaction) {
        return interaction.reply('Pong ! ');
    }
}