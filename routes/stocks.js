const express = require("express");
const Stock = require(__dirname + "/../models/stock").Stock;
const stockMethod = require(__dirname + "/../models/stock");
const auth = require(__dirname + "/../auth/auth");
let router = express.Router();
const fs = require('fs');

//GET ALL STOCKS
router.get("/", async(req, res) => {
  try {
    const stock = await Stock.findAll();
    res.status(200).json({resultado: stock});
  } catch (error) {
    console.error(`Error buscando los stocks: `, error);
    res
      .status(500)
      .json({ error: "Ha ocurrido un error al buscar los stocks."});
  }
});

//GET STOCK BY TYPE
router.get("/type/:type", async(req, res) => {
  let type = req.params.type;
  try {
    const stock = await Stock.findAll({where: {Type: type}});
    res.status(200).json({resultado: stock});
  } catch (error) {
    console.error(`Error buscando stock por tipo: `, error);
    res
      .status(500)
      .json({ error: "Ha ocurrido un error al buscar un stock por tipo." });
  }
});

//GET STOCK BY ID
router.get("/:stockId", async(req, res) => {
  let stockId = req.params.stockId;
  try {
    const stock = await Stock.findByPk(stockId);
    res.status(200).json({resultado: stock});
  } catch (error) {
    console.error(`Error buscando stock: `, error);
    res
      .status(500)
      .json({ error: "Ha ocurrido un error al buscar un stock." });
  }
});

//POST STOCKS
router.post("/", auth.protegerRuta, async(req, res) => {
    let id = req.body.id;
    let type = req.body.type;
    let name = req.body.name;
    let actualPrice = req.body.actualPrice;
    let openPrice = req.body.openPrice;
    stockMethod.insertStockValues(id, type, name, actualPrice, openPrice).then(resultado => {
        res.status(200).send({resultado: resultado});
      }).catch(error => {
        res.status(400).send({error: "Error creando stock"});
      });
});

//UPDATE STOCK PRICE
router.put("/:stockId", auth.protegerRuta, async(req, res) => {
  let stockId = req.params.stockId;
  let price = req.body.price;
  stockMethod.updateStockPrice(stockId, price).then(resultado => {
    res.status(200).send({resultado: resultado});
  }).catch(error => {
    res.status(400).send({error: "Error actualizando el precio de stock."});
  });
});

//UPDATE OR POST STOCK FROM API
router.post("/api/:stockId", auth.protegerRuta, async (req, res) => {
  const stockId = req.params.stockId;
  try {
    await stockMethod.createOrUpdateStockFromAPI(stockId);
    res.status(200).send({ message: `Stock procesado correctamente.` });
  } catch (error) {
    res.status(500).send({ error: "Error al procesar el stock desde la API." });
  }
});

module.exports = router;