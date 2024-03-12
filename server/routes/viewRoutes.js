const express =  require('express');

const viewController = require("./../controllers/viewController");

const router = express.Router();
router.use(express.json());

router.get('/',viewController.home);

router.get('/restaurants', viewController.getOverview);
router.get('/restaurants/:slug', viewController.getRestaurant);

router.get('/foods', viewController.getAllFoods);
router.get('/foods/:slug', viewController.getFood);

module.exports = router;