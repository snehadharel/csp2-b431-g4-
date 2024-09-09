const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

// @desc    Create a new order
// @route   POST /orders/checkout
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "cartItems.productId"
    );

    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ error: "No Items to Checkout" });
    }

    const order = new Order({
      userId: req.user._id,
      productsOrdered : cart.cartItems,
      totalPrice: cart.totalPrice,
    });

    await order.save();

    // Clear the cart after placing an order
    cart.cartItems = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({ message: "Ordered Successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to place order", error: error.message });
  }
});

// @desc    Get user's orders
// @route   GET /orders/my-orders
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve orders", error: error.message });
  }
});

// @desc    Get all orders (Admin only)
// @route   GET /orders/all-orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Action forbidden" });
  }

  try {
    const orders = await Order.find().populate(
      "userId",
      "firstName lastName email"
    );

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve orders", error: error.message });
  }
});


module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders
};
