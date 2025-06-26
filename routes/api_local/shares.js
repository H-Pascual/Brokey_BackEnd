const express = require("express");
const router = express.Router();
const fs = require('fs');

let path = __dirname + "/data/shares.json";
let sharesData = undefined;
try {
  const data = fs.readFileSync(path, 'utf8');
  sharesData = JSON.parse(data);
} catch (error) {
  console.error('Error al leer el archivo JSON:', error);
}

//GET ALL SHARES
router.get("/", (req, res) => {
  res.json({resultado: sharesData});
});

//GET SHARES BY ID
router.get("/:ticket/:time", (req, res) => {
  const ticket = req.params.ticket;
  const time = req.params.time;
  const shares = sharesData.find(item => item.ticket === ticket && item.time === time);

  if (shares) {
    res.json({resultado: shares});
  } else {
    res.status(404).json({ message: 'Shares not found' });
  }
});

module.exports = router;