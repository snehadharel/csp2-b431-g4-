// [SECTION] Dependencies and Modules
const express = require("express");
const userController = require("../controllers/userController");
const { protect } = require("../authGuard");
const { admin } = require("../authGuard");

// [SECTION] Routing Component
const router = express.Router();

// [SECTION] Route for user registration
router.post("/register", userController.registerUser);

// [SECTION] Route for user authentication
router.post("/login", userController.loginUser);

// [SECTION] Route for retrieving user profile
router.get("/details", protect, userController.getUserProfile);

// [SECTION] Route for updating user to admin
router.patch(
  "/:id/set-as-admin",
  protect,
  admin,
  userController.updateUserAsAdmin
);

// [SECTION] Route for updating user password
router.patch("/update-password", protect, userController.updateUserPassword);

// [SECTION] Export Route System

module.exports = router;

module.exports = router;

