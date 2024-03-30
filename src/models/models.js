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

        name: {
            type: Sequelize.STRING,
            required: true,
        },

        linkedTo: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: Swiper(sequelize, Sequelize),
                key: 'uid'
            }
        }
    });
}

/**
 * @param {Sequelize} sequelize
 * @param {SequelizeCore} Sequelize
 * @returns {Model}
 */
const SwiperInChannel = (sequelize, Sequelize) => {
    return sequelize.define('SwiperInChannel', {
        uid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },

        channelId: {
            type: Sequelize.STRING(25),
            allowNull: false,
        },

        messageId: {
            type: Sequelize.STRING(25),
            allowNull: false,
            unique: true,
        },

        linkedTo: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: Swiper(sequelize, Sequelize),
                key: 'uid'
            }
        },

        kind: {
            type: Sequelize.ENUM('AUTO', 'BUTTON'),
            allowNull: false,
        }
    });
}

module.exports = {
    Swiper,
    SwiperImage,
    SwiperInChannel,
}