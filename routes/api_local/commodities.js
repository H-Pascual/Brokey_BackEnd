const express = require("express");
const router = express.Router();
const fs = require('fs');

let path = __dirname + "/data/commodities.json";
let commoditiesData = undefined;
try {
  const data = fs.readFileSync(path, 'utf8');
  commoditiesData = JSON.parse(data);
} catch (error) {
  console.error('Error al leer el archivo JSON:', error);
}

//GET ALL COMMODITIES
router.get("/", (req, res) => {
  res.json({resultado: commoditiesData});
});

//GET COMMODITIES BY ID
router.get("/:ticket", (req, res) => {
  const ticket = req.params.ticket;

  const commodity = commoditiesData.find(item => item.ticket === ticket);

  if (commodity) {
    res.json({resultado: commodity});
  } else {
    res.status(404).json({ message: 'Commodity not found' });
  }
});

module.exports = router;