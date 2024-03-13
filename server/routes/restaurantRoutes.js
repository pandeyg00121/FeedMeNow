const express = require('express');

const restaurantController = require("./../controllers/restaurantController");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

const router = express.Router();
router.use(express.json());

router.post("/signup", restaurantController.signup);
router.post("/login", restaurantController.login);

router.use(restaurantController.protect); 

router.get('/dashboard',restaurantController.dashboard);
router.post("/addItem", restaurantController.addItem);
router.get('/reviews' , reviewController.resReviews);

// router.post('/changePassword')
//router.get('/deliveredOrders)
//router.get('/currentOrders)

module.exports = router;

//dashboard of restaurant will have
// Reviews
//their already listed food
//Their orders(completed + current + cancelled)
//their details + restaurant pics
