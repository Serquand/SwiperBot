const { MessageSelectMenu, MessageActionRow} = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Reply with Pong !',
    group: 'Utils',
    async runSlash(client, interaction) {
		interaction.reply('Pong !');
    }
}