const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../auth');


// Route to add to cart
router.post('/add-to-cart', protect, cartController.addToCart);
// Route to retrieve user's cart
router.get('/get-cart', protect, cartController.getCart);

// Route to update product quantity in cart
router.patch('/update-cart-quantity', protect, cartController.updateCartQuantity);

// Route to remove item from cart
router.patch('/:productId/remove-from-cart', protect, cartController.removeFromCart);

// Route to clear cart
router.put('/clear-cart', protect, cartController.clearCart);

module.exports = router;
