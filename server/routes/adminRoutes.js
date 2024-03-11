const express = require('express');

const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const restaurantController = require("./../controllers/restaurantController");

const router = express.Router();
router.use(express.json());

router.post("/login", authController.login);

router.use(authController.protect); 

router.get("/me", userController.getMe);

router.use(authController.restrictTo('admin'));

router.get("/allUser",userController.getAllUsers)
router.get("/allUser/:id",userController.getUser)
// router.patch(userController.updateUser)
router.delete("/allUser/:id",userController.deleteUser);


router.get("/pendingReq",restaurantController.getAllPendingRestaurants)
router.patch("/pendingReq/:id",restaurantController.approvePendingRestaurants)


router.get("/allRes",restaurantController.getAllRestaurants)
router.get("/allRes/:id",restaurantController.getRestaurant)
// router.patch(userController.updateUser)
router.delete("/allRes/:id",restaurantController.deleteRestaurant);

module.exports = router;