import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRouteAdmin = () => {
  const { userInfo } = useSelector(state => state.authuser);

  // Check if user is authenticated and has admin role
  const isAdmin =
    userInfo && userInfo.data && userInfo.data.user.role === 'admin';

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRouteAdmin;