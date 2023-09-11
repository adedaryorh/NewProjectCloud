const express = require('express');
const router = express.Router();

const CartController = require('../controllers/CartController');
const Auth = require('../middleware/Auth');
const { 
    validate, 
    cartValidation,
    checkoutValidation
} = require('../helpers/validators');

// @route  api/cart
// @method POST
// @access private
// @desc add to cart
router.post('/cart', cartValidation(), validate, Auth, CartController.addToCart);

// @route  api/cart/:cartId
// @method PATCH
// @access Private
// @desc remove item from cart
router.patch('/cart/:cartId', Auth, CartController.removeFromCart);

// @route  api/cart/clear
// @method DELETE
// @access Private
// @desc clear cart
router.delete('/cart/clear', Auth, CartController.clearCart);

// @route  api/carts
// @method GET
// @access Private
// @desc list cart items
router.get('/carts', Auth, CartController.listCartItems);

// @route  api/cart/checkout
// @method POST
// @access private
// @desc add to cart
router.post('/cart/checkout', checkoutValidation(), validate, Auth, CartController.checkout);

module.exports = router;