const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

/* Conexión a la BD */
const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'mariadb',
    define: {
      collate: 'utf8mb4_spanish_ci'
    }
  });
module.exports = sequelize;