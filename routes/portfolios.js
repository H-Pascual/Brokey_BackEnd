const express = require("express");
const Portfolio = require(__dirname + "/../models/portfolio").Portfolio;
const portfolioMethod = require(__dirname + "/../models/portfolio");
const auth = require(__dirname + "/../auth/auth");
let router = express.Router();

//GET PORTFOLIOS BY ID
router.get("/:id", auth.protegerRuta, async(req, res) => {
    let id = req.params.id;
    try {
        const portfolio = await Portfolio.findByPk(id);
        res.status(200).json({resultado: portfolio});
      } catch (error) {
        console.error(`Error buscando portfolio: `, error);
        res
          .status(500)
          .json({ error: "Ha ocurrido un error al buscar un portfolio." });
      }
});

//GET PORTFOLIOS BY USER
router.get("/user/:userId", auth.protegerRuta, async(req, res) => {
  let userId = req.params.userId;
  try {
      const portfolio = await Portfolio.findAll({where:{UserId: userId}});
      res.status(200).json({resultado: portfolio});
    } catch (error) {
      console.error(`Error buscando portfolio: `, error);
      res
        .status(500)
        .json({ error: "Ha ocurrido un error al buscar un portfolio." });
    }
});

//POST PORTFOLIO
router.post("/", auth.protegerRuta, async(req, res) => {
    let name = req.body.Name;
    let userId = req.body.UserId;
    portfolioMethod.insertPortfolioValues(name, userId).then(resultado => {
        res.status(200).send({resultado: resultado});
      }).catch(error => {
        res.status(400).send({error: "Error creando portfolio"});
      });
});

//UPDATE PORTFOLIO NAME
router.put("/name/:id", auth.protegerRuta, async(req, res) => {
    let name = req.body.Name;
    let id = req.params.id;
    portfolioMethod.updatePortfolioName(id, name).then(resultado => {
        res.status(200).send({resultado: resultado});
      }).catch(error => {
        res.status(400).send({error: "Error cambiando nombre de portfolio"});
      });
});

//HIDE PORTFOLIO
router.put("/hide/:id", auth.protegerRuta, async(req, res) => {
  console.log(req.params.id);
    let id = req.params.id;
    try {
        portfolioMethod.updatePortfolioVisibility(id).then(resultado => {
            res.status(200).send({resultado: resultado})});
      } catch (error) {
        console.error(`Error buscando portfolio: `, error);
        res
          .status(500)
          .json({ error: "Ha ocurrido un error al buscar un portfolio." });
      }
});

module.exports = router;