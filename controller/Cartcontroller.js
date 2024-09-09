const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Retrieve user's cart
// @route   GET /api/cart/get-cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('cartItems.productId');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({
      cart: {
        _id: cart._id,
        userId: cart.userId,
        cartItems: cart.cartItems.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          subtotal: item.subtotal,
          _id: item._id,
        })),
        totalPrice: cart.totalPrice,
        orderedOn: cart.orderedOn,
        __v: cart.__v,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve cart', error: error.message });
  }
});

// @desc    Add to Cart
// @route   POST /api/cart/add-to-cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (cart) {
      const itemIndex = cart.cartItems.findIndex(item => item.productId.equals(productId));

      if (itemIndex > -1) {
        cart.cartItems[itemIndex].quantity += quantity;
        cart.cartItems[itemIndex].subtotal = cart.cartItems[itemIndex].quantity * product.price;
      } else {
        cart.cartItems.push({
          productId: productId,
          quantity: quantity,
          subtotal: quantity * product.price
        });
      }
    } else {
      cart = new Cart({
        userId: req.user._id,
        cartItems: [{
          productId: productId,
          quantity: quantity,
          subtotal: quantity * product.price
        }],
        totalPrice: quantity * product.price
      });
    }

    cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.subtotal, 0);

    await cart.save();

    res.status(201).json({
      message: 'Item added to cart successfully',
      cart: {
        _id: cart._id,
        userId: cart.userId,
        cartItems: cart.cartItems,
        totalPrice: cart.totalPrice,
        orderedOn: cart.orderedOn,
        __v: cart.__v,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add item to cart', error: error.message });
  }
});

// @desc    Update product quantities in cart
// @route   PATCH /api/cart/update-cart-quantity
// @access  Private
const updateCartQuantity = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.cartItems.findIndex(item => item.productId.equals(productId));

    if (itemIndex > -1) {
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      cart.cartItems[itemIndex].quantity = quantity;
      cart.cartItems[itemIndex].subtotal = quantity * product.price;

      if (quantity <= 0) {
        cart.cartItems.splice(itemIndex, 1);
      }
    } else {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.subtotal, 0);

    await cart.save();

    res.status(200).json({
      message: 'Item quantity updated successfully',
      updatedCart: {
        _id: cart._id,
        userId: cart.userId,
        cartItems: cart.cartItems,
        totalPrice: cart.totalPrice,
        orderedOn: cart.orderedOn,
        __v: cart.__v,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cart quantity', error: error.message });
  }
});

//Remove From Cart

const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.cartItems.findIndex(item => item.productId.equals(productId));

    if (itemIndex > -1) {
      cart.cartItems.splice(itemIndex, 1);
      cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.subtotal, 0);
      await cart.save();

      return res.status(200).json({
        message: 'Item removed from cart successfully',
        updatedCart: {
          _id: cart._id,
          userId: cart.userId,
          cartItems: cart.cartItems,
          totalPrice: cart.totalPrice,
          orderedOn: cart.orderedOn,
          __v: cart.__v,
        }
      });
    } else {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Failed to remove item from cart', error: error.message });
  }
});

// Clear Cart

const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.cartItems = [];
    cart.totalPrice = 0;

    await cart.save();

    return res.status(200).json({
      message: 'Cart cleared successfully',
      cart: {
        _id: cart._id,
        userId: cart.userId,
        cartItems: cart.cartItems,
        totalPrice: cart.totalPrice,
        orderedOn: cart.orderedOn,
        __v: cart.__v,
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to clear cart', error: error.message });
  }
});



module.exports = {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart

};