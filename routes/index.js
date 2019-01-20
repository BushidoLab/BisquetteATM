var express = require('express');
var indexRouter = express.Router();
var http = require("http");
// const fs = require('fs');
// const qrcode = require('qrcode');



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
	// const qr = await qrcode.toDataURL('http://asyncawait.net');
	res.render('index.ejs', {
		title: 'Express'
	});
});

/* GET withdraw page. */
indexRouter.get('/withdraw', function (req, res, next) {
	res.render('congrats.ejs', {
		title: 'Express'
	});
});


// const _user = await User.findOne({
//   accountActivationToken: req.params.token
// });

/* POST withdraw page. */
indexRouter.post('/withdraw', function (req, res, next) {

	Order.findOne({
		secretCode: req.body.codeInput
	})
	.then((res)=>{
		if (res.orderCompleted === false){
			// res[0].orderCompleted = true;
			// let withdrawal = tradePaymentConfirmed(sellerURL, res[0].sellOrderId);
			tradePaymentConfirmed(sellerURL, res.sellOrderId, UpdateOrder());
			dispenseCash("50")
		}
	})

	function UpdateOrder(){
		Order.findOneAndUpdate({
			secretCode: req.body.codeInput
		},{
			$set: {orderCompleted: true}
		}, {}, (err, doc) => {
			console.log("ERROR:", err);
		})
	}

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

indexRouter.get('/congrats', function (req, res, next) {
	res.render('congrats.ejs', {
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

	matchOffer(buyerURL, purchaseAmount, (secretCode, sellOrderId) => {
		Order.create({
			marketOrder: res.data,
			sellOrderId,
			secretCode,
			orderType: "Buy",
			purchaseAmount, 
			recipientAddress,
		})
	})

	res.render('buy', {
		title: 'Express'
	});
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

async function matchOffer(url, amount, cb) {
	try {
		let response = await axios.get(`${url}/offers`);
		// let offer = response.data.offers[response.data.offers.length - 1];
		let offer = response.data.offers[0];
		console.log(offer.id)
		createBuyOrder(url, amount, offer.id, cb);
	} catch (err) {
		console.log("matchOffer() error: ", err);
	}
};

async function createBuyOrder(url, amount, offerId, cb) {
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
			let randomCode = generateCode();
			sendSMS(randomCode, offerId, cb);
			// let marketOrder = Order.create({
			// 	sellOrderId: offerId,
			// 	secretCode: randomCode
			// });
			// cb(offerId, randomCode);
			console.log(marketOrder);
			// marketOrder.secretCode = randomCode;
			// marketOrder.save();
		}, 20000);

		



	} catch (err) {
		console.log("ERROR ITS THIS ONE : ", err);
	}
};

async function tradePaymentConfirmed(url, offerId) {
  try {
      let result = await axios.post(`${url}/trades/${offerId}/payment-received`);
      console.log("dabnsfjgjahdfbghjbsdrfhjkgbhlajdsfbghadsf", result);
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


// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
const accountSid = 'AC37e2bbe3d86eda5fbcd255a107906902';
const authToken = '2d8a2c63ca8fd59d4dcef25749a0f6e1';
const client = require('twilio')(accountSid, authToken);


indexRouter.post('/text', function (req, res, next) {
	sendSMS();
	res.render('index.ejs', {
		title: 'Express'
	});
});

function sendSMS(code, offerId, cb){
	client.messages
	.create({
		body: code,
		from: '+17542191499',
		to: '+13057648836'
	})
	.then(message => {
		console.log(message.sid);
		cb(code, offerId);
	})
	.done();
}

function generateCode(){
	let code = Math.random().toString().substring(2,6);
	return code;
}

/* POST sell page. */

indexRouter.post('/sell', function (req, res, next) {
	let saleAmount = req.body.saleAmount;
	createSellOrder(sellerURL, saleAmount)
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

function dispenseCash(amount){
	console.log("==================")
	console.log("Here's the cash", amount)
	console.log("==================")
}



async function withdrawFunds(buyerUrl, sellerAddress, buyerAddress, amount) {
    try {
        const withdrawFundsFrom = {
            sourceAddresses: [
                sellerAddress
            ],
            targetAddress: buyerAddress,
            amount: amount,
            feeExcluded: true
        }
        let result = await axios.post(`${buyerUrl}/wallet/withdraw`, withdrawFundsFrom);
        console.log(result)
    } catch(err) {
        // console.log("ERROR: ", err);
    }
}

async function retrieveAddresses(url) {
    try {
        let result = await axios.get(`${url}/wallet/addresses`);
        result = result.data.walletAddresses;

        let addresses = result.map(address => {
            return address;
        })

        addresses.forEach(address => {
            if (address.context === "RESERVED_FOR_TRADE") {
                withdrawFunds("http://28a089be.ngrok.io/api/v1", address.address, buyerAddress, 1000000)
                console.log(address.address)
            }
        });
    } catch(err) {
        console.log("ERROR: ", err);
    }
}










module.exports = indexRouter;