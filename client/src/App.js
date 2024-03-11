import React from 'react';
import {BrowserRouter,Route,Routes} from "react-router-dom"
import Home from './components/Home/Home';
import RestaurantDashboard from './components/Restaurant/Admin/RestaurantDashboard';
import ManageItems from './components/Restaurant/Admin/ManageItems';
import AddNewItem from './components/Restaurant/Admin/AddNewItem';
import ManageOrders from './components/Restaurant/Admin/ManageOrders';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/restaurant/dashboard' element={<RestaurantDashboard/>}/>
        <Route path='/restaurant/manageitems' element={<ManageItems/>}/>
        <Route path='/restaurant/additem' element={<AddNewItem/>}/>
        <Route path='/restaurant/manageorders' element={<ManageOrders/>}/>
      </Routes>
     
    </BrowserRouter>
  );
}

export default App;
