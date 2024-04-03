const { Client, CommandInteraction } = require("discord.js");
const { getAllFilesFromDirectory } = require("../tools/utils");

module.exports = {
    name: 'help',
    group: 'Utils',
    description: 'Show the list of commands and their description',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async runSlash(client, interaction) {
        const cachedCommandInformations = {};
        const commandGrouped = {};

        try {
            const listCommands = interaction.guild.commands.cache;
            listCommands.forEach(command => cachedCommandInformations[command.name] = command.id);

            (await getAllFilesFromDirectory(`${process.cwd()}/src/commands/*.js`)).map(commandFile => {
                const command = require(commandFile);
                const group = command.group ?? 'Non rattaché à un groupe';
                const commandId = cachedCommandInformations[command.name];
                const newCommandObject = { name: command.name, id: commandId };

                if(commandGrouped[group]) {
                    commandGrouped[group].push(newCommandObject);
                } else {
                    commandGrouped[group] = [newCommandObject];
                }
            });

            let content = '## Voici la liste des commandes\n\n\n';
            for(const group in commandGrouped) {
                content += '### ' + group + '\n' + commandGrouped[group].map(cmd => `- </${cmd.name}:${cmd.id}>`).join('\n') + '\n\n';
            }

            return interaction.reply({ content, ephemeral: true });
        } catch (exc) {
            console.error(exc);
            interaction.reply({
                content: 'Something bad happened...',
                ephemeral: true
            });
        }
    }
}