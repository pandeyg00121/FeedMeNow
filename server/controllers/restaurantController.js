const Restaurant = require("./../models/restaurantModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Food= require("./../models/foodModel");

exports.signup = catchAsync(async (req, res, next) => {
  
    const newRestaurant = await Restaurant.create({
      name: req.body.name,
      address: req.body.address,
      email: req.body.email,
      type: req.body.type,
    //   ownerName: req.body.owner,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      accountCreatedAt: Date.now(),
    });
  
    res.status(201).json({
      status: "success",
      data: {
        restaurant: newRestaurant,
      },
    });
});


exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please Provide email and password", 400));
  }
 
  //finding the restaurant using email and also saving password
  const resUser = await Restaurant.findOne({ email }).select("+password");
  // console.log(user);
  const correct = await resUser.correctPassword(password, resUser.password);
 
  if (!resUser || !correct) {
    return next(new AppError("Incorrect Email or password", 401));
  }
  return res.status(200).json({
    status: "success",
    data: {
      resUser,
    },
  });


  

});


exports.dashboard=catchAsync(async (req, res, next) => {

    try {
        const restaurantId = req.user._id;
    
        // Fetch restaurant details
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
          return next(new AppError('Restaurant not found', 404));
        }
    
        // Fetch active status 
        const isActive = restaurant.active || false;

        // Fetch menu items
        const menu = await Food.find({ restaurant: restaurantId });
        
        // Create a dashboard object with restaurant details, active status, and menu
        const restaurantDashboard = {
          details: {
            name: restaurant.name,
            type:restaurant.type,
            address:restuarant.address,
            email:restaurant.email,
            profilePic:restaurant.profilePic,
          },
          isActive,
          menu
        //   menu: menu.map((foodItem) => ({
        //     name: foodItem.name,
        //     type: foodItem.type,
        //     price: foodItem.price,
        //     description: foodItem.description,
        //     image: foodItem.image,
        //     active: foodItem.active,
        //   })),
        };
    
        return res.status(200).json(restaurantDashboard);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
      }
    });
    





exports.addItem= catchAsync(async (req, res, next) => {
    const newFoodItem = await Food.create({
        name: req.body.name,
        type: req.body.type,
        price: req.body.price,
        description: req.body.description,
        // image: req.body.image,
        restaurant: req.body.restaurant,
      
      });
    
      res.status(201).json({
        status: "success",
        data: {
          foodItem: newFoodItem,
        },
      });

});
