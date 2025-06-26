const { DataTypes } = require('sequelize');
const sequelize = require('../connection');
const User = require(__dirname + '/user').User;
const Stock = require(__dirname + '/stock').Stock;

const Like = sequelize.define('Like', {
  StockId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    collate: 'utf8mb4_spanish_ci',
    references: {
      model: 'stocks',
      key: 'Id'
    }
  },
  UserId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'users',
      key: 'Id'
    }
  }
}, {
  tableName: 'likes',
  timestamps: false
});

Like.belongsTo(User, { foreignKey: 'UserId' });
Like.belongsTo(Stock, { foreignKey: 'StockId' });

async function createLikeTable() {
  try {
    await Like.sync();
    console.log('Tabla de likes creada correctamente.');
  } catch (error) {
    console.error('Error al crear la tabla de likes:', error);
  }
}

async function insertLikeValues(stockId, userId) {
  try {
    const like = await Like.create({
      StockId: stockId,
      UserId: userId,
    });
    console.log("Like insertado correctamente");
    return like;
  } catch (error) {
    console.error("Error al insertar like:", error);
  }
}

async function deleteLikeValues(stockId, userId) 
{
  try {
    const deletedRows = await Like.destroy({ where: { StockId: stockId, UserId: userId } });

    if (deletedRows > 0) {
      console.log(`Se borró correctamente el registro de Like para userId ${userId} y stockId ${stockId}.`);
    } else {
      console.log(`No se encontró ningún registro de Like para userId ${userId} y stockId ${stockId}.`);
    }
  } catch (error) {
    console.error('Error al borrar el registro de Like:', error);
  }
}

module.exports = {
    createLikeTable: createLikeTable,
    insertLikeValues: insertLikeValues,
    deleteLikeValues: deleteLikeValues,
    Like: Like,
  };