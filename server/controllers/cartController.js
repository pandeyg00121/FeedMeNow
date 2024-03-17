const Restaurant = require("./../models/restaurantModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Food = require("./../models/foodModel");
const Cart = require("./../models/cartModel");
const mongoose = require('mongoose');

// Get user's cart details
exports.getCart = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({ user: userId }).populate(
    "restaurants.restaurant",
    "name"
  );

  async function getFoodName(foodId) {
    try {
      const food = await Food.findById(foodId);
      return food ? food.name : "Unknown Food";
    } catch (error) {
      console.error("Error fetching food:", error);
      return "Unknown Food";
    }
  }

  // Function to fetch restaurant name by ID
  async function getRestaurantName(restaurantId) {
    try {
      const restaurant = await Restaurant.findById(restaurantId);
      return restaurant ? restaurant.name : "Unknown Restaurant";
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      return "Unknown Restaurant";
    }
  }

  if (!cart) {
    return res.status(404).json({ message: "Cart is Empty" });
  }

  const data = await Promise.all(
    cart.restaurants.map(async (restaurantObj) => {
      const restaurantName = await getRestaurantName(
        restaurantObj.restaurant._id
      );
      const rPrice = restaurantObj.rPrice;
      const items = await Promise.all(
        restaurantObj.items.map(async (item) => {
          const foodName = await getFoodName(item.food);
          return {
            id: item.food,
            name: foodName,
            price: item.price,
            quantity: item.quantity,
          };
        })
      );

      return {
        restaurant: restaurantName,
        rPrice: rPrice,
        items: items,
      };
    })
  );
  res.status(200).send(data);
});

exports.clearCart = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  await Cart.deleteOne({ user: userId });
  console.log("heloooo from del cart");
  res.status(200).send("Your cart is now Empty");
});
// Add item to the cart
exports.addItemToCart = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const { foodId } = req.body;
  const food = await Food.findOne({ _id: foodId });
  const restaurantId = food.restaurant;
  let cart = await Cart.findOne({ user: userId });
  console.log(food);
  if (!cart) {
    // Create a new cart if not found
    cart = await Cart.create({
      user: userId,
      restaurants: [
        {
          restaurant: restaurantId,
          items: [{ food: foodId, quantity: 1, price: food.price }],
          rPrice: food.price,
          active: true,
        },
      ],
      totalPrice: food.price,
    });

    //   console.log(cart);
  } else {
    // Check if the restaurant is already in the cart
    const indR = cart.restaurants.findIndex((r) =>
      r.restaurant.equals(restaurantId)
    );

    if (indR === -1) {
      // If the restaurant is not in the cart, add it
      cart.restaurants.push({
        restaurant: restaurantId,
        items: [{ food: foodId, quantity: 1, price: food.price }],
        rPrice: food.price,
        active: true,
      });
    } else {
      // If the restaurant is already in the cart, checking if the food item is in the restaurant
      const indF = cart.restaurants[indR].items.findIndex((item) =>
        item.food.equals(foodId)
      );

      if (indF === -1) {
        // If the food item is not in the restaurant, adding it
        cart.restaurants[indR].items.push({
          food: foodId,
          quantity: 1,
          price: food.price,
        });
      } else {
        // If the food item is already in the restaurant, updating the quantity

        cart.restaurants[indR].items[indF].quantity++;

        cart.restaurants[indR].items[indF].price += food.price;
      }
      cart.restaurants[indR].rPrice += food.price;
    }
    //  if( cart.restaurants[indR].active ===true)
    cart.totalPrice += food.price;
  }

  // Save the updated or newly created cart to the database
  await cart.save();

  res.status(201).json({
    status: "success",
    data: {
      cart,
    },
  });
});

// Remove item from the cart
exports.removeItemFromCart = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { foodId } = req.body;

  const food = await Food.findOne({ _id: foodId });
  const restaurantId = food.restaurant;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Check if the restaurant is in the cart
  const indR = cart.restaurants.findIndex((r) =>
    r.restaurant.equals(restaurantId)
  );

  if (indR === -1) {
    return res
      .status(404)
      .json({ message: "Restaurant not found in the cart" });
  }

  // Checking if the food item is in the restaurant
  const indF = cart.restaurants[indR].items.findIndex((item) =>
    item.food.equals(foodId)
  );

  if (indF === -1) {
    return res
      .status(404)
      .json({ message: "Food item not found in the restaurant" });
  }

  // Updating the restaurant and overall cart prices
  const removedItemPrice = cart.restaurants[indR].items[indF].price;
  cart.restaurants[indR].rPrice -= removedItemPrice;
  //   if(cart.restaurants[indR].active)
  cart.totalPrice -= removedItemPrice;

  // Remove the food item from the restaurant
  cart.restaurants[indR].items.splice(indF, 1);

  // If the restaurant is now empty, remove it from the cart
  if (cart.restaurants[indR].items.length === 0) {
    cart.restaurants.splice(indR, 1);
  }

  await cart.save();

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

// Update item quantity in the cart
exports.updateCartItemQuantity = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { foodId, action } = req.body;
  const food = await Food.findOne({ _id: foodId });
  const restaurantId = food.restaurant;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Check if the restaurant is in the cart
  const indR = cart.restaurants.findIndex((r) =>
    r.restaurant.equals(restaurantId)
  );

  if (indR === -1) {
    return res
      .status(404)
      .json({ message: "Restaurant not found in the cart" });
  }

  // Check if the food item is in the restaurant
  const indF = cart.restaurants[indR].items.findIndex((item) =>
    item.food.equals(foodId)
  );

  if (indF === -1) {
    return res
      .status(404)
      .json({ message: "Food item not found in the restaurant" });
  }

  // Update the quantity based on the action
  if (action === "+") {
    // Increment the quantity by 1
    cart.restaurants[indR].items[indF].quantity += 1;

    // Update the restaurant and overall cart prices
    cart.restaurants[indR].items[indF].price += food.price;
    cart.restaurants[indR].rPrice += food.price;

    // if(cart.restaurants[indR].active)
    cart.totalPrice += food.price;
  } else if (action === "-") {
    // Decrement the quantity by 1
    cart.restaurants[indR].items[indF].quantity -= 1;

    // If the quantity becomes 0, remove the food item
    if (cart.restaurants[indR].items[indF].quantity === 0) {
      cart.restaurants[indR].items.splice(indF, 1);
    }

    // If the restaurant becomes empty after removing the item, remove the entire restaurant from the cart
    if (cart.restaurants[indR].items.length === 0) {
      cart.restaurants.splice(indR, 1);
      cart.totalPrice -= food.price;
    } else {
      // Update the restaurant and overall cart prices
      cart.restaurants[indR].items[indF].price -= food.price;
      cart.restaurants[indR].rPrice -= food.price;

      //  if(cart.restaurants[indR].active)
      cart.totalPrice -= food.price;
    }
  }

  await cart.save();

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});



exports.deleteItem = catchAsync(async (req, res, next) => {
  const foodId = req.params.id;
  const userId = req.user.id;
  const cart = await Cart.findOne({ user: userId });
  Cart.updateOne(
    { _id:cart._id }, // Match the cart with the given _id
    { $pull: { "cart.restaurants.$[].items": { "food": foodId } } } // Remove the item from the specified restaurant's items array
  )
  
  next();
  
});
