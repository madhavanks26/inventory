//require("dotenv").config();
//var express = require("express");
//var bodyParser = require("body-parser");
//var async = require("async");
//var cors = require("cors");
//const con = require("./database");
import express from "express";
import bodyParser from "body-parser";
import async from "async";
import cors from "cors";
import con from "./database.js";


//util functions
import { goodsDataValidation } from './utils/utils.js';
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();
var corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
//console.log(__dirname);
app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "null");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
// error-handling middleware 04MAR2025 chatgpt suggetion
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Something went wrong! Please try again.",
  });
});
// Add headers
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
/*----------------------------------------------Goods Module Begins-------------------------------------*/
//Module list
//#list goods
//#add goods
//#update goods
//#delete goods

//listGoods
app.get("/listGoods", urlencodedParser, function (req, res) {
  console.log("################");
  console.log("call for list Goods");
  var sql = "CALL getAllGoods()";
  con.query(sql, function (err, result) {
    if (err) res.status(400).send(err);
    res.status(200).send(result);
  });
});
//add goods
app.post("/addGoods", urlencodedParser, async (req, res) => {
  console.log("##################");
  console.log("call for addGoods");
  // addGoods api details below
  // goods table will be inserted with the data recieved
  // goods reference can be done by goodsId
  let dataFlag = Array.isArray(req.body);
  if (req.body && dataFlag) {
    var jsondata = req.body;
    //var goodsData = [];
    var return_data = {};
    // var goodsTableInsertQuery = 'INSERT INTO goods (goodsName,goodsSize,goodsDesc,goodsUnitOfMeasurement,availableStock,qtySold,goodsStatus) VALUES ?';
    // for (var i = 0; i < jsondata.length; i++) {
    //   goodsData.push([jsondata[i].goodsName, jsondata[i].goodsSize, jsondata[i].goodsDesc, jsondata[i].goodsUnitOfMeasurement, jsondata[i].availableStock, jsondata[i].qtySold,'ACTIVE'])
    // }
    async.forEachOf(
      jsondata,
      function (dataElement, keyValue, inner_callback) {
        //console.log(dataElement);
        goodsDataValidation(dataElement);
        var addGoodsProcedure =
          "CALL addGoods(?,?,?,?,?,?,?,?,@addGoodsResult)";
        con.query(
          addGoodsProcedure,
          [
            dataElement["goodsName"],
            dataElement["goodsBrand"],
            dataElement["goodsSize"],
            dataElement["goodsDesc"],
            dataElement["goodsUnitOfMeasurement"],
            dataElement["availableStock"],
            dataElement["qtySold"],
            "ACTIVE",
          ],
          function (addGoodsQueryError, addGoodsQueryResult) {
            //console.log(addGoodsQueryResult);
            if (addGoodsQueryError) {
              console.log("######addGoodsQueryError######");
              console.log(addGoodsQueryError);
              return res.status(500).json({
                success: false,
                error: JSON.stringify(addGoodsQueryError),
              });
            } else {
              con.query(
                "SELECT @addGoodsResult AS addGoodsResultData",
                (err, results) => {
                  if (results[0].addGoodsResultData == "RECORD EXISTS") {
                    res.status(409).json({
                      success: false,
                      message: results[0].addGoodsResultData,
                      data: {},
                    });
                  } else if (
                    results[0].addGoodsResultData == "RECORD INSERTED"
                  ) {
                    res.status(200).json({
                      success: true,
                      message: "Goods added Successfully!",
                      data: {},
                    });
                  } else {
                    if (err) {
                      return res.status(500).json({
                        success: false,
                        error: JSON.stringify(err),
                      });
                    }
                  }
                }
              );
              //console.log("######addGoodsQueryResult######");
              //console.log(addGoodsQueryResult);
            }
          }
        );
      },
      function (err) {
        if (err) {
          //handle the error if the query throws an error
          res.status(400).send(err);
        } else {
          //whatever you wanna do after all the iterations are done
          res.status(200).end(JSON.stringify(return_data));
        }
      }
    );
  } else {
    if (!dataFlag) {
      return res.status(400).json({
        success: false,
        error: "Expected an array of objects",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: "Data Not Available",
      });
    }
  }
});
//update goods
app.post("/updateGood", urlencodedParser, function (req, res) {
  console.log("#################");
  console.log("call for update the goods");
  console.log(req.body);
  var updateGoodsData = req.body;
  if (updateGoodsData.goodsId) {
    var updateGoodsDataBasedOnIdQuery =
      "UPDATE goods SET goodsName = ?, goodsSize = ?,goodsDesc =?,goodsUnitOfMeasurement= ? WHERE goodsId = ?";
    con.query(
      updateGoodsDataBasedOnIdQuery,
      [
        updateGoodsData.goodsName,
        updateGoodsData.goodsSize,
        updateGoodsData.goodsDesc,
        updateGoodsData.goodsUnitOfMeasurement,
        updateGoodsData.goodsId,
      ],
      function (err, result) {
        if (err) res.status(400).send(err);
        res.status(200).end("Goods Updated Sucessfully");
      }
    );
  } else {
    res.statusMessage = "param not available";
    res.status(400).send(JSON.stringify({}));
  }
});
//delete goods
app.post("/deleteGood", urlencodedParser, function (req, res) {
  console.log("################");
  console.log("call for delete the goods");
  if (req.body.goodsId) {
    var goodsIdValue = req.body.goodsId;
    var deleteGoodQuery =
      "UPDATE goods SET goodsStatus='INACTIVE' WHERE goodsId = ?";
    con.query(deleteGoodQuery, [goodsIdValue], function (err, result) {
      console.log(err);
      if (err) {
        res.status(501).send(err);
      } else {
        res.statusMessage = "Deleted Successfully";
        res.status(200).send("Deleted Successfully");
      }
    });
  } else {
    res.statusMessage = "param not available";
    res.status(400).send(JSON.stringify({}));
  }
});
/*-----------------------------------------------Goods Module Ends---------------------------------------*/
/*---------------------------------------------Purchase Module Begins------------------------------------*/
//Module list
//#listPurchase(based on date/duration)
//#addStock
//#editStock(Update purchase/stock details)
//#deleteStock

