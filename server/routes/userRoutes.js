const express = require('express');

const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const orderController = require("./../controllers/orderController");
const reviewController = require("./../controllers/reviewController");

const router = express.Router();
router.use(express.json());

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword",authController.forgotPassword);

router.use(authController.protect); 

router.get("/me", userController.getMe);
router.post("/placeOrder", orderController.placeOrder);
router.post("/prevOrders/review", reviewController.addReview);
router.get("/myReviews", reviewController.myReviews);

module.exports = router;

//dashboard of user will have
//his current order
//his details
//all his past orders
//all his restaurant reviews
//cart
