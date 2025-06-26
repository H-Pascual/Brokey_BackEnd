const express = require("express");
const router = express.Router();
const api = require(__dirname + "/stocksapi");

//ticket = ["IBM", "NVDA", "BBVA", "TSLA", "NKE",
//  "INTC", "MSFT", "DIS", "KO", "MCD", "MMM", "AAPL", "AMZN", "WMT", "UBER"];

//function = ["TIME_SERIES_INTRADAY"]
//interval = ["1min", "5min", "15min", "30min", "60min"];
router.get("/:ticket/:interval", async (req, res) => {
  console.log(
    api.callAPI(
      req, res, 
      "TIME_SERIES_INTRADAY",
      req.params.ticket,
      null,
      null,
      null,
      req.params.interval
    )
  );
});


module.exports = router;
/*
//function  (time) = ["TIME_SERIES_DAILY", "TIME_SERIES_WEEKLY", "TIME_SERIES_MONTHLY"]
//function (details) = ["OVERVIEW", "INCOME_STATEMENT", "BALANCE_SHEET", "CASH_FLOW", "EARNINGS"]
router.get("/:function/:ticket", async (req, res) => {
  console.log(
    api.callAPI(req, res, req.params.function, req.params.ticket, null, null, null, null)
  );
});

SEARCH API 
var request = require('request');
var url = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=:keywords&apikey=demo';

request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      // data is successfully parsed as a JSON object:
      console.log(data);
    }
});
*/
