const express = require("express");
const Contain = require(__dirname + "/../models/contain").Contain;
const containMethod = require(__dirname + "/../models/contain");
const auth = require(__dirname + "/../auth/auth");
let router = express.Router();

//GET CONTAINS BY PORTFOLIO
router.get("/:portfolioId", auth.protegerRuta, async(req, res) => {
  let id = req.params.portfolioId;
  try {
      const contain = await Contain.findAll({where:{PortfolioId: id}});
      res.status(200).json({resultado: contain});
    } catch (error) {
      console.error(`Error buscando contains de portfolio: `, error);
      res
        .status(500)
        .json({ error: "Ha ocurrido un error al buscar los contains de un portfolio." });
    }
});

module.exports = router;
