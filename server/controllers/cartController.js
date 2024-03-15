const Restaurant = require("./../models/restaurantModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Food= require("./../models/foodModel");
const Cart = require("./../models/cartModel");

// Get user's cart details
exports.getCart = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({ user: userId }).populate('restaurants.restaurant', 'name');

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  res.status(200).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

// Add item to the cart
exports.addItemToCart = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const {foodId} = req.body;
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
            items: [
              { food: foodId, quantity: 1, price: food.price  },
            ],
            rPrice: food.price,
            active:true,
          },
        ],
        totalPrice: food.price,
      });
      
    //   console.log(cart);
    } else {
      // Check if the restaurant is already in the cart
      const indR = cart.restaurants.findIndex((r) => r.restaurant.equals(restaurantId));
  
      if (indR === -1) {
        // If the restaurant is not in the cart, add it
        cart.restaurants.push({
          restaurant: restaurantId,
          items: [{ food: foodId, quantity:1, price:food.price }],
          rPrice:food.price,
          active:true,
        });
      } else {
        // If the restaurant is already in the cart, checking if the food item is in the restaurant
        const indF = cart.restaurants[indR].items.findIndex((item) => item.food.equals(foodId));
  
        if (indF === -1) {
          // If the food item is not in the restaurant, adding it
          cart.restaurants[indR].items.push({ food: foodId, quantity:1, price:food.price });
        } else {
          // If the food item is already in the restaurant, updating the quantity

          cart.restaurants[indR].items[indF].quantity ++;
          
          cart.restaurants[indR].items[indF].price +=food.price;
        }
        cart.restaurants[indR].rPrice += food.price;

      }
    //  if( cart.restaurants[indR].active ===true)
      cart.totalPrice += food.price;
    }
  
    // Save the updated or newly created cart to the database
    await cart.save();
  
    res.status(201).json({
      status: 'success',
      data: {
        cart,
      },
    });
  });
  

// Remove item from the cart
exports.removeItemFromCart = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const  {foodId}  = req.body;
  
  const food = await Food.findOne({ _id: foodId });
  const restaurantId = food.restaurant;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  // Check if the restaurant is in the cart
  const indR = cart.restaurants.findIndex((r) => r.restaurant.equals(restaurantId));

  if (indR === -1) {
    return res.status(404).json({ message: 'Restaurant not found in the cart' });
  }

  // Checking if the food item is in the restaurant
  const indF = cart.restaurants[indR].items.findIndex((item) => item.food.equals(foodId));

  if (indF === -1) {
    return res.status(404).json({ message: 'Food item not found in the restaurant' });
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
    status: 'success',
    data: {
      cart,
    },
  });
});

// Update item quantity in the cart
exports.updateCartItemQuantity = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const {  foodId,action } = req.body;
    const food = await Food.findOne({ _id: foodId });
  const restaurantId = food.restaurant;
    
  
    const cart = await Cart.findOne({ user: userId });
  
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
  
    // Check if the restaurant is in the cart
    const indR = cart.restaurants.findIndex((r) => r.restaurant.equals(restaurantId));
  
    if (indR === -1) {
      return res.status(404).json({ message: 'Restaurant not found in the cart' });
    }
  
    // Check if the food item is in the restaurant
    const indF = cart.restaurants[indR].items.findIndex((item) => item.food.equals(foodId));
  
    if (indF === -1) {
      return res.status(404).json({ message: 'Food item not found in the restaurant' });
    }
  
    // Update the quantity based on the action
    if (action === '+') {
      // Increment the quantity by 1
      cart.restaurants[indR].items[indF].quantity += 1;

      // Update the restaurant and overall cart prices
    cart.restaurants[indR].items[indF].price+=food.price;
    cart.restaurants[indR].rPrice += food.price;

    // if(cart.restaurants[indR].active)
    cart.totalPrice += food.price;

    } else if (action === '-') {
      // Decrement the quantity by 1
      cart.restaurants[indR].items[indF].quantity -= 1;
  
      // If the quantity becomes 0, remove the food item
      if (cart.restaurants[indR].items[indF].quantity === 0) {
        cart.restaurants[indR].items.splice(indF, 1);
      }

      // If the restaurant becomes empty after removing the item, remove the entire restaurant from the cart
    if (cart.restaurants[indR].items.length===0) {
        cart.restaurants.splice(indR, 1);
        cart.totalPrice -= food.price;
      }
    else{
    
          // Update the restaurant and overall cart prices
     cart.restaurants[indR].items[indF].price-=food.price;
     cart.restaurants[indR].rPrice -= food.price;

    //  if(cart.restaurants[indR].active)
     cart.totalPrice -= food.price;
    }
    }
  
  
    await cart.save();
  
    res.status(200).json({
      status: 'success',
      data: {
        cart,
      },
    });
  });