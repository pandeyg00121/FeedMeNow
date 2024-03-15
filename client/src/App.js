import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import RestaurantDashboard from './components/Restaurant/Admin/RestaurantDashboard';
import ManageItems from './components/Restaurant/Admin/ManageItems';
import AddNewItem from './components/Restaurant/Admin/AddNewItem';
import ManageOrders from './components/Restaurant/Admin/ManageOrders';

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
        <Route path="/restaurant/manageitems" element={<ManageItems />} />
        <Route path="/restaurant/additem" element={<AddNewItem />} />
        <Route path="/restaurant/manageorders" element={<ManageOrders />} />
        <Route path="/search" element={<Search />} />

        {/* Auth Routes */}
        <Route path="users/login" element={<LoginUser />} />
        <Route path="restaurants/login" element={<LoginRestaurant />} />
        <Route path="users/signup" element={<SignUpUser />} />
        <Route path="restaurants/signup" element={<SignUpRestaurant />} />
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUser />} />
        <Route path="/admin/restaurants" element={<AdminRestaurant />} />
        <Route path="/admin/restaurants/request" element={<AdminRequest />} />
        <Route path="/admin/usermap" element={<UserMap />} />
        {/* admin routes close */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
