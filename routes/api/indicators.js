const express = require("express");
const router = express.Router();
const api = require(__dirname + "/stocksapi");

//function = ["REAL_GDP"]
//interval = ["annual", "quarterly"]
router.get("/REAL_GDP/:interval", async (req, res) => {
  console.log(
    api.callAPI(req, res, "REAL_GDP", null, null, null, null, req.params.interval)
  );
});

//function = ["REAL_GDP_PER_CAPITA", "INFLATION", "RETAIL_SALES", "DURABLES", "UNEMPLOYMENT", "NONFARM_PAYROLL"]
router.get("/:function", async (req, res) => {
  console.log(api.callAPI(req.params.function, null, null, null, null, null));
});

//function = ["FEDERAL_FUNDS_RATE"]
//interval = ["daily", "weekly", "monthly"]
router.get("/FEDERAL_FUNDS_RATE/:interval", async (req, res) => {
  console.log(
    api.callAPI(
      req, res, 
      "FEDERAL_FUNDS_RATE",
      null,
      null,
      null,
      null,
      req.params.interval
    )
  );
});

//function = ["CPI"]
//interval = ["monthly", "semiannual"]
router.get("/CPI/:interval", async (req, res) => {
  console.log(api.callAPI(req, res, "CPI", null, null, null, null, req.params.interval));
});

module.exports = router;
