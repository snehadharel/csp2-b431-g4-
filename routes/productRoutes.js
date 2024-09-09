// [SECTION] Dependencies and Modules
const express = require("express");
const productController = require("../controllers/productController");
const { protect, admin } = require("../authGuard");

// [SECTION] Routing Component
const router = express.Router();

// [SECTION] Route for creating a product (Admin Only)
router.post("/", protect, admin, productController.createProduct);

// [SECTION] Route for retrieving all products (Admin Only)
router.get("/all", protect, admin, productController.getProducts);

// [SECTION] Route for updating a product (Admin Only)
router.patch(
  "/:productId/update",
  protect,
  admin,
  productController.updateProduct
);

// [SECTION] Route for archiving a product (Admin Only)
router.patch(
  "/:productId/archive",
  protect,
  admin,
  productController.archiveProduct
);

// [SECTION] Route for activating a product (Admin Only)
router.patch(
  "/:productId/activate",
  protect,
  admin,
  productController.activateProduct
);

// [SECTION] Route for retrieving all active products (Public)
router.get("/active", productController.getActiveProducts);

// [SECTION] Route for retrieving a single product by ID (Public)
router.get("/:productId", productController.getProductById);

// Route to search products by name
router.post('/search-by-name', productController.searchProductsByName);

// Route to search products by price range
router.post('/search-by-price', productController.searchProductsByPrice);

// [SECTION] Export Route System

module.exports = router;

module.exports = router;

