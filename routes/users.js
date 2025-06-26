const express = require("express");
const bcrypt = require("bcrypt");
const User = require(__dirname + "/../models/user").User;
const userMethods = require(__dirname + "/../models/user");
const auth = require(__dirname + "/../auth/auth");
let router = express.Router();

const saltRounds = 10;

router.get("/username/:username", async(req, res) => {
  let username = req.params.username;
  try {
    const user = await User.findOne({where: { Username: username}});
    if(user){
      res
      .status(500)
      .json({ error: "Ese username ya existe."});
    }else{
      res.status(200).json({resultado: username});
    }
  } catch (error) {
  console.error(`Error buscando los usuarios: `, error);
  res
    .status(500)
    .json({ error: "Ha ocurrido un error al buscar los usuarios."});
}
});

//GET USER BY EMAIL
router.get("/email/:email", auth.protegerRuta, async (req, res) => {
  let userEmail = req.params.email;
  try {
    const user = await User.findOne({where: {Email: userEmail}});
    res.status(200).json({resultado: user});
  } catch (error) {
    console.error(`Error buscando usuario: `, error);
    res
      .status(500)
      .json({ error: "Ha ocurrido un error al buscar un usuario." });
  }
});

//GET USER BY ID
router.get("/:userId", auth.protegerRuta, async (req, res) => {
  let userId = req.params.userId;
  try {
    const user = await User.findByPk(userId);
    res.status(200).json({resultado: user});
  } catch (error) {
    console.error(`Error buscando usuario: `, error);
    res
      .status(500)
      .json({ error: "Ha ocurrido un error al buscar un usuario." });
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  let email = req.body.Email;
  let password = req.body.Password;

  try {
    const user = await User.findOne({ where: { Email: email } });

    if (user && await bcrypt.compare(password, user.Password)) {
      res.status(200).send({ resultado: auth.generarToken(email) });
    } else {
      res.status(401).send({ error: "Login incorrecto" });
    }
  } catch (error) {
    console.error(`Error en login: `, error);
    res.status(500).send({ error: "Error en login" });
  }
});

//REGISTER
router.post("/register", async (req, res) => {
  let username = req.body.Username;
  let name = req.body.Name;
  let surname = req.body.Surname;
  let password = req.body.Password;
  let iban = req.body.Iban;
  let email = req.body.Email;
  userMethods.insertUserValues(username, name, surname, password, iban, email).then(resultado => {
    res.status(200).send({resultado: resultado});
  }).catch(error => {
    res.status(400).send({error: "Error creando usuario"});
  });
});

//UPDATE USER NAME
router.put("/:id/name", auth.protegerRuta, async (req, res) => {
  let userId = req.params.id;
  let name = req.body.name;
  let surname = req.body.Surname;
  userMethods.updateUserName(userId, name, surname).then(resultado => {
    res.status(200).send({resultado: resultado});
  }).catch(error => {
    res.status(400).send({error: "Error cambiando nombre del usuario"});
  });
});

//UPDATE USER PASSWORD
router.put("/:id/password", auth.protegerRuta, async (req, res) => {
  let userId = req.params.id;
  let password = req.body.password;
  userMethods.updateUserPassword(userId, password).then(resultado => {
    res.status(200).send({resultado: resultado});
  }).catch(error => {
    res.status(400).send({error: "Error cambiando contraseña del usuario"});
  });
});

//UPDATE USER EMAIL
router.put("/:id/email", auth.protegerRuta, async (req, res) => {
  let userId = req.params.id;
  let email = req.body.email;
  userMethods.updateUserEmail(userId, email).then(resultado => {
    res.status(200).send({resultado: resultado});
  }).catch(error => {
    res.status(400).send({error: "Error cambiando email del usuario"});
  });
});

router.put("/:id/iban", auth.protegerRuta, async (req, res) => {
  let userId = req.params.id;
  let iban = req.body.iban;
  userMethods.updateUserIban(userId, iban).then(resultado => {
    res.status(200).send({resultado: resultado});
  }).catch(error => {
    res.status(400).send({error: "Error cambiando iban del usuario"});
  });
});

module.exports = router;
