const { MessageSelectMenu, MessageActionRow} = require('discord.js');

module.exports = {
    name: 'ping',
    description: 'Reply with Pong !',
    group: 'Utils',
    async runSlash(client, interaction) {
        const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.addOptions([
						{
							label: 'Select me',
							description: 'This is a description',
							value: 'first_option',
						},
						{
							label: 'You can select me too',
							description: 'This is also a description',
							value: 'second_option',
						},
					]),
			);

		await interaction.reply({ content: 'Pong!', components: [row] });
    }
}