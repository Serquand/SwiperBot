const db = require('../models');
const ModelEmbed = db.Embed;
const ModelEmbedField = db.EmbedField;
const ModelEmbedInChannel = db.EmbedInChannel;

const { MessageEmbed, TextChannel } = require("discord.js");
const { getSwiperByUid } = require('./Swiper');

const listEmbed = [];

class Embed {
    constructor (color, author, title, description, imageUrl, thumbnailUrl, name, fields, uid, paths, swiperUid) {
        this.fields = fields;
        this.color = color;
        this.author = author;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.name = name;
        this.uid = uid;
        this.allPaths = paths ?? [];
        this.getTheSwiper(swiperUid);
    }

    getTheSwiper(swiperUid) {
        if(swiperUid) {
            const swiper = getSwiperByUid(swiperUid);
            this.swiper = swiper;
            this.hasSwiper = !!swiper;
        } else {
            this.swiper = null;
            this.hasSwiper = false;
        }
    }

    addPath(channelId, messageId) {
        this.allPaths.push({ channelId, messageId });
    }

    updateSwiper(newSwiperUid) {
        this.getTheSwiper(newSwiperUid);
        this.synchronize();
        this.imageUrl = null;
    }

    update(key, newValue) {
        this[key] = newValue;
        if(key === 'imageUrl') this.getTheSwiper(null);
        this.synchronize();
    }

    getFieldByName(name) {
        return this.fields.find(field => field.name === name);
    }

    async removeFieldsByName(name) {
        try {
            await ModelEmbedField.destroy({ name, linkedTo: this.uid });
            this.fields = this.fields.filter(field => field.name !== name);
            this.synchronize();

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async addFields(name, value, inline) {
        try {
            await ModelEmbedField.create({ name, value, inline, linkedTo: this.uid });
            this.fields.push({ name, value, inline });
            this.synchronize();
            return true;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    generateEmbed() {
        if(!this.title) return null;

        const embed = new MessageEmbed().setTitle(this.title);
        if(this.fields && this.fields.length) embed.setFields(...this.fields);
        if(this.author && this.author.name) embed.setAuthor(this.author);
        if(this.color) embed.setColor(this.color);
        if(this.description) embed.setDescription(this.description);
        if(this.thumbnailUrl) embed.setThumbnail(this.thumbnailUrl);
        if (this.hasSwiper) embed.setImage(this.swiper.swiperImages[0].imageUrl);
        else if(this.imageUrl) embed.setImage(this.imageUrl);

        return embed;
    }

    /**
     *
     * @param {TextChannel} channel
     */
    async sendEmbedInChannel(channel) {
        const message = await channel.send({ embeds: [this.generateEmbed()] });
        ModelEmbedInChannel.create({ channelId: channel.id, messageId: message.id, linkedTo: this.uid  })
        this.addPath(channel.id, message.id);
    }

    synchronize() {
        const embed = this.generateEmbed();
        console.log(this.swiper, this.imageUrl);
    }
}

async function addEmbed(color, authorIconUrl, authorUrl, authorName, title, description, imageUrl, thumbnailUrl, name, swiper) {
    try {
        const swiperUid = swiper.uid;
        const { dataValues: data } = await ModelEmbed.create({ name, title, authorName, authorIconUrl, authorUrl, color, description, imageUrl, thumbnailUrl, swiperUid });
        const author = { name: authorName, url: authorUrl, iconUrl: authorIconUrl };
        listEmbed.push(new Embed(color, author, title, description, imageUrl, thumbnailUrl, name, [], data.uid, []));
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function getListEmbed() {
    return listEmbed;
}

/**
 *
 * @param {String} name
 * @returns {Embed}
 */
function getEmbedByName(name) {
    return listEmbed.find(embed => embed.name === name);
}

/**
 *
 * @param {Embed} embed
 * @param {Boolean} cascade
 * @returns {Promise<boolean>}
 */
async function deleteEmbed(embed, cascade) {

}

async function initializeAllEmbeds() {
    const [embedTemplate, embedTemplateField, embedInChannel] = await Promise.all([
        ModelEmbed.findAll({ raw: true }),
        ModelEmbedField.findAll({ raw: true }),
        ModelEmbedInChannel.findAll({ raw: true }),
    ]);

    for(const template of embedTemplate) {
        const author = { iconUrl: template.authorIconUrl, url: template.authorUrl, name: template.authorName };
        const fieldAssigned = embedTemplateField
            .filter(field => field.linkedTo === template.uid)
            .map(field => ({ value: field.value, name: field.name, inline: field.inline }));
        const messageInChannelAssigned = embedInChannel
            .filter(field => field.linkedTo === template.uid)
            .map(field => ({ channelId: field.channelId, messageId: field.messageId }));
        listEmbed.push(new Embed(template.color, author, template.title, template.description, template.imageUrl, template.thumbnailUrl, template.name, fieldAssigned, template.uid, messageInChannelAssigned, template.swiperUid));
    }
}

module.exports = {
    getEmbedByName,
    addEmbed,
    deleteEmbed,
    getListEmbed,
    initializeAllEmbeds,
}