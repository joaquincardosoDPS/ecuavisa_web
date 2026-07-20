import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/authStore';
import { favoritesService } from '@/services/favoritesService';

/**
 * Hook para gestionar el estado de favorito de un programa.
 * Valida al montar si el programa está en favoritos y expone toggle.
 */
export function useFavorite(programSlug: string) {
    const queryClient = useQueryClient();
    const token = useAuthStore((s) => s.token);
    const activeProfile = useAuthStore((s) => s.activeProfile);
    const [isToggling, setIsToggling] = useState(false);

    const isEnabled = !!token && !!activeProfile;

    const { data: isFavorited = false } = useQuery({
        queryKey: ['favorite-validate', token, activeProfile?.id, programSlug],
        queryFn: async () => {
            const response = await favoritesService.validate(
                token!,
                activeProfile!.id,
                programSlug,
            );
            return response.status === 'ok' && response.data.length > 0;
        },
        enabled: isEnabled,
    });

    const toggleFavorite = async () => {
        if (!token || !activeProfile || isToggling) return;
        setIsToggling(true);
        try {
            if (isFavorited) {
                await favoritesService.delete(token, activeProfile.id, programSlug);
            } else {
                await favoritesService.add(token, activeProfile.id, programSlug);
            }
            queryClient.invalidateQueries({
                queryKey: ['favorite-validate', token, activeProfile.id, programSlug],
            });
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        } catch (err) {
            console.error('[useFavorite] Toggle error:', err);
        } finally {
            setIsToggling(false);
        }
    };

    return {
        isFavorited,
        isToggling,
        isEnabled,
        toggleFavorite,
    };
}
