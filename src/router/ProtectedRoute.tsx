import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/authStore';

function ProtectedRoute({ children }: { children?: React.ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
    }

    return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;
