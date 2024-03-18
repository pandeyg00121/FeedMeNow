import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRouteUser = () => {
  const { userInfo } = useSelector(state => state.authuser);

  // Check if user is authenticated and has admin role
  const isAdmin =
    userInfo && userInfo.data && userInfo.data.user.role === 'user';

  return isAdmin ? <Outlet /> : <Navigate to="/users/login" replace />;
};

export default PrivateRouteUser;