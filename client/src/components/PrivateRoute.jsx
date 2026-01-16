// client/src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const roleHome = (role) => {
  if (role === 'admin') return '/admin-dashboard';
  if (role === 'seller') return '/seller-dashboard';
  return '/dashboard';
};

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but role not allowed
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to={roleHome(user.role)} replace />;
    }
  }

  return children;
};

export default PrivateRoute;
