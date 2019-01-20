var express = require('express');
var indexRouter = express.Router();
var http = require("http");


// TEMPORARY GLOBAL VARIABLES
const axios = require("axios");
const buyerURL = "http://6dffe9a5.ngrok.io/api/v1";
const sellerURL = "http://28a089be.ngrok.io/api/v1";
const buyerId = "52521b91-9ca5-4013-a4ad-5b04d4bf54e8";
const sellerId = "9ab0fddd-fa1d-4105-bf9f-1f3a80a359ec";
const offerId = "49e2d00e-d9d9-42c3-b913-07bebc1d864a";
const sourceAddress = "mkihmZv7bbT7hKWV5WjnYhUxdg6xnPK1GD";
const targetAddress = "2N3w3jPyCqM5q3FC4pgeRSnLFYaWAvgLHdb";

const Order = require("../models/order");

// var market = require("./market.js");
// var createSellOrder = market.createSellOrder();
// var createSellOrder = market.createSellOrder();
// var getAccountId = market.getAccountId();
// var matchOffer = market.matchOffer();
// var createBuyOrder = market.createBuyOrder();
// var tradePaymentConfirmed = market.tradePaymentConfirmed();
// var paymentStarted = market.paymentStarted();


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
	let purchaseAmount = req.body.purchaseAmount * 100000000;
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
		console.log("Time1")
		// console.log(result);
		
		// RUN FIRST
		// wait 10 seconds then mine block
		setTimeout(async function(){
			generateBlock(1);
		}, 10000);

		// RUN SECOND
		// wait ten seconds and then pa		;
		setTimeout(async function(){
			paymentStarted(url, offerId);
		}, 20000);

	} catch (err) {
		console.log("ERROR ITS THIS ONE : ", err);
	}
};

async function tradePaymentConfirmed(url, offerId) {
  try {
      let result = axios.post(`${url}/trades/${offerId}/payment-received`);
      console.log(result);
  } catch(err) {
      console.log("ERROR: ", err);
  } 
};



async function generateBlock(blocksToGenerate){
  
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
      method: 'generate',
      params: [1]
  }));
  req.end();
}

async function paymentStarted(url, offerId) {
    try {
        console.log(`${url}/trades/${offerId}/payment-started`);
        let response = await axios.post(`${url}/trades/${offerId}/payment-started`);
        console.log("paymentstarted response:", response);
    } catch(err) {
        console.log("paymentstarted error: ", err)
    }
}








module.exports = indexRouter;