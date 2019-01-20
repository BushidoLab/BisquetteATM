const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const orderSchema = new Schema({
    orderType: {type: String, enum: ["Buy", "Sell"]},
    marketOrder: {type: Object},
    sellOrderId: {type: String},
    purchaseAmount:  { type: Number},
    recipientAddress: {type: String},
    uniqueBarcode: {type: String},
    orderStatus: {type: Boolean},
    secretCode: {type: String}
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;