const { DataTypes } = require("sequelize");
const sequelize = require("../connection");
const fs = require('fs');
const path = require('path');

const Stock = sequelize.define(
  "Stock",
  {
    Id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      collate: "utf8mb4_spanish_ci",
    },
    Type: {
      type: DataTypes.ENUM("SHARES", "COMMODITIES", "CRYPTOS"),
      allowNull: false,
      collate: "utf8mb4_spanish_ci",
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      collate: "utf8mb4_spanish_ci",
    },
    ActualPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    OpenPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    tableName: "stocks",
    timestamps: false,
  }
);

async function createStockTable() {
  try {
    await Stock.sync();
    console.log("Tabla de stocks creada correctamente.");
  } catch (error) {
    console.error("Error al crear la tabla de stocks:", error);
  }
}

async function insertStockValues(id, type, name, actualPrice, openPrice) {
  try {
    const stock = await Stock.create({
      Id: id,
      Type: type,
      Name: name,
      ActualPrice: actualPrice,
      OpenPrice: openPrice,
    });
    console.log("Stock insertado correctamente");
    return stock;
  } catch (error) {
    console.error("Error al insertar stock:", error);
  }
}

async function updateStockPrice(id, actualPrice, openPrice) {
  try {
    const stock = await Stock.findByPk(id);

    if (stock) {
      const stockUpdate = await stock.update({
        ActualPrice: actualPrice,
        OpenPrice: openPrice
      });
      console.log(`Stock con ID ${id} actualizado correctamente.`);
      return stockUpdate;
    } else {
      console.log(`No se encontró ningún stock con ID ${id}.`);
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
  }
}

async function createOrUpdateStockFromAPI(id, type) {
  try {
    let stock = await Stock.findByPk(id);
    let stockData = null;

    if (stock) {
      switch (stock.Type) {
        case "CRYPTOS":
          stockData = readJSONFile('cryptos.json').find(item => item.ticket === id);
          break;
        case "SHARES":
          stockData = readJSONFile('shares.json').find(item => item.ticket === id);
          break;
        case "COMMODITIES":
          stockData = readJSONFile('commodities.json').find(item => item.ticket === id);
          break;
      }

      if (stockData) {
        const actualPrice = getActualPriceFromData(stockData, type);
        const openPrice = getOpenPriceFromData(stockData, type);
        await updateStockPrice(id, actualPrice, openPrice);
      } else {
        console.log(`No se encontró ningún dato para el ID ${id} en los archivos JSON.`);
      }
    } else {
      stockData = readJSONFile('commodities.json').find(item => item.ticket === id) ||
                  readJSONFile('shares.json').find(item => item.ticket === id) ||
                  readJSONFile('cryptos.json').find(item => item.ticket === id);

      if (stockData) {
        const type = stockData.data["Meta Data"] ? (stockData.data["Meta Data"]["2. Digital Currency Code"] ? "CRYPTOS" : "SHARES") : "COMMODITIES";
        const actualPrice = getActualPriceFromData(stockData, type);
        const openPrice = getOpenPriceFromData(stockData, type);
        await insertStockValues(
          stockData.ticket,
          type,
          stockData.data["Meta Data"] ? (stockData.data["Meta Data"]["3. Digital Currency Name"] || stockData.data["Meta Data"]["2. Symbol"]) : stockData.data.name,
          actualPrice,
          openPrice
        );
      } else {
        console.log(`No se encontró ningún dato para el ID ${id} en los archivos JSON.`);
      }
    }
  } catch (error) {
    console.error('Error al actualizar o crear stock:', error);
  }
}

function getActualPriceFromData(stockData, type) {
  let closePrice;
  if (type === 'SHARES') {
    const timestamps = Object.keys(stockData.data["Time Series (1min)"]);
    const firstTimestamp = timestamps[0];
    closePrice = stockData.data["Time Series (1min)"][firstTimestamp]["4. close"];
  } else if (type === 'CRYPTOS') {
    const timestamps = Object.keys(stockData.data["Time Series (Digital Currency Daily)"]);
    const firstTimestamp = timestamps[0];
    closePrice = stockData.data["Time Series (Digital Currency Daily)"][firstTimestamp]["4. close"];
  } else if (type === 'COMMODITIES') {
    const timestamps = Object.keys(stockData.data.data);
    const firstTimestamp = timestamps[0];
    closePrice = stockData.data.data[firstTimestamp].value;
  }
  return parseFloat(closePrice);
}


function getOpenPriceFromData(stockData, type) {
  let openPrice;
  if (type === 'SHARES') {
    const timestamps = Object.keys(stockData.data["Time Series (1min)"]);
    const firstTimestamp = timestamps[0];
    openPrice = stockData.data["Time Series (1min)"][firstTimestamp]["1. open"];
  } else if (type === 'CRYPTOS') {
    const timestamps = Object.keys(stockData.data["Time Series (Digital Currency Daily)"]);
    const firstTimestamp = timestamps[0];
    openPrice = stockData.data["Time Series (Digital Currency Daily)"][firstTimestamp]["1. open"];
  } else if (type === 'COMMODITIES') {
    openPrice = 0;
  }
  return parseFloat(openPrice);
}

function readJSONFile(filename) {
  const filePath = path.join(__dirname, '../routes/api_local/data/', filename);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo JSON:', error);
    return null;
  }
}

module.exports = {
  createStockTable: createStockTable,
  insertStockValues: insertStockValues,
  updateStockPrice: updateStockPrice,
  createOrUpdateStockFromAPI: createOrUpdateStockFromAPI,
  readJSONFile: readJSONFile,
  Stock: Stock,
};
