const express = require('express');

const cartController = require("./../controllers/cartController");

const router = express.Router();
router.use(express.json());

router.post("/", cartController.);


module.exports = router;