const { DataTypes } = require("sequelize");
const sequelize = require("../connection");
const Portfolio = require(__dirname + "/portfolio").Portfolio;
const Stock = require(__dirname + "/stock").Stock;

const Contain = sequelize.define(
  "Contain",
  {
    StockId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      collate: "utf8mb4_spanish_ci",
      references: {
        model: "stocks",
        key: "Id",
      },
    },
    PortfolioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      defaultValue: 0,
      references: {
        model: "portfolios",
        key: "Id",
      },
    },
    FirstPurchaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 0,
    },
    AveragePurchasePrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    Quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "contains",
    timestamps: false,
  }
);

Contain.belongsTo(Portfolio, { foreignKey: "PortfolioId" });
Contain.belongsTo(Stock, { foreignKey: "StockId" });

async function createContainTable() {
  try {
    await Contain.sync();
    console.log("Tabla de contains creada correctamente.");
  } catch (error) {
    console.error("Error al crear la tabla de contains:", error);
  }
}

async function insertContainValues(stockId, portfolioId, quantity) {
  try {
    let date = new Date();
    let actualDate = date
      .toLocaleString("en-US", { timeZone: "UTC" })
      .replace(/,/, "");
      let avgPrice = await calculateAveragePrice(
        stockId,
        portfolioId,
        quantity
      );
    await Contain.create({
      StockId: stockId,
      PortfolioId: portfolioId,
      FirstPurchaseDate: actualDate,
      AveragePurchasePrice: avgPrice,
      Quantity: quantity,
    });
    console.log("Contain insertado correctamente");
  } catch (error) {
    console.error("Error al insertar contain:", error);
  }
}

async function updateContainValues(stockId, portfolioId, quantity) {
  try {
    const contain = await Contain.findOne({
      where: { PortfolioId: portfolioId, StockId: stockId },
    });

    if (contain) {
      let avgPrice = await calculateAveragePrice(
        stockId,
        portfolioId,
        quantity
      );
      await contain.update({
        AveragePurchasePrice: avgPrice,
        Quantity: quantity,
      });
      console.log(
        `Contain con portfolioId ${portfolioId} y stockId ${stockId} actualizado correctamente.`
      );
    } else {
      console.log(
        `No se encontró ningún contain con portfolioId ${portfolioId} y stockId ${stockId}.`
      );
    }
  } catch (error) {
    console.error("Error al actualizar contain:", error);
  }
}

async function deleteContainValues(stockId, portfolioId) {
  try {
    const deletedRows = await Contain.destroy({
      where: { portfolioId: portfolioId, stockId: stockId },
    });

    if (deletedRows > 0) {
      console.log(
        `Se borró correctamente el registro de Contain para portfolioId ${portfolioId} y stockId ${stockId}.`
      );
    } else {
      console.log(
        `No se encontró ningún registro de Contain para portfolioId ${portfolioId} y stockId ${stockId}.`
      );
    }
  } catch (error) {
    console.error("Error al borrar el registro de Contain:", error);
  }
}

async function calculateAveragePrice(stockId, portfolioId, quantity) {
  let totalPrice = 0;
  let totalQuantity = 0;
  let actualStock = await Stock.findByPk(stockId);
  let contain = await Contain.findOne({
    where: { StockId: stockId, PortfolioId: portfolioId },
  });
  console.log("CONTAIN "+ contain);
  if (quantity > 0) {
    totalPrice += actualStock.ActualPrice * quantity;
    totalQuantity += quantity;
    if (contain) {
      totalPrice += contain.AveragePurchasePrice * contain.Quantity;
      totalQuantity += contain.Quantity;
    }
    let avgPrice = totalPrice / totalQuantity;
    return avgPrice;
  } else if (contain) {
    return (contain.AveragePurchasePrice);
  } else {
    console.error("No se puede vender una acción que no está en el portfolios");
    return 0;
  }
}

module.exports = {
  createContainTable: createContainTable,
  insertContainValues: insertContainValues,
  updateContainValues: updateContainValues,
  deleteContainValues: deleteContainValues,
  Contain: Contain,
};
