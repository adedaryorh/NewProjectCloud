const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/OrderController');
const Auth = require('../middleware/Auth');

router.get('/orders', Auth, OrderController.getOrders);

router.get('/order/:id', Auth, OrderController.findOrder);

module.exports = router;