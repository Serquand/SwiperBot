const db = require('../models');
const ModelEmbed = db.Embed;
const ModelEmbedField = db.EmbedField;
const ModelEmbedInChannel = db.EmbedInChannel;

const { MessageEmbed, TextChannel, Client } = require("discord.js");
const { getSwiperByUid } = require('./Swiper');
const { fetchMessageById } = require('../tools/discord');

const listEmbed = [];

async function addEmbed(color, authorIconUrl, authorUrl, authorName, title, description, imageUrl, thumbnailUrl, name, swiper) {
    try {
        const swiperUid = swiper?.swiperUid ?? null;
        const { dataValues: data } = await ModelEmbed.create({ name, title, authorName, authorIconUrl, authorUrl, color, description, imageUrl, thumbnailUrl, swiperUid });
        const author = { name: authorName, url: authorUrl, iconURL: authorIconUrl };
        listEmbed.push(new Embed(color, author, title, description, imageUrl, thumbnailUrl, name, [], data.uid, [], swiperUid));
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

/**
 *
 * @returns {Array<Embed>}
 */
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
 * @returns {Promise<boolean>}
 */
async function deleteEmbed(embed) {
    console.log(embed);
}

async function initializeAllEmbeds() {
    const [embedTemplate, embedTemplateField, embedInChannel] = await Promise.all([
        ModelEmbed.findAll({ raw: true }),
        ModelEmbedField.findAll({ raw: true }),
        ModelEmbedInChannel.findAll({ raw: true }),
    ]);

    for(const template of embedTemplate) {
        const author = { iconURL: template.authorIconUrl, url: template.authorUrl, name: template.authorName };

        const fieldAssigned = embedTemplateField
            .filter(field => field.linkedTo === template.uid)
            .map(field => ({ value: field.value, name: field.name, inline: field.inline }));;

        listEmbed.push(new Embed(template.color, author, template.title, template.description, template.imageUrl, template.thumbnailUrl, template.name, fieldAssigned, template.uid, [], template.swiperUid));
        for(const msg of embedInChannel.filter(field => field.linkedTo === template.uid)) {
            listEmbed.at(-1).addEmbedSent(msg.channelId, msg.messageId, msg.swiperType);
        }
    }
}

/**
 *
 * @param {String} uid
 * @returns {Embed}
 */
function getEmbedByUid(uid) {
    return listEmbed.find(embed => embed.uid === uid);
}

class EmbedInChannel {
    constructor (messageId, channelId, swiperUid, swiperType, embedUid) {
        this.swiperIndex = 0;
        this.swiperUid = swiperUid;
        this.swiperType = swiperType;
        this.messageId = messageId;
        this.channelId = channelId;
        this.embedUid = embedUid;
        this.embed = getEmbedByUid(this.embedUid);
        this.getTheSwiper(this.swiperUid);
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

    /**
     *
     * @returns {String} The url of the next image
     */
    getNextImageUrl() {
        const maxLength = this.swiper.swiperImages.length;
        const nextIndex = this.swiperIndex + 1;
        this.swiperIndex = (maxLength === nextIndex) ? 0 : nextIndex % maxLength;
        return this.swiper.swiperImages[this.swiperIndex].imageUrl;
    }

    async refreshSwiper(client) {
        if (this.swiperType !== 'AUTO' || !this.hasSwiper) return;
        const newImageUrl = this.getNextImageUrl();
        const newEmbed = this.embed.generateEmbed().setImage(newImageUrl);
        const message = await fetchMessageById(client, this.channelId, this.messageId);
        if(message) message.edit({ embeds: [newEmbed] });
    }
}

class Embed {
    constructor (color, author, title, description, imageUrl, thumbnailUrl, name, fields, uid, embedsSent, swiperUid, footerTitle, footerIconUrl, embedUrl) {
        this.swiperUid = swiperUid;
        /**
         * @type {Array<EmbedInChannel>}
         */
        this.embedsSent = embedsSent;
        this.fields = fields;
        this.color = color;
        this.author = author;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.name = name;
        this.uid = uid;
        this.footerTitle = footerTitle;
        this.footerIconUrl = footerIconUrl;
        this.embedUrl = embedUrl;
        this.getTheSwiper(this.swiperUid);
    }

    addEmbedSent(channelId, messageId, type) {
        this.embedsSent.push(new EmbedInChannel(messageId, channelId, this.swiperUid, type, this.uid));
    }

    getTheSwiper(swiperUid) {
        if(swiperUid) {
            this.swiper = getSwiperByUid(swiperUid);
            this.hasSwiper = !!this.swiper;
        } else {
            this.swiper = null;
            this.hasSwiper = false;
        }
    }

    /**
     *
     * @param {String} newSwiperUid
     * @param {Client} client
     */
    updateSwiper(newSwiperUid, client) {
        this.getTheSwiper(newSwiperUid);
        this.synchronize(client);
        this.imageUrl = null;
    }

    /**
     *
     * @param {String} key
     * @param {String} newValue
     * @param {Client} client
     */
    update(key, newValue, client) {
        this[key] = newValue;
        if(key === 'imageUrl') this.getTheSwiper(null);
        this.synchronize(client);
    }

    /**
     *
     * @param {MessageEmbed} embed
     * @param {String} swiperUid
     * * @param {Client} client
     */
    updateAll (embed, swiperUid, client) {
        this.color = embed.color;
        this.title = embed.title;
        this.getTheSwiper(swiperUid);
        this.fields = embed.fields;
        this.imageUrl = swiperUid ? null : embed.image?.url ?? null;
        this.author = { iconURL: embed.author?.iconURL, name: embed.author?.name, url: embed.author?.url };
        this.description = embed.description;
        this.embedUrl = embed.url;
        this.footerIconUrl = embed.footer?.iconURL;
        this.footerTitle = embed.footer?.text;
        this.thumbnailUrl = embed.thumbnail?.url;
        this.synchronize(client);
    }

    getFieldByName(name) {
        return this.fields.find(field => field.name === name);
    }

    /**
     *
     * @param {String} name
     * @param {Client} client
     * @returns
     */
    async removeFieldsByName(name, client) {
        try {
            await ModelEmbedField.destroy({ where: {name, linkedTo: this.uid} });
            this.fields = this.fields.filter(field => field.name !== name);
            this.synchronize(client);

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     *
     * @param {String} name
     * @param {String} value
     * @param {Boolean} inline
     * @param {Client} client
     * @returns
     */
    async addFields(name, value, inline, client) {
        try {
            await ModelEmbedField.create({ name, value, inline, linkedTo: this.uid });
            this.fields.push({ name, value, inline });
            this.synchronize(client);
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
        else if(this.footerTitle) embed.setFooter({ text: this.footerTitle, iconURL: this.footerIconUrl });
        embed.setURL(this.embedUrl);

        return embed;
    }

    /**
     *
     * @returns {Array<EmbedInChannel>}
     */
    getListOfEmbedsSent() {
        return this.embedsSent;
    }

    /**
     *
     * @param {TextChannel} channel
     */
    async sendEmbedInChannel(channel, type = 'AUTO') {
        const message = await channel.send({ embeds: [this.generateEmbed()] });
        ModelEmbedInChannel.create({ channelId: channel.id, messageId: message.id, linkedTo: this.uid, swiperType: type });
        this.addEmbedSent(channel.id, message.id, type);
    }

    /**
     *
     * @param {Client} client
     */
    async synchronize (client) {
        const embed = this.generateEmbed();
        for(const msgSent of this.embedsSent) {
            const msg = await fetchMessageById(client, msgSent.channelId, msgSent.messageId);
            await msg.edit({ embeds: [embed] });
        }
    }

    async deleteFromEmbedSent (messageId) {
        this.embedsSent = this.embedsSent.filter(embedSent => embedSent.messageId !== messageId);
        await ModelEmbedInChannel.destroy({ where: { messageId } });
    }
}


module.exports = {
    getEmbedByName,
    addEmbed,
    deleteEmbed,
    getListEmbed,
    initializeAllEmbeds,
    getEmbedByUid,
}