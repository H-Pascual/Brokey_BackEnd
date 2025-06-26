const express = require("express");
const router = express.Router();
const fs = require('fs');

let path = __dirname + "/data/cryptos.json";
let cryptosData = undefined;
try {
  const data = fs.readFileSync(path, 'utf8');
  cryptosData = JSON.parse(data);
} catch (error) {
  console.error('Error al leer el archivo JSON:', error);
}

//GET ALL CRYPTOS
router.get("/", (req, res) => {
  res.json({resultado: cryptosData});
});

//GET CRYPTOS BY ID
router.get("/:ticket/:time", (req, res) => {
  const ticket = req.params.ticket;
  const time = req.params.time;

  const crypto = cryptosData.find(item => item.ticket === ticket && item.time === time);

  if (crypto) {
    res.json({resultado: crypto});
  } else {
    res.status(404).json({ message: 'Crypto not found' });
  }
});

module.exports = router;