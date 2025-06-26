var request = require("request");
const dotenv = require("dotenv");

dotenv.config();

function createURL(
  functionName,
  symbol,
  forexstart,
  forexend,
  market,
  interval
) {
  var url = "https://www.alphavantage.co/query?function=" + functionName;
  if (symbol != null) url += "&symbol=" + symbol;
  if (forexstart != null) url += "&from_symbol=" + forexstart;
  if (forexend != null) url += "&to_symbol=" + forexend;
  if (market != null) url += "&market=" + market;
  if (interval != null) url += "&interval=" + interval;
  url += "&apikey=" + process.env.APIKEY;
  return url;
}

function callAPI(req, res, functionName, symbol, forexstart, forexend, market, interval) {
  request.get(
    {
      url: createURL(functionName, symbol, forexstart, forexend, market, interval),
      json: true,
      headers: { "User-Agent": "request" },
    },
    (err, response, data) => {
      if (err) {
        res.status(500).json({ error: "Se produjo un error al llamar a la API" });
      } else if (response.statusCode !== 200) {
        res.status(500).json({ error: "Se produjo un error al llamar a la API" });
      } else {
        res.status(200).json(data);
      }
    }
  );
}

module.exports = {
  callAPI: callAPI,
};
