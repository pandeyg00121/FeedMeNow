const express = require('express');

const orderController = require("./../controllers/orderController");
const authController = require("./../controllers/authController");

const router = express.Router();
router.use(express.json());

router.use(authController.protect);
//router.get('/checkout-session', orderController.getCheckoutSession);
module.exports = router;