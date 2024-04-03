module.exports = {
    name: 'ping',
    description: 'Reply with Pong !',
    group: 'Utils',
    async runSlash(client, interaction) {
        return interaction.reply('Pong ! ');
    }
}