const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const bases = require('./models.js');

const PORT = process.env.MODE === 'prod' && dbConfig.PORT ? dbConfig.PORT : undefined;
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    port: PORT,
    logging: process.env.MODE === 'prod',
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Swiper = bases.Swiper(sequelize, Sequelize);
db.SwiperImage = bases.SwiperImage(sequelize, Sequelize);

module.exports = db;