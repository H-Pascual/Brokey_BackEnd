const express = require("express");
const Like = require(__dirname + "/../models/like").Like;
const likeMethod = require(__dirname + "/../models/like");
const auth = require(__dirname + "/../auth/auth");
let router = express.Router();

//GET LIKES BY USER
router.get("/:userId", auth.protegerRuta, async(req, res) => {
    let id = req.params.userId;
    try {
        const like = await Like.findAll({where:{UserId: id}});
        res.status(200).json({resultado: like});
      } catch (error) {
        console.error(`Error buscando likes de usuario: `, error);
        res
          .status(500)
          .json({ error: "Ha ocurrido un error al buscar los likes de un usuario." });
      }
});

//POST LIKE
router.post("/", auth.protegerRuta, async(req, res) => {
    let stockId = req.body.StockId;
    let userId = req.body.UserId;
    try {
      const like = await likeMethod.insertLikeValues(stockId, userId);
      res.status(200).send({resultado: like });
    } catch (error) {
      res.status(400).send({ error: "Error creando like para usuario" });
    }
});


//DELETE LIKE
router.delete("/", auth.protegerRuta, async(req, res) => {
    let stockId = req.body.StockId;
    let userId = req.body.UserId;
    likeMethod.deleteLikeValues(stockId, userId).then(resultado => {
        res.status(200).send();
      }).catch(error => {
        res.status(500).send({ message: 'Error al eliminar like.', error });
      });
});

module.exports = router;
