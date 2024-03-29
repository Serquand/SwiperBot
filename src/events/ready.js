const discordConfig = require('../config/discord.config.js');

module.exports = {
    name: "ready",
    once: true,
    async execute (client) {
        const mode = process.env.MODE || "dev";
        const guild = client.guilds.cache.get(discordConfig[mode].guildId);
        guild.commands.set(client.commands.map((cmd) => cmd));

        console.log("Bot launched !");
    }
}