const express = require('express');
// const multer =require('multer');
const restaurantController = require("./../controllers/restaurantController");
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

router.patch('/manageOrders/current/:id',);

router.patch("/updateMyPassword",restaurantController.updatePassword);
router.get("/me", restaurantController.getMe,restaurantController.getRestaurant);
router.patch("/updateMe",  restaurantController.uploadRestaurantPhotos,restaurantController.resizeRestaurantImages ,restaurantController.updateImages);
router.patch("/closeMe", restaurantController.closeMe);
router.patch("/openMe", restaurantController.openMe);

//router.get('/deliveredOrders)
//router.get('/currentOrders)

module.exports = router;

//dashboard of restaurant will have
// Reviews
//their already listed food
//Their orders(completed + current + cancelled)
//their details + restaurant pics
//active or inactive status button