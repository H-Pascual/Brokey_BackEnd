const { DataTypes } = require("sequelize");
const sequelize = require("../connection");
const User = require(__dirname + "/user").User;
const Portfolio = require(__dirname + "/portfolio").Portfolio;
const Stock = require(__dirname + "/stock").Stock;
const Contain = require(__dirname + "/contain").Contain;
const portfolioMethod = require(__dirname + "/portfolio");
const containMethod = require(__dirname + "/contain");
const userMethod = require(__dirname + "/user");

const Operation = sequelize.define(
  "Operation",
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    OperationType: {
      type: DataTypes.ENUM("BUY", "SELL"),
      allowNull: false,
      collate: "utf8mb4_spanish_ci",
    },
    PortfolioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "portfolios",
        key: "Id",
      },
    },
    StockId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "",
      references: {
        model: "stocks",
        key: "Id",
      },
    },
    Date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    StockValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    Quantity: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    tableName: "operations",
    timestamps: false,
  }
);

Operation.belongsTo(Portfolio, { foreignKey: "PortfolioId" });
Operation.belongsTo(Stock, { foreignKey: "StockId" });

async function createOperationTable() {
  try {
    await Operation.sync();
    console.log("Tabla de operaciones creada correctamente.");
  } catch (error) {
    console.error("Error al crear la tabla de operaciones:", error);
  }
}

async function insertOperationValues(
  operationType,
  portfolioId,
  stockId,
  quantity
) {
  try {
    let stock = await Stock.findByPk(stockId);
    let portfolio = await Portfolio.findByPk(portfolioId);
    let date = new Date();
    let actualDate = date
      .toLocaleString("en-US", { timeZone: "UTC" })
      .replace(/,/, "");
    if (stock && portfolio) {
        if (operationType == "SELL") {
          let contain = await Contain.findOne({ where: { PortfolioId: portfolioId, StockId: stockId } });
          if(contain){
            let stockQuantity = contain.Quantity;
            if(quantity <= stockQuantity){
              sellStock(portfolio.UserId, portfolioId, stockId, quantity, stock.ActualPrice);
              await Operation.create({
                PortfolioId: portfolioId,
                StockId: stockId,
                Date: actualDate,
                StockValue: stock.ActualPrice,
                Quantity: quantity,
                OperationType: operationType,
              });
              console.log("Operacion insertado correctamente");
            }else{
              console.log("El usuario no tiene tantas acciones");
            }
          }else{
            console.log("El usuario no tiene tantas acciones");
          }
        }
        if (operationType == "BUY") {
          let user = await User.findByPk(portfolio.UserId);
          if(user){
            totalValue = stock.ActualPrice * quantity;
            if(totalValue <= user.TotalCash){
                buyStock(portfolio.UserId, portfolioId, stockId, quantity, stock.ActualPrice);
                const operation = await Operation.create({
                  OperationType: operationType,
                  PortfolioId: portfolioId,
                  StockId: stockId,
                  Date: actualDate,
                  StockValue: stock.ActualPrice,
                  Quantity: quantity,
                });
                console.log("Operacion insertado correctamente");
                return operation;
            } else{
              console.log("El usuario no tiene dinero suficiente");
            }
          }else{
            console.log("Usuario no encontrado");
          }
        }
    } else {
      console.log("Stock o portfolio no encontrado");
    }
  } catch (error) {
    console.error("Error al insertar operacion:", error);
  }
}

async function sellStock(userId, portfolioId, stockId, quantity, price) {
  let contain = await Contain.findOne({
    where: { PortfolioId: portfolioId, StockId: stockId },
  });
  if (contain) {
    let newQuantity = contain.Quantity - quantity;
    if ((newQuantity == 0)) {
      await portfolioMethod.updatePortfolioDeleteStock(portfolioId);
      await containMethod.deleteContainValues(stockId, portfolioId);
    }else{
      await containMethod.updateContainValues(stockId, portfolioId, newQuantity);
    }
    let totalInvested = -(quantity * price);
    let totalCash = quantity * price;
    await userMethod.updateUserTotalInvested(userId, totalInvested);
    await userMethod.updateUserTotalCash(userId, totalCash);
  } else {
    console.error("No existe ese stock en ese portfolios:", error);
  }
}

async function buyStock(userId, portfolioId, stockId, quantity, price) {
  let contain = await Contain.findOne({where: {PortfolioId: portfolioId, StockId: stockId}});
  if(contain){
    let newQuantity = quantity + contain.Quantity;
    await containMethod.updateContainValues(stockId, portfolioId, newQuantity);
  }else{
    await containMethod.insertContainValues(stockId, portfolioId, quantity);
    await portfolioMethod.updatePortfolioAddStock(portfolioId);
  }
  let totalInvested = quantity * price;
  let totalCash = -(quantity * price);
  await userMethod.updateUserTotalInvested(userId, totalInvested);
  await userMethod.updateUserTotalCash(userId, totalCash);
}

module.exports = {
  createOperationTable: createOperationTable,
  insertOperationValues: insertOperationValues,
  Operation: Operation,
};
