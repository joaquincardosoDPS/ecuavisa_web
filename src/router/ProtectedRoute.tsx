import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/authStore';
import { useQuery } from '@tanstack/react-query';
import { profileService } from '@/services/profileService';
import { FullScreenSpinner } from '@/components/ui/FullScreenSpinner';

function ProtectedRoute({ children }: { children?: React.ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const activeProfile = useAuthStore((state) => state.activeProfile);
    const setActiveProfile = useAuthStore((state) => state.setActiveProfile);
    const token = useAuthStore((state) => state.token);
    const location = useLocation();

    const isSelectProfileRoute = location.pathname === '/seleccionar-perfil';
    const shouldFetchProfiles = isAuthenticated && !activeProfile && !isSelectProfileRoute;

    const { data: profiles, isLoading } = useQuery({
        queryKey: ['profiles', token],
        queryFn: async () => {
            const response = await profileService.getAll(token!);
            return response.data || [];
        },
        enabled: !!shouldFetchProfiles,
    });

    useEffect(() => {
        if (profiles && profiles.length > 0 && !activeProfile && !isSelectProfileRoute) {
            const user = useAuthStore.getState().user;
            let profileToSelect = profiles[0];
            
            if (user?.id) {
                const lastProfileId = localStorage.getItem(`last_profile_${user.id}`);
                if (lastProfileId) {
                    const found = profiles.find((p) => String(p.id) === String(lastProfileId));
                    if (found) {
                        profileToSelect = found;
                    }
                }
            }
            
            setActiveProfile(profileToSelect);
        }
    }, [profiles, activeProfile, isSelectProfileRoute, setActiveProfile]);

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
    }

    if (shouldFetchProfiles && (!profiles || !activeProfile)) {
        return <FullScreenSpinner />;
    }

    return children ? <>{children}</> : <Outlet />;
}

export default ProtectedRoute;
