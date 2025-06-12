import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { auth } = useAuth();

  if (!auth?.token) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(auth?.role)) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;
