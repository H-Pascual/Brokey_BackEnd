const user = require(__dirname + "/models/user");
const stock = require(__dirname + "/models/stock");
const transaction = require(__dirname + "/models/transaction");
const portfolio = require(__dirname + "/models/portfolio");
const contain = require(__dirname + "/models/contain");
const like = require(__dirname + "/models/like");
const operation = require(__dirname + "/models/operation");
const path = require('path');
const fs = require('fs');

//CREATE TABLES 
async function createTables(){
    await user.createUserTable();
    await transaction.createTransactionTable();
    await portfolio.createPortfolioTable();
    await stock.createStockTable();
    await contain.createContainTable();
    await operation.createOperationTable();
    await like.createLikeTable();
}

function insertAllData(){
    insertUserData();
    insertTransactionData();
    insertStockData();
    insertLikeData();
    insertOperationData();
}

async function insertUserData(){
    await user.insertUserValues("hpascual", "Hector", "Pascual", "pruebaa", "ES1202254066101426779135", "hector.pascual.marin@gmail.com");
    await user.insertUserValues("prueba1", "Prueba", "Uno", "prueba1", "ES1202254066101426879135", "prueba@gmail.com");
    await user.insertUserValues("user1", "Usuario", "User", "user1", "ES3202254066101426879135", "user1@gmail.com");
    await user.insertUserValues("user2", "Hola", "Prueba", "contrasena", "ES3202251066101426879135", "user2@gmail.com");
}

async function insertTransactionData(){
    await transaction.insertTransactionValues("OUTFLOW", 1000, 2);
    await transaction.insertTransactionValues("INFLOW", 100000, 1);
    await transaction.insertTransactionValues("OUTFLOW", 50000, 1);
    await transaction.insertTransactionValues("INFLOW", 20000, 2);
    await transaction.insertTransactionValues("OUTFLOW", 10000, 2);
    await transaction.insertTransactionValues("INFLOW", 20000, 2);
    await transaction.insertTransactionValues("INFLOW", 100000, 3);
    await transaction.insertTransactionValues("OUTFLOW", 1000000, 1);
    await transaction.insertTransactionValues("OUTFLOW", 50, 1);
}

async function insertStockData(){
    await stock.insertStockValues("IBM", "SHARES", "International Business Machines", 181.57, 20);
    await stock.insertStockValues("BTC", "CRYPTOS", "Bitcoin", 61685.45000000, 1);
}

async function updatePortfolioVisibility(){
    await portfolio.updatePortfolioVisibility(1);
    await portfolio.updatePortfolioVisibility(2);
    await portfolio.updatePortfolioVisibility(3);
}
async function updatePortfolioName(){
    await portfolio.updatePortfolioName(4, "HOLA");
}
async function updatePortfolioStock(){
    await portfolio.updatePortfolioAddStock(3);
    await portfolio.updatePortfolioAddStock(5);
    await portfolio.updatePortfolioAddStock(2);
    await portfolio.updatePortfolioAddStock(3);
    await portfolio.updatePortfolioDeleteStock(3);
    await portfolio.updatePortfolioDeleteStock(1);
}
async function insertLikeData(){
    await like.insertLikeValues("BTC", 2);
    await like.insertLikeValues("BTC", 1);
    await like.insertLikeValues("IBM", 1);
    await like.insertLikeValues("IBM", 3);
    await like.insertLikeValues("BTC", 4);
    await like.deleteLikeValues("BTC", 1);
}
async function insertOperationData(){
    await operation.insertOperationValues('BUY', 1, 'TSLA', 2);
    await operation.insertOperationValues('BUY', 1, 'BTC', 1);
    await operation.insertOperationValues('BUY', 2, 'ADA', 2);
    await operation.insertOperationValues('BUY', 1, 'ALUMINUM', 2);
    await operation.insertOperationValues('BUY', 1, 'IBM', 2);
}

async function loadStocksFromAPI(){
    const commodities = ["WTI", "BRENT", "NATURAL_GAS", "COPPER", "ALUMINUM", "WHEAT", "CORN", "COTTON", "SUGAR", "COFFEE"];
    for(let commodity in commodities){
        stock.createOrUpdateStockFromAPI(commodities[commodity], "COMMODITIES");
    }
    const cryptos = ["BTC", "ETH", "USDT", "SOL", "XRP", "DOGE", "ADA", "SHIB", "AVAX", "DOT", "MATIC", "LTC"];
    for(let crypto in cryptos){
        stock.createOrUpdateStockFromAPI(cryptos[crypto], "CRYPTOS");
    }
    const shares = ["IBM", "NVDA", "BBVA", "TSLA", "NKE", "INTC", "MSFT", "DIS", "KO", "MCD", "MMM", "AAPL"];
    for(let share in shares){
        stock.createOrUpdateStockFromAPI(shares[share], "SHARES");
    }
}

async function loadStocksFromJSON() {
    try {
        const filePath = './routes/api_local/data/';
        const commoditiesJSON = 'commodities.json';
        const cryptosJSON = 'commodities.json';
        const sharesJSON = 'shares.json';
        const commoditiesData = JSON.parse(fs.readFileSync(path.join(__dirname, filePath, commoditiesJSON)));
        const cryptosData = JSON.parse(fs.readFileSync(path.join(__dirname, filePath, cryptosJSON)));
        const sharesData = JSON.parse(fs.readFileSync(path.join(__dirname, filePath, sharesJSON)));

        if(commoditiesData != null){
            commoditiesData.forEach(item => {
                const ticket = item.ticket;
                stock.createOrUpdateStockFromAPI(ticket, 'COMMODITIES');
            });
        }
        if(cryptosData != null) {
            cryptosData.forEach(item => {
                const ticket = item.ticket;
                if(item.time == "daily"){
                    stock.createOrUpdateStockFromAPI(ticket, 'CRYPTOS');
                }
            });
        }
        if(sharesData != null){
            sharesData.forEach(item => {
                const ticket = item.ticket;
                if(item.time == "1min") {
                    stock.createOrUpdateStockFromAPI(ticket, 'SHARES');
                }
            });
        }
        console.log('Datos cargados desde archivos JSON correctamente.');
    } catch (error) {
        console.error('Error al cargar datos desde archivos JSON:', error);
    }
}

module.exports = {
    createTables: createTables,
    insertAllData: insertAllData,
    insertUserData: insertUserData,
    insertTransactionData: insertTransactionData,
    insertStockData: insertStockData,
    updatePortfolioVisibility: updatePortfolioVisibility,
    updatePortfolioName: updatePortfolioName,
    updatePortfolioStock: updatePortfolioStock,
    insertLikeData: insertLikeData,
    insertOperationData: insertOperationData,
    loadStocksFromAPI: loadStocksFromAPI,
    loadStocksFromJSON: loadStocksFromJSON,
}