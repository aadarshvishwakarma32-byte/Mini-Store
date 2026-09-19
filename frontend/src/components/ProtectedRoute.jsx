import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading, initialized } = useAuth();
  const location = useLocation();

  if (loading || !initialized) {
    return (
      <div className="authLoading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div className="skeletonLine w40" style={{ height: '40px', width: '200px', borderRadius: '8px' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function AdminRoute({ children }) {
  return <ProtectedRoute allowedRoles={['admin']}>{children}</ProtectedRoute>;
}