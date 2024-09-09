

const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
	userId: {
		type: String
	},
	cartItems: [
		{
			productId: {
				quantity: Number,
				subtotal: Number
			}
		}
	],
	totalPrice: {
		type: Number,
		required: [true, 'totalPrice is required']
	},
	orderedOn: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('cart', cartSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

const cartSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cartItems: [cartItemSchema],
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderedOn: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model('Cart', cartSchema);


module.exports = Cart;

module.exports = Cart;


module.exports = Cart;
