const express = require('express');
const router = express.Router();
const cartController = require('../controller/Cartcontroller');
const { protect } = require('../auth');


// Route to add to cart
router.post('/add-to-cart', protect, Cartcontroller.addToCart);
// Route to retrieve user's cart
router.get('/get-cart', protect, Cartcontroller.getCart);

// Route to update product quantity in cart
router.patch('/update-cart-quantity', protect, Cartcontroller.updateCartQuantity);

// Route to remove item from cart
router.patch('/:productId/remove-from-cart', protect, Cartcontroller.removeFromCart);

// Route to clear cart
router.put('/clear-cart', protect, Cartcontroller.clearCart);

module.exports = router;
