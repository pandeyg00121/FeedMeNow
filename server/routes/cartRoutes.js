const express = require('express');

const cartController = require("./../controllers/cartController");
const authController = require("./../controllers/authController");
const router = express.Router();
router.use(express.json());

router.use(authController.protect); 

router.get("/", cartController.getCart);
router.delete('/clearCart',cartController.clearCart);
router.delete('/:id',cartController.deleteItem,cartController.getCart);
router.post("/addItem", cartController.addItemToCart);
// router.post("/addItem", cartController.addItemToCart,cartController.getCart);
router.post("/removeItem", cartController.removeItemFromCart);
router.post("/updateItem", cartController.updateCartItemQuantity);

module.exports = router;