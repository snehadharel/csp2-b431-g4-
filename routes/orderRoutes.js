
orderRoutes.js

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect, admin } = require("../authGuard");

// Route to get user's orders
router.get("/my-orders", protect, orderController.getUserOrders);

// Route to get all orders (Admin only)
router.get("/all-orders", protect, admin, orderController.getAllOrders);

// Route to create a new order
router.post("/checkout", protect, orderController.createOrder);

module.exports = router;

