const express = require("express");
const Operation = require(__dirname + "/../models/operation").Operation;
const operationMethod = require(__dirname + "/../models/operation");
const auth = require(__dirname + "/../auth/auth");
let router = express.Router();

//GET OPERATIONS BY PORTFOLIO
router.get("/:idPortfolio", auth.protegerRuta, async(req, res) => {
    let id = req.params.idPortfolio;
    try {
        const operations = await Operation.findAll({ where: { PortfolioId: id } });
        res.status(200).json({resultado: operations});
      } catch (error) {
        console.error(`Error buscando operaciones: `, error);
        res
          .status(500)
          .json({ error: "Ha ocurrido un error al buscar las operaciones." });
      }
});

//POST OPERATION
router.post("/", auth.protegerRuta, async(req, res) => {
    let operationType = req.body.operationType;
    let portfolioId = req.body.portfolioId;
    let stockId = req.body.stockId;
    let quantity = req.body.quantity;
    operationMethod.insertOperationValues(  
        operationType,
        portfolioId,
        stockId,
        quantity).then(resultado => {
        res.status(200).send({resultado: resultado});
      }).catch(error => {
        res.status(400).send({error: "Error creando operacion"});
      });
});

module.exports = router;