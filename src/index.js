const dotenv = require('dotenv');
const NODE_ENV = process.env.NODE_ENV || 'dev';
dotenv.config({ path: NODE_ENV === 'prod' ? '.env' : `.env.local` });

const { Client, Collection } = require('discord.js');
const { eventHandler, commandHandler } = require('./tools/handlers.js');
const db = require('./models');
const { initializeSwiper } = require('./services/Swiper.js');
const { initializeAllEmbeds, getListEmbed } = require('./services/Embed.js');
const { initializeSelectMenu, getListOfSelectMenuInChannel, deleteFromSelectMenuInChannel } = require('./services/SelectMenu.js');
const { initializeTurnOver } = require('./tools/utils.js');
const { fetchMessageById } = require('./tools/discord.js');

const deleteAllSelectMenuWithMessageDeleted = async (client) => {
    const listOfSelectMenuInChannel = getListOfSelectMenuInChannel();
    for(const sm of listOfSelectMenuInChannel) {
        const msg = await fetchMessageById(client, sm.channelId, sm.messageId);
        if (!msg) deleteFromSelectMenuInChannel(sm.messageId)
    }
}

const deleteAllEmbedWithMessageDeleted = async (client) => {
    const listEmbed = getListEmbed();
    for(const embed of listEmbed) {
        for(const embedSent of embed.embedsSent) {
            const msg = await fetchMessageById(client, embedSent.channelId, embedSent.messageId);
            if (!msg) embed.deleteFromEmbedSent(embedSent.messageId);
        }
    }
}

const initializeCheckInfoSent = async (client) => {
    setInterval(() => {
        deleteAllSelectMenuWithMessageDeleted(client); // Select Menu
        deleteAllEmbedWithMessageDeleted(client); // Embed
    }, 10 * 60 * 1_000);
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
        await initializeSelectMenu();
        initializeTurnOver(client);
        initializeCheckInfoSent(client);
        console.log('Everything initialized !');
    }, process.env.NODE_ENV === 'dev' ? 1_000 : 10_000);
}

main();