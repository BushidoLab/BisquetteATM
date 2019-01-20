var express = require('express');
var indexRouter = express.Router();

// TEMPORARY GLOBAL VARIABLES
const axios = require("axios");
// const buyerURL = "https://2803b4d8.ngrok.io/api/v1";
// const sellerURL = "http://77e9da6d.ngrok.io/api/v1";
const buyerId = "40a5ea3a-92b2-4868-a052-33d0662fe661";
const sellerId = "b479d87c-5a0d-4a07-8c0f-d46302ecb954";
// const offerId = "49e2d00e-d9d9-42c3-b913-07bebc1d864a";
// const sourceAddress = "mkihmZv7bbT7hKWV5WjnYhUxdg6xnPK1GD";
// const targetAddress = "2N3w3jPyCqM5q3FC4pgeRSnLFYaWAvgLHdb";

const Order = require("../models/order");

var exports = module.exports = {};

exports.createSellOrder = async function (sellerURL, saleAmount) {
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
	} catch (err) {
		console.log(err);
	}
};

exports.getAccountId = async function (url) {
	try {
		let result = await axios.get(`${url}/payment-accounts`);
		let accounts = result.data.paymentAccounts;
		let accountId = accounts[accounts.length - 1].id;
		return accountId;
	} catch (err) {
		console.log(err);
	}
};

exports.matchOffer = async function (url, amount) {
	try {
		let response = await axios.get(`${url}/offers`);
		let offer = response.data.offers[response.data.offers.length - 1];
		console.log(offer.id)
		createBuyOrder(url, amount, offer.id);
	} catch (err) {
		console.log("matchOffer() error: ", err);
	}
};

exports.createBuyOrder = async function (url, amount, offerId) {
	try {
		const body = {
			paymentAccountId: buyerId,
			amount: amount
		}
        let result = await axios.post(`${url}/offers/${offerId}/take`, body);
        console.log(result);
        generateBlock(1);
	} catch (err) {
		console.log("ERROR ITS THIS ONE : ", err);
	}
};

exports.tradePaymentConfirmed = async function (url, offerId) {
	try {
		let result = await axios.post(`${url}/trades/${offerId}/payment-received`);
		console.log(result);
	} catch (err) {
		console.log("ERROR: ", err);
	}
};

exports.paymentStarted = async function (url, offerId) {
	try {
		console.log(`${url}/trades/${offerId}/payment-started`);
		let response = await axios.post(`${url}/trades/${offerId}/payment-started`);
		console.log("paymentstarted response:", response);
	} catch (err) {
		console.log("paymentstarted error: ", err)
	}
}

return module.exports;