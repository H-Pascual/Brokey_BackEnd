const express = require("express");
const router = express.Router();
const api = require(__dirname + "/stocksapi");

//ticket = ["WTI", "BRENT", "NATURAL_GAS", "COPPER", "ALUMINUM", "WHEAT", "CORN", "COTTON", "SUGAR", "COFFEE", "ALL_COMMODITIES"];
//time = ["daily, weekly, monthly"];

router.get("/:ticket/:time", async (req, res) => {
  console.log(
    api.callAPI(req, res, req.params.ticket, null, null, null, null, req.params.time)
  );
});

module.exports = router;