//listPurchase API
app.get("/listPurchase", urlencodedParser, function (req, res) {
  console.log("#################");
  console.log("call for list purchase");
  //list purchase api details below
  //listing the purchase details for the given duration
  //console.log(req.query);
  if (req.query.startDate && req.query.endDate) {
    var startDateValue = req.query.startDate;
    var endDateValue = req.query.endDate;
    var listPurchaseQuery = "CALL listAllStock()";
    con.query(listPurchaseQuery, function (err, result) {
      //console.log(result);
      if (err) res.status(400).send(err);
      res.status(200).send(result);
    });
  } else {
    res.statusMessage = "param not available";
    res.status(400).send(JSON.stringify({}));
  }
});
//addStock API
app.post("/addStock", urlencodedParser, function (req, res) {
  console.log("##################");
  console.log("call for addStock");
  //addStock api details below
  //once a product is already available in goods table
  //the purchased qty will get added coresponding to the goodsId
  //with a reference of stockId
  if (req.body) {
    var jsonData = req.body;
    var addStockData = [];
    var updateAvailableStock = [];
    for (var i = 0; i < jsonData.length; i++) {
      addStockData.push([
        jsonData[i].goodsId,
        jsonData[i].billNo,
        jsonData[i].purchaseDateTime,
        jsonData[i].goodsActualPrice,
        jsonData[i].goodsSellingPrice,
        jsonData[i].goodsQuantity,
        "ACTIVE",
        "NO",
      ]);
      //updateAvailableStock.push({"idVal":jsonData[i].goodsId,"qty":jsonData[i].goodsQuantity});
    }
    async.forEachOf(
      jsonData,
      function (dataElement, i, inner_callback) {
        var qty = Number(jsonData[i].goodsQuantity);
        var Id = jsonData[i].goodsId;
        var updateAvailableStockQuery = "CALL updateAvailableStock(?,?)";
        con.query(updateAvailableStockQuery, [qty, Id], function (err, result) {
          if (err) {
            inner_callback(err);
          } else {
            inner_callback(null);
          }
        });
      },
      function (err) {
        if (err) {
          //handle the error if the query throws an error
          res.status(400).send(err);
        } else {
          //whatever you wanna do after all the iterations are done
          res.status(200).end(JSON.stringify({}));
        }
      }
    );
    var addStockQuery =
      "INSERT INTO stock (goodsId,billNo,purchaseDateTime,goodsActualPrice,goodsSellingPrice,stockCount,stockStatus,stockUtilized) VALUES ?";
    con.query(addStockQuery, [addStockData], function (err, result) {
      if (err) console.log(err);
      res.status(200);
      res.statusMessage = "added stock";
      res.end("added stock");
    });
  } else {
    res.status(400);
    res.statusMessage = "data not available";
    res.end(JSON.stringify({}));
  }
});
//update Stock table
app.post("/updateStock", urlencodedParser, function (req, res) {
  console.log("#################");
  console.log("call for update Stock");
  // update stock details in stock table
  // if stock count is updated to a new value ,update it to the available stock in goods table
  if (req.body) {
    var updateStockJson = req.body;
    //if stock count is updated,then call for update available stock
    if (updateStockJson.stockCount) {
      var stockCountValue = updateStockJson.stockCount;
      var goodsIdValue = updateStockJson.goodsId;
      var updateAvailableStockQuery = "CALL updateAvailableStock(?,?)";
      con.query(
        updateAvailableStockQuery,
        [stockCountValue, goodsIdValue],
        function (err, result) {
          if (err) console.log(err);
          res.status(200);
          res.statusMessage = "updated goods available stock";
          res.end(JSON.stringify({}));
        }
      );
    }
    // update stock table
    var updateStockQuery =
      "UPDATE stock SET goodsId=?,billNo=?,purchaseDateTime=?,goodsActualPrice=?,goodsSellingPrice=?,stockCount=? WHERE stockId=?";
    con.query(
      updateStockQuery,
      [
        updateStockJson.goodsId,
        updateStockJson.billNo,
        updateStockJson.purchaseDateTime,
        updateStockJson.goodsActualPrice,
        updateStockJson.goodsSellingPrice,
        updateStockJson.stockCount,
        updateStockJson.stockId,
      ],
      function (err, result) {
        if (err) console.log(err);
        res.status(200);
        res.statusMessage = "Stock details updated";
        res.end("Stock details updated");
      }
    );
  } else {
    res.status(400);
    res.statusMessage = "data not available";
    res.end(JSON.stringify({}));
  }
});
//delete stock api
app.post("/deleteStock", urlencodedParser, function (req, res) {
  console.log("#################");
  console.log("call for delete stock");
  //delete the purchased item from stock table against stockId
  //#possiblities to delete
  //check if availableStock from goods table is less than the stockCount of stock table
  if (req.body) {
    var stockIdValue = req.body.stockId;
    console.log(stockIdValue);
    var reduceStockProcedureQuery = "CALL reduceAvailableStock(?)";
    con.query(
      reduceStockProcedureQuery,
      [stockIdValue],
      function (err, result) {
        if (err) console.log(err);
        res.status(200);
        res.statusMessage = "Available Stock updated";
        res.end("reduced available stock from goods table");
      }
    );
    var deleteStockQuery =
      "UPDATE stock SET stockStatus='INACTIVE' WHERE stockId=?";
    con.query(deleteStockQuery, [stockIdValue], function (err, result) {
      if (err) console.log(err);
      res.status(200);
      res.statusMessage = "Stock Deleted";
      res.end("delted the purchased item from the stock table");
    });
  } else {
    res.status(400);
    res.statusMessage = "data not available";
    res.end(JSON.stringify({}));
  }
});
/*----------------------------------------------Purchase Module Ends-------------------------------------*/
/*----------------------------------------------Sales Module Begins-------------------------------------*/
//Module Activity list
//#listAllSales for the duration
//#addSales + udpateAvailableStock
//#updateSales + updateAvailableStock
//#delete Sales
app.get("/listAllSales", urlencodedParser, function (req, res) {
  console.log("#################");
  console.log("call for list Sales");
  // list the sales happened for the selected duration

  if (req.query.startDate && req.query.endDate) {
    var startDateValue = req.query.startDate;
    var endDateValue = req.query.endDate;
    var listSalesProcedureQuery = "CALL listAllSales(?,?)";
    con.query(
      listSalesProcedureQuery,
      [startDateValue, endDateValue],
      function (err, result) {
        //console.log(result);
        if (err) res.status(400).send(err);
        res.status(200).send(result);
      }
    );
  } else {
    res.statusMessage = "param not available";
    res.status(400).send(JSON.stringify({}));
  }
});
//add sales;
app.post("/addSales", urlencodedParser, function (req, res) {
  console.log("##################");
  console.log("call for add sales");
  // add sales api details below
  // on sale of the particular product
  // 2 task on this API
  // ####### TASK 1
  // insert the sales details in the sales table
  // ####### TASK 2
  // we have qtySold
  // 1)Formula Available Stock = Available Stock - qtySold
  // update the Available Stock in the goods table
  // 2)Formula Quantity Sold = Quantity Sold + qtySold
  // ######## TASK 3
  // STOCK UTLIZED ACTIVITY ON ALL THE ITEMS OF THE SALE
  //UPDATE STOCK UTLIZED COL IN STOCK TABLE
  if (req.body) {
    var jsonData = req.body;
    var addSalesData = [];
    for (var i = 0; i < jsonData.length; i++) {
      addSalesData.push([
        jsonData[i].billNo,
        jsonData[i].goodsId,
        jsonData[i].buyerName,
        jsonData[i].salesDate,
        jsonData[i].salesPrice,
        jsonData[i].salesQuantity,
        jsonData[i].salesAmount,
        jsonData[i].profitAmount,
        "ACTIVE",
      ]);
    }
    async.forEachOf(
      jsonData,
      function (dataElement, i, inner_callback) {
        var qty = Number(jsonData[i].salesQuantity);
        var Id = jsonData[i].goodsId;
        var updateAvailableStocknSalesQuery =
          "CALL updateAvailableStocknSales(?,?)";
        con.query(
          updateAvailableStocknSalesQuery,
          [qty, Id],
          function (err, result) {
            if (err) {
              inner_callback(err);
            } else {
              inner_callback(null);
            }
          }
        );
      },
      function (err) {
        if (err) {
          //handle the error if the query throws an error
          res.status(400).send(err);
        } else {
          //whatever you wanna do after all the iterations are done
          res.status(200).end(JSON.stringify({}));
        }
      }
    );
    async.forEachOf(
      jsonData,
      function (dataElement, i, inner_callback) {
        var qty = Number(jsonData[i].salesQuantity);
        var Id = jsonData[i].goodsId;
        var updateStockUtlizedOnSaleQuery =
          "CALL updateStockUtilizedOnSale(?,?)";
        con.query(
          updateStockUtlizedOnSaleQuery,
          [qty, Id],
          function (err, result) {
            if (err) {
              inner_callback(err);
            } else {
              inner_callback(null);
            }
          }
        );
      },
      function (err) {
        if (err) {
          //handle the error if the query throws an error
          res.status(400).send(err);
        } else {
          //whatever you wanna do after all the iterations are done
          res.status(200).end(JSON.stringify({}));
        }
      }
    );
    // add sales
    var addSalesQuery =
      "INSERT INTO sales (billNo,goodsId,buyerName,salesDate,salesPrice,salesQuantity,salesAmount,profitAmount,salesStatus) VALUES ?";
    con.query(addSalesQuery, [addSalesData], function (err, result) {
      if (err) console.log(err);
      res.status(200);
      res.statusMessage = "added sales";
      res.end("added sales");
    });
  } else {
    res.status(400);
    res.statusMessage = "data not available";
    res.end(JSON.stringify({}));
  }
});
//updateSale
app.post("/updateSale", urlencodedParser, function (req, res) {
  console.log("###############");
  console.log("call for update sales");
  //on update of sale
  //update sale table
  //update availablestock and qtysold in goods table
  if (req.body) {
    //for goods table update needed goodsId and salesQuantity
    var goodsIdValue = req.body.goodsId;
    var salesQuantity = req.body.salesQuantity;
    var updateAvailableStockonSalesUpdateQuery =
      "CALL updateAvailableStockonSalesUpdate(?,?)";
    con.query(
      updateAvailableStockonSalesUpdateQuery,
      [goodsIdValue, salesQuantity],
      function (err, result) {
        if (err) console.log(err);
        res.status(200);
        res.statusMessage = "updated sales";
        res.end("updated available stock and qtysold");
      }
    );
    var updateAvailableStockonSalesUpdateQuery =
      "CALL updateStockUtilizedOnUpdateSale(?,?)";
    con.query(
      updateAvailableStockonSalesUpdateQuery,
      [salesQuantity, goodsIdValue],
      function (err, result) {
        if (err) console.log(err);
        res.status(200);
        res.statusMessage = "updated stock utilized";
        res.end("updated stock utilized");
      }
    );
    var updateSaleQuery =
      "UPDATE sales SET salesDate=?,salesPrice=?,salesQuantity=?,salesAmount=?,profitAmount=?,salesTotalAmout=? WHERE salesId=?";
    con.query(
      updateSaleQuery,
      [
        req.body.salesDate,
        req.body.salesPrice,
        req.body.salesQuantity,
        req.body.salesAmount,
        req.body.profitAmount,
        req.body.salesTotalAmout,
        req.body.salesId,
      ],
      function (err, result) {
        if (err) console.log(err);
        res.status(200);
        res.statusMessage = "updated sales";
        res.end("updated sales");
      }
    );
  } else {
    res.status(400);
    res.statusMessage = "data not available";
    res.end(JSON.stringify({}));
  }
});
//delete sale
app.post("/deleteSale", urlencodedParser, function (req, res) {
  console.log("###############");
  console.log("call for delete sale");
  var goodsIdValue = req.body.goodsId;
  var salesQuantity = req.body.salesQuantity;
  var updateAvailableStockonSalesUpdateQuery =
    "CALL updateAvailableStockonSalesUpdate(?,?)";
  con.query(
    updateAvailableStockonSalesUpdateQuery,
    [goodsIdValue, salesQuantity],
    function (err, result) {
      if (err) console.log(err);
      res.status(200);
      res.statusMessage = "updated sales";
      res.end("updated available stock and qtysold");
    }
  );
  var deleteSaleQuery =
    "UPDATE sales SET salesStatus='INACTIVE' where salesId='?'";
  con.query(deleteSaleQuery, [req.body.salesId], function (err, result) {
    if (err) console.log(err);
    res.status(200);
    res.statusMessage = "Deactivated Sales";
    res.end("Deleted Sales");
  });
});
/*----------------------------------------------Sales Module Ends---------------------------------------*/

app.get("/listProfit", urlencodedParser, function (req, res) {
  console.log("###############");
  console.log("call for listProfit");
  //this api has 2 feature
  // # list all the goods with profit for a given duration
  // # gets the profit detail for the given goodsId and duration
  //select goods.goodsId,goods.goodsName,goods.goodsSize,sum(sales.profitAmount) from sales,goods where goods.goodsId='JEYAM_0' and sales.salesDate between 1559559476 and 1559559476 group by goods.goodsId,goods.goodsName,goods.goodsSize;
  //select goods.goodsId,goods.goodsName,goods.goodsSize,sum(sales.profitAmount) from sales,goods where sales.salesDate between 1559559476 and 1559559476 group by goods.goodsId,goods.goodsName,goods.goodsSize;
  if (req.query.goodsId && req.query.startDate && req.query.endDate) {
  }
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
