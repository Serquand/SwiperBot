const { Sequelize, Model } = require('sequelize');
const SequelizeCore = require('sequelize');

/**
 * @param {Sequelize} sequelize
 * @param {SequelizeCore} Sequelize
 * @returns {Model}
 */
const Swiper = (sequelize, Sequelize) => {
    return sequelize.define('Swiper', {
        uid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },

        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },

        description: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
    })
}

/**
 * @param {Sequelize} sequelize
 * @param {SequelizeCore} Sequelize
 * @returns {Model}
 */
const SwiperImage = (sequelize, Sequelize) => {
    return sequelize.define('SwiperImage', {
        uid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },

        url: {
            type: Sequelize.TEXT,
            required: true,
        },

        linkedTo: {
            type: Sequelize.UUID,
            references: {
                model: Swiper(sequelize, Sequelize),
                key: 'uid'
            }
        }
    });
}

module.exports = {
    Swiper,
    SwiperImage,
}