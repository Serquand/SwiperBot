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

/**
 * @param {Sequelize} sequelize
 * @param {SequelizeCore} Sequelize
 * @returns {Model}
 */
const Embed = (sequelize, Sequelize) => {
    return sequelize.define('Embed', {
        uid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },

        name: {
            type: Sequelize.STRING,
            required: true,
            unique: true,
        },

        title: {
            type: Sequelize.STRING,
            required: true,
        },

        authorName: {
            type: Sequelize.STRING,
            required: false,
        },

        authorIconUrl: {
            type: Sequelize.TEXT,
            required: false,
        },

        authorUrl: {
            type: Sequelize.TEXT,
            required: false,
        },

        color: {
            type: Sequelize.STRING(7),
            required: false,
        },

        description: {
            type: Sequelize.TEXT,
            required: false,
        },

        imageUrl: {
            type: Sequelize.TEXT,
            required: false,
        },

        thumbnailUrl: {
            type: Sequelize.TEXT,
            required: false,
        }
    })
}

/**
 * @param {Sequelize} sequelize
 * @param {SequelizeCore} Sequelize
 * @returns {Model}
 */
const EmbedField = (sequelize, Sequelize) => {
    return sequelize.define('EmbedField', {
        uid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },

        name: {
            type: Sequelize.TEXT,
            required: true,
        },

        value: {
            type: Sequelize.TEXT,
            required: true,
        },

        inline: {
            type: Sequelize.BOOLEAN,
            required: true,
        },

        linkedTo: {
            type: Sequelize.UUID,
            references: {
                model: Embed(sequelize, Sequelize),
                key: "uid"
            },
        }
    });
}

/**
 * @param {Sequelize} sequelize
 * @param {SequelizeCore} Sequelize
 * @returns {Model}
 */
const EmbedInChannel = (sequelize, Sequelize) => {
    return sequelize.define('EmbedInChannel', {
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
                model: Embed(sequelize, Sequelize),
                key: 'uid'
            }
        },
    })
}

module.exports = {
    Swiper,
    SwiperImage,
    SwiperInChannel,
    Embed,
    EmbedField,
    EmbedInChannel,
}