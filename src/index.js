const dotenv = require('dotenv');
dotenv.config();

const { Client, Collection, MessageEmbed } = require('discord.js');
const { eventHandler, commandHandler } = require('./tools/handlers.js');
const db = require('./models');
const { getAllSwipers, initializeSwiper } = require('./services/Swiper.js');
const { initializeAllEmbeds, getListEmbed } = require('./services/Embed.js');

const initializeTurnOver = (client) => {
    setInterval(() => {
        for (const swiper of getAllSwipers()) {
            swiper.type === 'AUTO' && swiper.goToNextImage(client);
        }

        for(const embed of getListEmbed()) {
            for(const embedSent of embed.getListOfEmbedsSent()) {
                embedSent.refreshSwiper(client);
            }
        }
    }, 5_000);
}

const main = async () => {
    const client = new Client({ intents: 3276799 });
    client.commands = new Collection();
    client.login(process.env.BOT_TOKEN);

    await Promise.all([ eventHandler(client), commandHandler(client) ]);

    setTimeout(async () => {
        await db.sequelize.sync();
        await initializeSwiper();
        await initializeAllEmbeds();
        initializeTurnOver(client);
        console.log('Everything initialized !');
    }, process.env.MODE === 'dev' ? 1_000 : 10_000);
}

main();