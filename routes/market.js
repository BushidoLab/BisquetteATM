var express = require('express');
var indexRouter = express.Router();

// TEMPORARY GLOBAL VARIABLES
const axios = require("axios");
const buyerURL = "https://2803b4d8.ngrok.io/api/v1";
const sellerURL = "http://77e9da6d.ngrok.io/api/v1";
const buyerId = "40a5ea3a-92b2-4868-a052-33d0662fe661";
const sellerId = "b479d87c-5a0d-4a07-8c0f-d46302ecb954";
const offerId = "49e2d00e-d9d9-42c3-b913-07bebc1d864a";
const sourceAddress = "mkihmZv7bbT7hKWV5WjnYhUxdg6xnPK1GD";
const targetAddress = "2N3w3jPyCqM5q3FC4pgeRSnLFYaWAvgLHdb";

const Order = require("../models/order");

async function createSellOrder(sellerURL, saleAmount) {
    try {
        let id = await getAccountId(sellerURL).toString();
        console.log(id)
        const body = {
            marketPair: "BTC_USD",
            percentageFromMarketPrice: 0.05,
            priceType: "PERCENTAGE",
            amount: saleAmount,
            minAmount: saleAmount,
            direction: "SELL",
            accountId: sellerId,
        }
        let result = await axios.post(`${sellerURL}/offers`, body);
        return result;
        // console.log(result.data);
    } catch(err) {
        console.log(err);
    }
  };
  
  
  async function getAccountId(url) {
    try {
        let result = await axios.get(`${url}/payment-accounts`);
        let accounts = result.data.paymentAccounts;
        let accountId = accounts[accounts.length - 1].id;
        return accountId;
    } catch(err) {
        console.log(err);
    }
  };
  
  async function matchOffer(url, amount) {
    try {
        let response = await axios.get(`${url}/offers`);
        let offer = response.data.offers[response.data.offers.length - 1];
        console.log(offer.id)
        // let offers = response.data.offers;
        // let offerPrices = offers.map(offer => {
        //     let obj = {}
        //     obj.amount = offer.amount,
        //     obj.id = offer.id
        //     return obj;
        // });
  
        // let matched = false;
        // let counter = 0;
        // while (!matched) {
        //     if (offerPrices[counter].amount = amount) {
        //         console.log(offerPrices[counter].id);
        //         createBuyOrder(url, amount, offerPrices[counter].id);
        //         matched = true;
        //     }  else if (offerPrices[counter].amount >= amount) {
        //         createBuyOrder(url, amount, offerPrices[counter].id);
        //         matched = true;
        //     } else {
        //         counter++;
        //     }
        // }
        createBuyOrder(url, amount, offer.id);
    } catch(err) {
        console.log("matchOffer() error: ", err);
    }
  };
  
  async function createBuyOrder(url, amount, offerId) {
    try {
        const body = {
            paymentAccountId: buyerId,
            amount: amount
        }
        let result = await axios.post(`${url}/offers/${offerId}/take`, body);
        return result;
    } catch(err) {
        // console.log("ERROR ITS THIS ONE : ", err);
    }
  };

  module.exports = markets;
