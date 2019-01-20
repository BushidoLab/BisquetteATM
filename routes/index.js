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


/* GET home page. */
indexRouter.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'Express' });
});

/* GET sell page. */
indexRouter.get('/sell', function(req, res, next) {
  res.render('sell.ejs', { title: 'Express' });
});

/* GET buy page. */
indexRouter.get('/buy', function(req, res, next) {
  res.render('buy.ejs', { title: 'Express' });
});


/* POST sell page. */

indexRouter.post('/sell', function(req, res, next) {
  let saleAmount = req.body.saleAmount;
  createSellOrder(sellerURL, saleAmount)
  res.render('index', { title: 'Express' });
});

/* POST buy page. */

indexRouter.post('/buy', function(req, res, next) {
  let purchaseAmount = req.body.purchaseAmount;
  let recipientAddress = req.body.recipientAddress;
  console.log("Amount:", purchaseAmount);
  console.log("Address:", recipientAddress);
  res.render('buy', { title: 'Express' });
});


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
      console.log(result.data);
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
}

module.exports = indexRouter;
