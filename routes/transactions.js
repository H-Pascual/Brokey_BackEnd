const express = require("express");
const Transaction = require(__dirname + "/../models/transaction").Transaction;
const transactionMethod = require(__dirname + "/../models/transaction");
const auth = require(__dirname + "/../auth/auth");
let router = express.Router();

//POST TRANSACTION
router.post("/", auth.protegerRuta, async(req, res) => {
    let type = req.body.Type;
    let quantity = req.body.Quantity;
    let idUser = req.body.IdUser;
    transactionMethod.insertTransactionValues(type, quantity, idUser).then(resultado => {
        res.status(200).send({resultado: resultado});
      }).catch(error => {
        res.status(400).send({error: "Error creando transacciones"});
      });
});

//GET TRANSACTIONS BY USER
router.get("/:userId", auth.protegerRuta, async(req, res) => {
    let userId = req.params.userId;
    try {
      const transaction = await Transaction.findAll({where:{IdUser: userId}});
      res.status(200).json({resultado: transaction});
    } catch (error) {
      console.error(`Error buscando transacciones: `, error);
      res
        .status(500)
        .json({ error: "Error al buscar transacciones." });
    }
});

module.exports = router;