var express = require('express');
var indexRouter = express.Router();
var http = require("http");


// TEMPORARY GLOBAL VARIABLES
const axios = require("axios");
const buyerURL = "http://c33a1f61.ngrok.io/api/v1";
const sellerURL = "http://b7872068.ngrok.io/api/v1";
const buyerId = "52521b91-9ca5-4013-a4ad-5b04d4bf54e8";
const sellerId = "9ab0fddd-fa1d-4105-bf9f-1f3a80a359ec";
const offerId = "49e2d00e-d9d9-42c3-b913-07bebc1d864a";
const sourceAddress = "mkihmZv7bbT7hKWV5WjnYhUxdg6xnPK1GD";
const targetAddress = "2N3w3jPyCqM5q3FC4pgeRSnLFYaWAvgLHdb";



const Order = require("../models/order");


async function retrieveAddresses(url) {
    try {
        let result = await axios.get(`${url}/wallet/addresses`);
        result = result.data.walletAddresses;

        let addresses = result.map(address => {
            if (address.context == "TRADE_PAYOUT" && address.balance > 0 ){
                // console.log(address)
                return address.offerId
            }
        
            // console.log(address)
        })

        // FIND CORRESPONDING OFFERID IN MONGODB
        // let orders = Order.find({}, (res, err) => {
        //     console.log("Here's the order list", res)
        //     console.log("Here's the order list ERROR", err)
        // });

        // console.log("Here are all of the orders", orders)
        // return addresses;
    } catch(err){
        console.log(err)
    }
    //     addresses.forEach(address => {
    //         // if (address.balance > 0 && address.offerId && address.context != "RESERVED_FOR_TRADE"){
    //         if (address.balance > 0 && address.context == "TRADE_PAYOUT"){
    //             console.log(address)
                
    //             Order.findOne({
    //                 sellOrderId: address.offerId
    //             }).then((res,err) => {
    //                 console.log(res)
    //             }).catch((err) => {
    //                 console.log(err)
    //             })
    //             withdrawFunds(buyerUrl, address.address, targetAddreess, amount)
    //         }
    //     });
    // } catch(err){
    //     console.log(err)
    // }
}

function showAllOrders(){
    // FIND CORRESPONDING OFFERID IN MONGODB
    Order.findOne({
        "sellOrderId": "QHiPQ-d7e2a1a9-fc4b-448e-862d-436dcb282fd2-093"
    })
    .then((res) => {
        console.log("NICKKKK", res)
    })
    // console.log(orders)
}





async function retrieveOrder(sellOrderId) {
    try{
        let order = await Order.findOne({
            sellOrderId
        });
        console.log("I found you bitch", order)
        return order;
    } catch(err){
        console.log("ERROR: ", err);
    }
}

async function retrieveOrders() {
    try{
        let orders = await Order.find();
        console.log("I found you bitch", orders)
        return orders;
    } catch(err){
        console.log("ERROR: ", err);
    }
}

async function withdrawFunds(URL, targetAddress, sourceAddresses, amount) {
    try {
        const DATA = {
            targetAddress: targetAddress,
            sourceAddresses: [
                sourceAddresses
            ],
            amount: amount,
            feeExcluded: true
        }
        let result = await axios.post(`${URL}/wallet/withdraw`, DATA);
        console.log(result)
    } catch(err) {
        console.log("ERROR: ", err);
    }
}

async function sendToAddress(address,amount){
  
	var options = {
      "method": "POST",
      "port": "18443",
      "headers": {
          "Content-Type": "application/json",
          "Authorization": "Basic d2VmZ2l3ZWJmZzIzYnI6ZWZ3aW91bjIzb3VyYg==",
          "cache-control": "no-cache",
          "Postman-Token": "363b3275-ca2a-4e96-9336-d8d4db9f4397"
      }
  };
  
  var req = http.request(options, function (res) {
      var chunks = [];
  
      res.on("data", function (chunk) {
          chunks.push(chunk);
      });
  
      res.on("end", function () {
          var body = Buffer.concat(chunks);
          console.log(body.toString());
      });
  });
  
  req.write(JSON.stringify({
      method: 'sendtoaddress',
      params: [address, amount]
  }));
  req.end();
}



sendToAddress("2MwXmWYiadyCay2JnUP6r5yoKMAChv2J9fq", .01)