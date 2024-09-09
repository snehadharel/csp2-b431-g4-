const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productsOrdered: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
      subtotal: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  orderedOn: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" },
});
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;