const express = require('express');

const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const restaurantController = require("./../controllers/restaurantController");
const reviewController = require("./../controllers/reviewController");

const router = express.Router();
router.use(express.json());

router.post("/login", authController.login);

router.use(authController.protect); 

router.get("/me", userController.getMe);

router.use(authController.restrictTo('admin'));

router.get("/allUser",userController.getAllUsers)
router.post('/allUser/:id',userController.updateStatus)
router.get("/allUser/:id",userController.getUser)
// router.patch(userController.updateUser)
router.delete("/allUser/:id",userController.deleteUser);
router.get('/userMap',userController.userMap);

router.get("/pendingReq",restaurantController.getAllPendingRestaurants)
router.post("/pendingReq/:id",restaurantController.approvePendingRestaurants)


router.get("/allRes",restaurantController.getAllRestaurants)
router.get("/allRes/:id",restaurantController.getRestaurant)
// router.patch(userController.updateUser)
router.delete("/allRes/:id",restaurantController.deleteRestaurant);
router.get('/resMap',restaurantController.resMap);

router.get("/allReviews",reviewController.getAllReviews);
module.exports = router;