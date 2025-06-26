const express = require("express");
const router = express.Router();
const api = require(__dirname + "/stocksapi");

//function = ["FX_DAILY, FX_WEEKLY, FX_MONTHLY"];
//symbols = Currencys to exchange
router.get("/:function/:from_symbol/:to_symbol", async (req, res) => {
  console.log(
    api.callAPI(
      req, res, 
      req.params.function,
      null,
      req.params.from_symbol,
      req.params.to_symbol,
      null,
      null
    )
  );
});

module.exports = router;
