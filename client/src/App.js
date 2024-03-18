import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import RestaurantDashboard from './components/Restaurant/Admin/RestaurantDashboard';
import ManageItems from './components/Restaurant/Admin/ManageItems';
import AddNewItem from './components/Restaurant/Admin/AddNewItem';
import CurrentOrders from './components/Restaurant/Admin/CurrentOrders';
import PreviousOrders from './components/Restaurant/Admin/PreviousOrders.jsx';
import LoginRestaurant from './components/Auth/Login/LoginRestaurant';
import LoginUser from './components/Auth/Login/LoginUser';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminUser from './components/Admin/AdminUser';
import AdminRequest from './components/Admin/AdminRequest';
import AdminRestaurant from './components/Admin/AdminRestaurant';
import UserMap from './components/Admin/UserMap';
import SignUpUser from './components/Auth/SignUp/SignUpUser';
import SignUpRestaurant from './components/Auth/SignUp/SignUpRestaurant';
import PrivateRoute from './components/PrivateRoute.jsx';
import PrivateRouteAdmin from './components/PrivateRouteAdmin.jsx';
import Profile from './components/User/Profile.jsx';
import CurrentOrdersUser from './components/User/CurrentOrderUser.jsx';
import PreviousOrdersUser from './components/User/PreviousOrdersUser.jsx';
import Reviews from './components/User/Reviews.jsx';
import PrivateRouteUser from './components/PrivateRouteUser.jsx';
import AllRestaurants from './components/Restaurant/AllRestaurants.jsx';
import RestaurantMenuPage from './components/Menu/MenuNew.jsx';
import AllFoodItems from './components/Food/AllFoodItems.jsx';
import OrderPage from './components/Cart/Cart.jsx';
import ContactUs from './components/ContactUs.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
      {/*Public Routes*/}
      {/*User Routes*/}
      <Route path='' element={<PrivateRouteUser/>}>
          <Route path="/" element={<Home />} />
          <Route path='/restaurants' element={<AllRestaurants/>}/>
          <Route path="/restaurant/:slug" element={<RestaurantMenuPage/>} />
          <Route path="/foods" element={<AllFoodItems />} />
          <Route path="/users/viewcart" element={<OrderPage />} />
          <Route path="/user/profile" element={<Profile/>}>
          <Route path="current-order" element={<CurrentOrdersUser />} />
          <Route path="previous-orders" element={<PreviousOrdersUser />} />
          <Route path="my-reviews" element={<Reviews />} />
          </Route>
        </Route>
      {/* Auth Routes */}
      <Route path="users/login" element={<LoginUser />} />
        <Route path="restaurants/login" element={<LoginRestaurant />} />
        <Route path="users/signup" element={<SignUpUser />} />
        <Route path="restaurants/signup" element={<SignUpRestaurant />} />
        <Route path="contactus" element={<ContactUs />} />

       {/*Restaurant Routes*/}
        <Route path="" element={<PrivateRoute />}>
      <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
        <Route path="/restaurant/manageitems" element={<ManageItems />} />
            <Route path="/restaurant/additem" element={<AddNewItem />} />
            <Route path="/restaurant/currentorders" element={<CurrentOrders />} />
            <Route path="/restaurant/previousorders" element={<PreviousOrders />} />
          </Route>


          


        {/* Admin Routes */}
        <Route path='' element={<PrivateRouteAdmin/>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUser />} />
        <Route path="/admin/restaurants" element={<AdminRestaurant />} />
        <Route path="/admin/restaurants/request" element={<AdminRequest />} />
        <Route path="/admin/usermap" element={<UserMap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
