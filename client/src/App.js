import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import RestaurantDashboard from './components/Restaurant/Admin/RestaurantDashboard';
import ManageItems from './components/Restaurant/Admin/ManageItems';
import AddNewItem from './components/Restaurant/Admin/AddNewItem';
import CurrentOrders from './components/Restaurant/Admin/CurrentOrders';
import PreviousOrders from './components/Restaurant/Admin/PreviousOrders.jsx';
import Search from './components/Search/Search';
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


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="" element={<PrivateRoute />}>
      <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
        <Route path="/restaurant/manageitems" element={<ManageItems />} />
            <Route path="/restaurant/additem" element={<AddNewItem />} />
            <Route path="/restaurant/currentorders" element={<CurrentOrders />} />
            <Route path="/restaurant/previousorders" element={<PreviousOrders />} />
          </Route>
        

        {/* Auth Routes */}
        <Route path="users/login" element={<LoginUser />} />
        <Route path="restaurants/login" element={<LoginRestaurant />} />
        <Route path="users/signup" element={<SignUpUser />} />
        <Route path="restaurants/signup" element={<SignUpRestaurant />} />
        {/* Admin Routes */}
        <Route path='' element={<PrivateRouteAdmin/>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUser />} />
        <Route path="/admin/restaurants" element={<AdminRestaurant />} />
        <Route path="/admin/restaurants/request" element={<AdminRequest />} />
        <Route path="/admin/usermap" element={<UserMap />} />
        </Route>
        {/* admin routes close */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
