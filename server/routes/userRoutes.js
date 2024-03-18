const express = require('express');
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const orderController = require("./../controllers/orderController");
const reviewController = require("./../controllers/reviewController");
const cartController = require("./../controllers/cartController");
const multer =require('multer');
const cartRouter = require('./cartRoutes');
const orderRouter = require('./orderRoutes');
const upload = multer({dest:'public/img/users'});

const router = express.Router();
router.use(express.json());

router.post("/signup", authController.signup);
router.get("/verifyemail/:verificationCode",authController.verifyEmailHandler);
router.post("/login", authController.login);
router.get('/logout', authController.logout);
router.post("/forgotPassword",authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect); 
// router.use(cartController.getCart);

router.use("/cart", cartRouter);


router.post("/updateMyPassword",authController.updatePassword);
router.get("/me", userController.getMe,userController.getUser);
router.post("/updateMe",userController.updateMe);

router.get('/restoreCart',)

router.delete("/deleteMe", userController.deleteMe);
// ------------------------>
router.use("/booking", orderRouter);
router.post("/placeOrder", orderController.placeOrder);
router.post("/prevOrders/review/:id", reviewController.addReview);
router.get("/myReviews", reviewController.myReviews);
router.get("/prevOrders", orderController.prevOrders);
router.get("/currOrders", orderController.currOrders);

module.exports = router;

