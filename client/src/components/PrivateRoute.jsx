import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { restaurantInfo } = useSelector(state => state.authrestaurant);
  return restaurantInfo ? (
    <Outlet />
  ) : (
    <Navigate to="/restaurants/login" replace />
  );
};
export default PrivateRoute;