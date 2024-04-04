const { Client } = require('discord.js');
const discordConfig = require('../config/discord.config.js');

module.exports = {
    name: "ready",
    once: true,
    /**
     *
     * @param {Client} client
     */
    async execute (client) {
        client.user.setActivity('Développé par @serquand')
        const allGuilds = discordConfig.guilds;
        for(const guildId of allGuilds) {
            const guild = client.guilds.cache.get(guildId);
            guild.commands.set(client.commands.map((cmd) => cmd));
        }

        console.log("Bot launched !");
    }
}