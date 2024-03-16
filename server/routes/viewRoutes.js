const express =  require('express');

const viewController = require("./../controllers/viewController");

const router = express.Router();
router.use(express.json());


router.get('/top-5-restaurants', viewController.aliasTopRestaurants,viewController.getOverview);
router.get('/restaurantsAll',viewController.getOverview);
router.get('/restaurantOne/:slug', viewController.getRestaurant);

router.get('/top-6-foods', viewController.aliasTopFoods,viewController.getAllFoods);
router.get('/foodsAll', viewController.getAllFoods);
router.get('/foodOne/:slug', viewController.getFood);

module.exports = router;