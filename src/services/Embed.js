const db = require('../models');
const ModelEmbed = db.Embed;
const ModelEmbedField = db.EmbedField;
const ModelEmbedInChannel = db.EmbedInChannel;

const { MessageEmbed } = require("discord.js");

const listEmbed = [];

class Embed {
    constructor (color, author, title, description, imageUrl, thumbnailUrl, name, fields, uid) {
        this.fields = fields;
        this.color = color;
        this.author = author;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.name = name;
        this.uid = uid;
    }

    update(key, newValue) {
        this[key] = newValue;
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
        // if(this.imageUrl) embed.setImage(this.imageUrl);
        if(this.description) embed.setDescription(this.description);
        if(this.thumbnailUrl) embed.setThumbnail(this.thumbnailUrl);

        return embed;
    }

    synchronize() {
        const embed = this.generateEmbed();
    }
}

async function addEmbed(color, authorIconUrl, authorUrl, authorName, title, description, imageUrl, thumbnailUrl, name, channel) {
    try {
        const { dataValues: data } = await ModelEmbed.create({ name, title, authorName, authorIconUrl, authorUrl, color, description, imageUrl, thumbnailUrl });
        const author = { name: authorName, url: authorUrl, iconUrl: authorIconUrl };
        listEmbed.push(new Embed(color, author, title, description, imageUrl, thumbnailUrl, name, [], data.uid));
        return true;
    } catch (error) {
        return false;
    }
}

function getListEmbed() {
    return listEmbed;
}

async function removeFromEditList(uid) {
    listEmbedUpdated = listEmbedUpdated.filter(embed => embed.uid !== uid);
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

module.exports = {
    getEmbedByName,
    addEmbed,
    deleteEmbed,
    removeFromEditList,
    getListEmbed,
}