const db = require('../models');
const ModelSwiper = db.Swiper;
const ModelSwiperImage = db.SwiperImage;

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

class Swiper extends SwiperTemplate {

}

/**
 *
 * @param {String} name
 * @returns {SwiperTemplate | null | undefined}
 */
function getSwiperByName(name) {
    return allSwipers.find(s => s.swiperName === name);
}

async function addSwiper (swiperName, swiperDescription, imageName, imageUrl) {
    try {
        const { dataValues: data } = await ModelSwiper.create({
            name: swiperName,
            description: swiperDescription,
        });
        allSwiperTemplate.push(new SwiperTemplate(swiperName, swiperDescription, data.uid));
        await addSwiperImage(swiperName, imageName, imageUrl);
    } catch {
        return null;
    }
}

async function addSwiperImage(swiperName, imageName, imageUrl) {
    const swiper = getSwiperByName(swiperName);
    if(!swiper) return null;

    const swiperImage = swiper.getImageByName(imageName);
    if(!swiperImage) return null;

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

async function deleteSwiperImage(swiperName, imageName) {
    const swiper = getSwiperByName(swiperName);
    if(!swiper) return null;

    const swiperImage = swiper.getImageByName(imageName);
    if(!swiperImage) return null;

    try {
        await SwiperImage.destroy({ where: { linkedTo: swiper.swiperUid, name: imageName } });
        swiper.removeImage(imageName);
    } catch {
        return null;
    }
}

function initializeSwiper() {

}

module.exports = {
    getSwiperByName,
    addSwiper,
    addSwiperImage,
    deleteSwiperImage,
    initializeSwiper,
    SwiperTemplate,
    SwiperImage,
    Swiper
}