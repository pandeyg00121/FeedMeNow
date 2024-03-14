const express = require('express');
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const orderController = require("./../controllers/orderController");
const reviewController = require("./../controllers/reviewController");

const cartRouter = require('./cartRoutes');

const router = express.Router();
router.use(express.json());

router.post("/signup", authController.signup);
router.patch("/verifyemail/:verificationCode",authController.verifyEmailHandler);
router.post("/login", authController.login);
router.get('/logout', authController.logout);
router.post("/forgotPassword",authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect); 

router.use("/cart", cartRouter);

router.patch("/updateMyPassword",authController.updatePassword);
router.get("/me", userController.getMe,userController.getUser);
router.patch("/updateMe",userController.uploadUserPhoto ,userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);
// ------------------------>
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
