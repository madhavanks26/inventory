//mysql databse details to connect with mysql node package
const mysql = require('mysql');
var con = mysql.createConnection({
   host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS
});
//connection to create table 
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  var goodsTableSQL = "CREATE TABLE if not exists goods(goodsId VARCHAR(255),goodsName VARCHAR(255),goodsBrand VARCHAR(255),goodsSize VARCHAR(255),goodsDesc VARCHAR(255),goodsUnitOfMeasurement VARCHAR(255),availableStock VARCHAR(255),qtySold VARCHAR(255),goodsStatus VARCHAR(255), PRIMARY KEY (goodsId))";
  con.query(goodsTableSQL, function (err, result) {
    if (err) throw err;
    console.log("goods Table created");
  });
  var stockTableSQL = "CREATE TABLE if not exists stock(stockId VARCHAR(255),goodsId VARCHAR(255),billNo VARCHAR(255),purchaseDateTime VARCHAR(255),goodsActualPrice VARCHAR(255),goodsSellingPrice VARCHAR(255),stockCount VARCHAR(255),stockStatus VARCHAR(255),stockUtilized VARCHAR(255),PRIMARY KEY (stockId),FOREIGN KEY(goodsId) REFERENCES goods(goodsId))";
  con.query(stockTableSQL, function (err, result) {
    if (err) throw err;
    console.log("stock table created");
  });
  var salesTableSQL = "CREATE TABLE if not exists sales(billno VARCHAR(255),salesId VARCHAR(255),goodsId VARCHAR(255),buyerName VARCHAR(255),salesDate VARCHAR(255),salesPrice VARCHAR(255),salesQuantity VARCHAR(255),salesAmount VARCHAR(255),profitAmount VARCHAR(255),salesTotalAmout VARCHAR(255),salesStatus VARCHAR(255),PRIMARY KEY (salesId),FOREIGN KEY(goodsId) REFERENCES goods(goodsId))";
  con.query(salesTableSQL, function (err, result) {
    if (err) throw err;
    console.log("sales table created");
  });
});  
module.exports=con;
