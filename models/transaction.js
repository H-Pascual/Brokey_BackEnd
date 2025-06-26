const { DataTypes } = require('sequelize');
const sequelize = require('../connection');
const User = require(__dirname + '/user').User;
const userMethod = require(__dirname + '/user');

const Transaction = sequelize.define('Transaction', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Type: {
    type: DataTypes.ENUM('INFLOW', 'OUTFLOW'),
    allowNull: false,
    collate: 'utf8mb4_spanish_ci'
  },
  Quantity: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  IdUser: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'transactions',
  timestamps: false
});

Transaction.belongsTo(User, { foreignKey: 'IdUser' });

async function createTransactionTable() {
  try {
    await Transaction.sync();
    console.log('Tabla de transacciones creada correctamente.');
  } catch (error) {
    console.error('Error al crear la tabla de transacciones:', error);
  }
}

async function insertTransactionValues(type, quantity, idUser) {
  try {
    if(type == "OUTFLOW")
      quantity = -quantity;
    if (await userMethod.updateUserTotalCash(idUser, quantity)){
    let date = new Date();
    let actualDate = date.toLocaleString('en-US', { timeZone: 'UTC' }).replace(/,/, '');
    const transaction = await Transaction.create({
      Type: type,
      Quantity: quantity,
      Date: actualDate,
      IdUser: idUser,
    });
      console.log("Transaccion insertado correctamente");
      return transaction;
    }
  } catch (error) {
    console.error("Error al insertar transaccion:", error);
  }
}

module.exports = {
  createTransactionTable: createTransactionTable,
  insertTransactionValues: insertTransactionValues,
  Transaction: Transaction
};
