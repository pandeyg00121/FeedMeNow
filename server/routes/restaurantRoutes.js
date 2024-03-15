const express = require('express');
// const multer =require('multer');
const restaurantController = require("./../controllers/restaurantController");
const orderController = require("./../controllers/orderController");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");
// const upload = multer({dest: 'public/img/restaurants'});

const router = express.Router();
router.use(express.json());

router.post("/signup", restaurantController.signup);
router.post("/login", restaurantController.login);
router.get('/logout', restaurantController.logout);
router.post("/forgotPassword",restaurantController.forgotPassword);
router.patch("/resetPassword/:token", restaurantController.resetPassword);

router.use(restaurantController.protect); 

router.get('/dashboard',restaurantController.dashboard);
router.get('/manageItems',restaurantController.manageItems);
router.post("/addItem", restaurantController.addItem);

//Order routes
router.get("/manageOrders/previous" , orderController.resPrevOrders);
router.get("/manageOrders/current" , orderController.resCurrOrders );
router.patch("/manageOrders/updateOrderStatus/", orderController.updateOrderStatus);

router.patch("/updateMyPassword",restaurantController.updatePassword);
router.get("/me", restaurantController.getMe,restaurantController.getRestaurant);
router.patch("/updateMe",  restaurantController.uploadRestaurantPhotos,restaurantController.resizeRestaurantImages ,restaurantController.updateImages);
router.patch("/closeMe", restaurantController.closeMe);
router.patch("/openMe", restaurantController.openMe);

router.get("/myReviews", reviewController.resReviews);



//router.get('/deliveredOrders)
//router.get('/currentOrders)

module.exports = router;

//dashboard of restaurant will have
// Reviews
//their already listed food
//Their orders(completed + current + cancelled)
//their details + restaurant pics
