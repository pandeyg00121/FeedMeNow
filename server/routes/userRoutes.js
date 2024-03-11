const express = require('express');

const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();
router.use(express.json());

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword",authController.forgotPassword);

router.use(authController.protect); 

router.get("/me", userController.getMe);

module.exports = router;

//dashboard of user will have
//his current order
//his details
//all his past orders
//all his restaurant reviews
//cart
