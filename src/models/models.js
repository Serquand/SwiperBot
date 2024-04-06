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

        swiperUid: {
            type: Sequelize.UUID,
            references: {
                model: Swiper(sequelize, Sequelize),
                key: "uid"
            },
            onDelete: 'SET NULL',
        },

        thumbnailUrl: {
            type: Sequelize.TEXT,
            required: false,
        },

        footerTitle: {
            type: Sequelize.STRING,
            required: false,
        },

        footerIconUrl: {
            type: Sequelize.TEXT,
            required: false,
        },

        embedUrl: {
            type: Sequelize.TEXT,
            required: false,
        },
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

        swiperType: {
            type: Sequelize.ENUM('AUTO', 'BUTTON'),
            allowNull: true,
        }
    })
}

/**
 * @param {Sequelize} sequelize
 * @param {SequelizeCore} Sequelize
 * @returns {Model}
 */
const SelectMenu = (sequelize, Sequelize) => {
    return sequelize.define('SelectMenu', {
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
            type: Sequelize.STRING,
            allowNull: false,
        },

        placeholder: {
            type: Sequelize.STRING(50),
            allowNull: false,
        }
    });
}

/**
 * @param {Sequelize} sequelize
 * @param {SequelizeCore} Sequelize
 * @returns {Model}
 */
const SelectMenuOption = (sequelize, Sequelize) => {
    return sequelize.define('SelectMenuOption', {
        uid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },

        linkedTo: {
            type: Sequelize.UUID,
            references: {
                model: SelectMenu(sequelize, Sequelize),
                key: 'uid'
            },
            onDelete: "CASCADE",
        },

        needToSend: {
            type: Sequelize.UUID,
            references: {
                model: Embed(sequelize, Sequelize),
                key: 'uid'
            }
        },

        label: {
            type: Sequelize.STRING(25),
            allowNull: false,
        },

        description: {
            type: Sequelize.STRING(50),
            allowNull: true,
        },

        emoji: {
            type: Sequelize.STRING,
            allowNull: true,
        }
    })
}

/**
 * @param {Sequelize} sequelize
 * @param {SequelizeCore} Sequelize
 * @returns {Model}
 */
const SelectMenuInChannel = (sequelize, Sequelize) => {
    return sequelize.define('SelectMenuInChannel', {
        uid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },

        linkedTo: {
            type: Sequelize.UUID,
            references: {
                model: SelectMenu(sequelize, Sequelize),
                key: 'uid',
            },
            onDelete: "CASCADE",
        },

        channelId: {
            type: Sequelize.STRING(25),
            allowNull: false,
        },

        messageId: {
            type: Sequelize.STRING(25),
            allowNull: false,
            unique: true,
        }
    })
}

module.exports = {
    Swiper,
    SwiperImage,
    SwiperInChannel,
    Embed,
    EmbedField,
    EmbedInChannel,
    SelectMenu,
    SelectMenuOption,
    SelectMenuInChannel,
}