const dotenv = require('dotenv');
dotenv.config();

const { Client, Collection } = require('discord.js');
const { eventHandler, commandHandler } = require('./tools/handlers.js');
const db = require('./models');
const { getAllSwipers, initializeSwiper } = require('./services/Swiper.js');

const initializeTurnOver = (client) => {
    setInterval(() => {
        const allSwipers = getAllSwipers();
        for (const swiper of allSwipers) {
            swiper.type === 'AUTO' && swiper.goToNextImage(client);
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
        initializeTurnOver(client);
        console.log('Everything initialized !');
    }, process.env.MODE === 'dev' ? 1_000 : 10_000);
}

main();