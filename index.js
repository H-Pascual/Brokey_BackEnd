/* Librerías */
const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const connection = require("./connection");
const cargadatos = require("./cargadatos");
const cors = require('cors');

dotenv.config();

const contains = require(__dirname + "/routes/contains");
const likes = require(__dirname + "/routes/likes");
const operations = require(__dirname + "/routes/operations");
const portfolios = require(__dirname + "/routes/portfolios");
const stocks = require(__dirname + "/routes/stocks");
const transactions = require(__dirname + "/routes/transactions");
const users = require(__dirname + "/routes/users");
const commodities = require(__dirname + "/routes/api/commodities");
const cryptos = require(__dirname + "/routes/api/cryptos");
const shares = require(__dirname + "/routes/api/shares");
const commoditiesLocal = require(__dirname + "/routes/api_local/commodities");
const cryptosLocal = require(__dirname + "/routes/api_local/cryptos");
const sharesLocal = require(__dirname + "/routes/api_local/shares");

let app = express();

app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use(express.json());
app.use("/contains", contains);
app.use("/likes", likes);
app.use("/operations", operations);
app.use("/portfolios", portfolios);
app.use("/stocks", stocks);
app.use("/transactions", transactions);
app.use("/users", users);
app.use("/commodities", commodities);
app.use("/cryptos", cryptos);
app.use("/shares", shares);
app.use("/commodities_local", commoditiesLocal);
app.use("/cryptos_local", cryptosLocal);
app.use("/shares_local", sharesLocal);

connection.sync().then(() => {
    console.log("Connected database");
  })
  .catch((err) => {
    console.error("Could not connect to database:", err);
  });

http.createServer(app).listen(process.env.PUERTO, () => {
  console.log("Express Server started 8080");
});

//cargadatos.loadStocksFromAPI();
cargadatos.loadStocksFromJSON();