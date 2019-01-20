var express = require('express');
var indexRouter = express.Router();

// TEMPORARY GLOBAL VARIABLES
const axios = require("axios");
const buyerURL = "http://6dffe9a5.ngrok.io/api/v1";
const sellerURL = "http://28a089be.ngrok.io/api/v1";
const buyerId = "40a5ea3a-92b2-4868-a052-33d0662fe661";
const sellerId = "b479d87c-5a0d-4a07-8c0f-d46302ecb954";
const offerId = "49e2d00e-d9d9-42c3-b913-07bebc1d864a";
const sourceAddress = "mkihmZv7bbT7hKWV5WjnYhUxdg6xnPK1GD";
const targetAddress = "2N3w3jPyCqM5q3FC4pgeRSnLFYaWAvgLHdb";

const Order = require("../models/order");


/* GET home page. */
indexRouter.get('/', function (req, res, next) {
	res.render('index.ejs', {
		title: 'Express'
	});
});

/* GET withdraw page. */
indexRouter.get('/withdraw', function (req, res, next) {
	res.render('withdraw.ejs', {
		title: 'Express'
	});
});


// const _user = await User.findOne({
//   accountActivationToken: req.params.token
// });

/* POST withdraw page. */
indexRouter.post('/withdraw', function (req, res, next) {

  const allOffers = Order.find()
  .then(() => {
    let withdawingOffer = allOffers[allOffers.length - 1]
    let withdrawal = tradePaymentConfirmed(sellerURL, withdawingOffer.marketOrder.id)
    .then((res, err) => {
    console.log(withdrawal)
    })
  })
  .catch(err => {
      console.log(err);
  })
  res.render('withdraw.ejs', {
    title: 'Express'
  });
});

/* GET sell page. */
indexRouter.get('/sell', function (req, res, next) {
	res.render('sell.ejs', {
		title: 'Express'
	});
});

/* GET buy page. */
indexRouter.get('/buy', function (req, res, next) {
	res.render('buy.ejs', {
		title: 'Express'
	});
});

/* POST buy page. */
indexRouter.post('/buy', function (req, res, next) {
	let purchaseAmount = req.body.purchaseAmount;
	let recipientAddress = req.body.recipientAddress;
	console.log("Amount:", purchaseAmount);
	console.log("Address:", recipientAddress);

	let marketOrder = matchOffer(buyerURL, purchaseAmount)
		.then((res, err) => {
			const newBuyOrder = new Order({
				marketOrder: res.data,
				orderType: "Buy",
				purchaseAmount: purchaseAmount,
				recipientAddress: recipientAddress
			})
			console.log("HERE ==========", newBuyOrder)
			newBuyOrder.save();
		});

	res.render('buy', {
		title: 'Express'
	});
});

/* POST sell page. */

indexRouter.post('/sell', function (req, res, next) {
	let saleAmount = req.body.saleAmount;
	let marketOrder = createSellOrder(sellerURL, saleAmount)
		.then((res, err) => {
			console.log(res.data);
			const newSellOrder = new Order({
				marketOrder: res.data,
				orderType: "Sell",
				purchaseAmount: saleAmount,
				// recipientAddress: recipientAddress
			})
			newSellOrder.save();
			if (err) {
				console.log("Error:", err)
			}
		})
	res.render('index', {
		title: 'Express'
	});
	// console.log(marketOrder.data.id)
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
		return result;
	} catch (err) {
		console.log(err);
	}
};


async function getAccountId(url) {
	try {
		let result = await axios.get(`${url}/payment-accounts`);
		let accounts = result.data.paymentAccounts;
		let accountId = accounts[accounts.length - 1].id;
		return accountId;
	} catch (err) {
		console.log(err);
	}
};

async function matchOffer(url, amount) {
	try {
		let response = await axios.get(`${url}/offers`);
		let offer = response.data.offers[response.data.offers.length - 1];
		console.log(offer.id)
		createBuyOrder(url, amount, offer.id);
	} catch (err) {
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
        // Mine block first
        const payload = {
            method: "generate",
            "params":[
              1
            ],
            auth: {
                username: "wefgiwebfg23br",
                password: "efwioun23ourb"
            }
        };
        let blockResponse = await axios.post("localhost:18443", payload);
        console.log("Blockresponse: ",blockResponse);
		await axios.post(`${url}/trades/${offerId}/payment-started`);
		return result;
	} catch (err) {
		console.log("ERROR ITS THIS ONE : ", err);
	}
};

async function tradePaymentConfirmed(url, offerId) {
  try {
      let result = await axios.post(`${url}/trades/${offerId}/payment-received`);
      console.log(result);
  } catch(err) {
      console.log("ERROR: ", err);
  } 
};


module.exports = indexRouter;