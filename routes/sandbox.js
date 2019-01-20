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
            console.log(address)
        })
        return addresses.;
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

const masterTargetAddress = "2N5dgXbVwUoFZkbceyRun99UaErvbMY6cXV"

// retrieveAddresses(sellerURL)

withdrawFunds(sellerURL, masterTargetAddress, retrieveAddresses(sellerURL), 10000)
withdrawFunds(buyerURL, masterTargetAddress, retrieveAddresses(buyerURL), 10000)


// withdrawFunds(sellerURL, "mjSKp7AFQVNBxTKnpL9YDFUnbC1dtDtdfc", "2N5dgXbVwUoFZkbceyRun99UaErvbMY6cXV", 300000)
// withdrawFunds(sellerURL, "mjSKp7AFQVNBxTKnpL9YDFUnbC1dtDtdfc", retrieveAddresses(buyerURL), 10000)
