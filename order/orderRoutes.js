const express = require("express");
const router = express.Router();
const orderController = require("../controller/ordercontroller");
const { protect, admin } = require("../auth");

// Route to get user's orders
router.get("/my-orders", protect, ordercontroller.getUserOrders);

// Route to get all orders (Admin only)
router.get("/all-orders", protect, admin, ordercontroller.getAllOrders);

// Route to create a new order
router.post("/checkout", protect, ordercontroller.createOrder);

module.exports = router;
