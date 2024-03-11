const express = require('express');

const restaurantController = require("./../controllers/restaurantController");
const authController = require("./../controllers/authController");

const router = express.Router();
router.use(express.json());

router.post("/signup", restaurantController.signup);
router.post("/login", restaurantController.login);

router.use(restaurantController.protect); 

router.get('/dashboard',restaurantController.dashboard);
router.post("/addItem", restaurantController.addItem);

module.exports = router;

//dashboard of restaurant will have
// Reviews
//their already listed food
//Their orders(completed + current + cancelled)
//their details + restaurant pics
//active or inactive status button