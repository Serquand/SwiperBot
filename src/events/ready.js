const discordConfig = require('../config/discord.config.js');

module.exports = {
    name: "ready",
    once: true,
    async execute (client) {
        const allGuilds = discordConfig.guilds;
        for(const guildId of allGuilds) {
            const guild = client.guilds.cache.get(guildId);
            guild.commands.set(client.commands.map((cmd) => cmd));
        }

        console.log("Bot launched !");
    }
}