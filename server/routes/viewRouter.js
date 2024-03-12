const express =  require('express');

const viewController = require("./../controllers/viewController");

const router = express.Router();
router.use(express.json());

router.get("/", viewController.home);
router.post("/search/:name", viewController.search);


module.exports = router;