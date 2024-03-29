module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(client, interaction) {
        if(interaction.isCommand()) {
            const cmd = client.commands.get(interaction.commandName);
            if(!cmd) {
                return interaction.reply({
                    content: "Cette commande n'existe pas",
                    ephemeral: true,
                });
            }
            cmd.runSlash(client, interaction);
        }

        if(interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);
            try {
                if (!command) {
                    throw new Error(`No command matching ${interaction.commandName} was found.`);
                }
                await command.autocomplete(client, interaction);
            } catch (error) {
                console.error(error);
            }
        }
    }
}