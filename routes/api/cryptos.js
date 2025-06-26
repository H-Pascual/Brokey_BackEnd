const express = require("express");
const router = express.Router();
const api = require(__dirname + "/stocksapi");

//symbol = ["BTC", "ETH", "USDT", "BNB", "SOL", "USDC", "XRP", "TON", "DOGE", "ADA", "SHIB"];
//time = ["daily, weekly, monthly"];

router.get("/:symbol/:time", async (req, res) => {
  let time = null;
  if(req.params.time == "daily"){
    time = "DIGITAL_CURRENCY_DAILY";
  }else if(req.params.time == "weekly"){
    time = "DIGITAL_CURRENCY_WEEKLY";
  }else{
    time = "DIGITAL_CURRENCY_MONTHLY";
  }
  console.log(
    api.callAPI(
      req,
      res,
      time,
      req.params.symbol,
      null,
      null,
      "EUR",
      req.params.time
    )
  );
});

module.exports = router;
