
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
function PrivateRoute({ children, requiredType }) {
  const { currentUser, userData } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredType && userData?.type !== requiredType) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
export default PrivateRoute;
