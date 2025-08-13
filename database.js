//mysql databse details to connect with mysql node package
import { DB_HOST, DB_USER, DB_DATABASE, DB_PASS, PORT } from "./config/envConfig.js";
import mysql from "mysql";
//const mysql = require('mysql');
var con = mysql.createConnection({
   host: DB_HOST,
  user: DB_USER,
  database: DB_DATABASE,
  password: DB_PASS
  //password: process.env.DB_PASS
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
export default con;
