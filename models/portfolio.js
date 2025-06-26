const { DataTypes } = require("sequelize");
const sequelize = require("../connection");
const User = require(__dirname + "/user").User;
const Portfolio = sequelize.define(
  "Portfolio",
  {
    Id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      collate: "utf8mb4_spanish_ci",
    },
    CreationDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    NumStocks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "Id",
      },
    },
    ShowPortfolio: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    tableName: "portfolios",
    timestamps: false,
  }
);

Portfolio.belongsTo(User, { foreignKey: "UserId" });

async function createPortfolioTable() {
  try {
    await Portfolio.sync();
    console.log("Tabla de portfolios creada correctamente.");
  } catch (error) {
    console.error("Error al crear la tabla de portfolios:", error);
  }
}

function ValidateName(name){
  if (typeof name !== "string" || name.length < 1 || name.length > 50) {
    return false;
  }
  return true;
}

async function insertPortfolioValues(name, userId) {
  try {
    let date = new Date();
    let actualDate = date
      .toLocaleString("en-US", { timeZone: "UTC" })
      .replace(/,/, "");
    const user = await User.findByPk(userId);
    if(user && ValidateName(name)){
      const portfolio = await Portfolio.create({
        Name: name,
        CreationDate: actualDate,
        NumStocks: 0,
        UserId: userId,
        ShowPortfolio: 0,
      });
      console.log("Portfolio insertado correctamente");
      return portfolio;
    }else{
      console.log("Error al crear portfolio");
    }
  } catch (error) {
    console.error("Error al insertar portfolio:", error);
  }
}

async function updatePortfolioName(id, name) {
  try {
    const portfolio = await Portfolio.findByPk(id);

    if (portfolio) {
      const portfolioUpdate = await portfolio.update({
        Name: name,
      });
      console.log(`Portfolio con ID ${id} actualizado correctamente.`);
      return portfolioUpdate;
    } else {
      console.log(`No se encontró ningún portfolio con ID ${id}.`);
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
  }
}

async function updatePortfolioVisibility(id) {
  try {
    const portfolio = await Portfolio.findByPk(id);

    if (portfolio) {
      if (portfolio.ShowPortfolio == 0 && portfolio.NumStocks == 0) {
        const portfolioUpdate = await portfolio.update({
          ShowPortfolio: 1,
        });
        console.log(`Portfolio con ID ${id} actualizado correctamente.`);
        return portfolioUpdate;
      } else {
        console.log(
          `El portfolio ${id} contiene dinero invertido y por ello no se puede ocultar.`
        );
      }
    } else {
      console.log(`No se encontró ningún portfolio con ID ${id}.`);
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
  }
}

async function updatePortfolioAddStock(id) {
  try {
    const portfolio = await Portfolio.findByPk(id);
      if (portfolio) {
        if (portfolio.NumStocks == null) portfolio.NumStocks = 0;
        let numStock = portfolio.NumStocks + 1;
        const portfolioUpdate = await portfolio.update({
          NumStocks: numStock,
        });
        console.log(`Portfolio con ID ${id} actualizado correctamente.`);
        return portfolioUpdate;
      } else {
        console.log(`No se encontró ningún portfolio con ID ${id}.`);
      }
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
  }
}

async function updatePortfolioDeleteStock(id) {
  try {
    const portfolio = await Portfolio.findByPk(id);

    if (portfolio) {
      if (portfolio.NumStocks > 0) {
        let numStock = portfolio.NumStocks - 1;
        await portfolio.update({
          NumStocks: numStock,
        });
        console.log(`Portfolio con ID ${id} actualizado correctamente.`);
      } else {
        console.log(`Portfolio con ID ${id} no puede tener menos stocks de 0.`);
      }
    } else {
      console.log(`No se encontró ningún portfolio con ID ${id}.`);
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
  }
}

module.exports = {
  createPortfolioTable: createPortfolioTable,
  insertPortfolioValues: insertPortfolioValues,
  updatePortfolioAddStock: updatePortfolioAddStock,
  updatePortfolioDeleteStock: updatePortfolioDeleteStock,
  updatePortfolioVisibility: updatePortfolioVisibility,
  updatePortfolioName: updatePortfolioName,
  Portfolio: Portfolio,
};
