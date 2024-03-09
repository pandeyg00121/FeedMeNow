const express = require('express');

const foodController = require("./../controllers/foodController");

const router = express.Router();
router.use(express.json());

router.get("/", foodController.getAllFoods);
// router.post("/", foodController.createFood);

module.exports = router;