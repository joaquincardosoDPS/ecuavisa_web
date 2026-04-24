import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/authStore';

/**
 * Layout route que requiere autenticación.
 * Si el usuario no está logueado, redirige a /auth/login
 * guardando la ruta original para volver después del login.
 * Soporta tanto uso como layout (<ProtectedRoute />) como wrapper (<ProtectedRoute>children</ProtectedRoute>).
 */
function ProtectedRoute({ children }: { children?: React.ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
    }

    return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;
