const { Client, Interaction } = require("discord.js");
const { sendBadInteraction } = require("../tools/discord");
const { getSelectMenuInChannelByCustomId } = require("../services/SelectMenu");

module.exports = {
    name: "interactionCreate",
    once: false,
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     * @returns
     */
    async execute(client, interaction) {
        if(interaction.type === 'MESSAGE_COMPONENT') {
            if(interaction.isSelectMenu()) {
                const selectMenu = getSelectMenuInChannelByCustomId(interaction.customId);
                if (selectMenu === undefined) return sendBadInteraction(interaction);
                return selectMenu.respondToInteraction(interaction, client);
            }
        }
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
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }
        }
    }
}