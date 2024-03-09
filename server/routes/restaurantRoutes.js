const express = require('express');

const restaurantController = require("./../controllers/restaurantController");

const router = express.Router();
router.use(express.json());

router.post("/signup", restaurantController.signup);
router.post("/login", restaurantController.login);

module.exports = router;