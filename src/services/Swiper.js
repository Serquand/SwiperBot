const { TextChannel } = require('discord.js');
const db = require('../models');
const { fetchMessageById } = require('../tools/discord');
const ModelSwiper = db.Swiper;
const ModelSwiperImage = db.SwiperImage;
const SwiperInChannel = db.SwiperInChannel;

let allSwipers = [];
let allSwiperTemplate = [];

class SwiperTemplate {
    constructor (swiperName, swiperDescription, swiperUid) {
        this.swiperName = swiperName;
        this.swiperDescription = swiperDescription;
        this.swiperUid = swiperUid;
        this.swiperImages = [];
    }

    addImage (imageUrl, imageName) {
        this.swiperImages.push(new SwiperImage(imageUrl, imageName));
    }

    removeImage (imageName) {
        this.swiperImages = this.swiperImages.filter((swiper) => swiper.imageName !== imageName);
    }

    getImageByName (imageName) {
        return this.swiperImages.find((swiper) => swiper.imageName === imageName);
    }
}

class SwiperImage {
    constructor (imageUrl, imageName) {
        this.imageUrl = imageUrl;
        this.imageName = imageName;
    }
}

class Swiper {
    constructor (linkedTo, messageId, type, channelId) {
        this.linkedTo = linkedTo;
        this.messageId = messageId;
        this.type = type;
        this.currentImageIndex = 0;
        this.channelId = channelId;
    }

    goToNextImage(client) {
        this.incrementCurrentImageIndex();
        this.sendCurrentImage(client);
    }

    getCurrentImageUrl() {
        const swiper = getSwiperByUid(this.linkedTo);
        return swiper.swiperImages[this.currentImageIndex].imageUrl;
    }

    async sendCurrentImage(client) {
        const message = await fetchMessageById(client, this.channelId, this.messageId);
        if(message === null) {
            deleteSwiperInChannel(this.messageId);
        } else {
            message.edit(this.getCurrentImageUrl());
        }
    }

    incrementCurrentImageIndex() {
        const maxLength = getSwiperByUid(this.linkedTo).swiperImages.length;
        const nextIndex = this.currentImageIndex + 1;
        this.currentImageIndex = (maxLength === nextIndex) ? 0 : nextIndex % maxLength;
    }
}

/**
 *
 * @param {String} name
 * @returns {SwiperTemplate | null | undefined}
 */
function getSwiperByName(name) {
    return allSwiperTemplate.find(s => s.swiperName === name);
}

/**
 *
 * @param {String} uid
 * @returns {SwiperTemplate | null | undefined}
 */
function getSwiperByUid(uid) {
    return allSwiperTemplate.find(s => s.swiperUid === uid);
}

async function addSwiper (swiperName, swiperDescription, imageName, imageUrl) {
    try {
        const { dataValues: data } = await ModelSwiper.create({
            name: swiperName,
            description: swiperDescription,
        });
        allSwiperTemplate.push(new SwiperTemplate(swiperName, swiperDescription, data.uid));
        return await addSwiperImage(swiperName, imageName, imageUrl);;
    } catch {
        return null;
    }
}

async function addSwiperImage(swiperName, imageName, imageUrl) {
    const swiper = getSwiperByName(swiperName);
    if(!swiper) return null;

    const swiperImage = swiper.getImageByName(imageName);
    if(swiperImage) return null;

    try {
        await ModelSwiperImage.create({
            url: imageUrl,
            name: imageName,
            linkedTo: swiper.swiperUid,
        });
        swiper.addImage(imageUrl, imageName);
        return true;
    } catch (err) {
        return null;
    }
}

async function deleteSwiperInChannel(discordMessageId) {
    try {
        await SwiperInChannel.destroy({ where: { messageId: discordMessageId } });
        allSwipers = allSwipers.filter(s => s.messageId !== discordMessageId);
    } catch (err) {
        console.error(err);
    }
}

async function deleteSwiperImage(swiperName, imageName) {
    const swiper = getSwiperByName(swiperName);
    if(!swiper || swiper.swiperImages.length < 2) return null;

    const swiperImage = swiper.getImageByName(imageName);
    if(!swiperImage) return null;

    try {
        await SwiperImage.destroy({ where: { linkedTo: swiper.swiperUid, name: imageName } });
        swiper.removeImage(imageName);
        return true;
    } catch {
        return null;
    }
}

async function initializeSwiper() {
    const [resAllTemplates, resAllImages, resAllSwipers] = await Promise.all([
        ModelSwiper.findAll({ raw: true }),
        ModelSwiperImage.findAll({ raw: true }),
        SwiperInChannel.findAll({ raw: true }),
    ])

    for(const template of resAllTemplates) {
        const newTemplate = new SwiperTemplate(template.name, template.description, template.uid);
        const allImagesAssignedToTemplate = resAllImages.filter(img => img.linkedTo === template.uid);
        for(const image of allImagesAssignedToTemplate) {
            newTemplate.addImage(image.url, image.name);
        }
        allSwiperTemplate.push(newTemplate);
    }

    for(const swiper of resAllSwipers) {
        allSwipers.push(new Swiper(swiper.linkedTo, swiper.messageId, swiper.kind, swiper.channelId));
    }
}

async function deleteSwiper(swiperName) {
    const swiper = getSwiperByName(swiperName);
    if(!swiper) return null;

    try {
        await ModelSwiper.destroy({ where: { name: swiperName } });
        allSwiperTemplate = allSwiperTemplate.filter(s => s.swiperName !== swiperName);

        await SwiperInChannel.destroy({ where: { linkedTo: swiper.swiperUid } });
        allSwipers = allSwipers.filter(s => s.linkedTo !== swiper.swiperUid);

        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

/**
 *
 * @param {String} swiperName
 * @param {TextChannel} channel
 */
async function sendSwiper(swiperName, channel) {
    const swiper = getSwiperByName(swiperName);
    const firstImage = swiper.swiperImages.at(0).imageUrl;

    try {
        const newSwiperMessage = await channel.send(firstImage);
        await SwiperInChannel.create({
            channelId: channel.id,
            messageId: newSwiperMessage.id,
            linkedTo: swiper.swiperUid,
            kind: 'AUTO',
        });
        allSwipers.push(new Swiper(swiper.swiperUid, newSwiperMessage.id, 'AUTO', channel.id));
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

/**
 *
 * @returns {Array<Swiper>}
 */
function getAllSwipers() {
    return allSwipers;
}

/**
 *
 * @returns {Array<SwiperTemplate>}
 */
function getAllSwipersTemplate() {
    return allSwiperTemplate;
}

module.exports = {
    getSwiperByName,
    addSwiper,
    addSwiperImage,
    deleteSwiperImage,
    initializeSwiper,
    deleteSwiper,
    getSwiperByUid,
    sendSwiper,
    getAllSwipers,
    getAllSwipersTemplate,
    SwiperTemplate,
    SwiperImage,
    Swiper
}