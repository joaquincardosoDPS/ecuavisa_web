import { useQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalogService';
import { historyService } from '@/services/historyService';
import { useAuthStore } from '@/features/auth/authStore';

export const useHomeData = () => {
    const token = useAuthStore((s) => s.token);
    const activeProfile = useAuthStore((s) => s.activeProfile);

    const sliderQuery = useQuery({
        queryKey: ['home', 'slider'],
        queryFn: () => catalogService.getSlider(),
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    const categoriesQuery = useQuery({
        queryKey: ['home', 'categories'],
        queryFn: () => catalogService.getCategories({ show_event: true }),
        staleTime: 1000 * 60 * 5,
    });

    const playlistPremiumQuery = useQuery({
        queryKey: ['home', 'playlist-premium'],
        queryFn: () => catalogService.getPlaylistPremium(),
        staleTime: 1000 * 60 * 5,
    });

    const recommendedQuery = useQuery({
        queryKey: ['home', 'recommended'],
        queryFn: () => catalogService.getRecommendedPrograms(),
        staleTime: 1000 * 60 * 5,
    });

    const continueWatchingQuery = useQuery({
        queryKey: ['home', 'continue-watching', token, activeProfile?.id],
        queryFn: () => historyService.getAll({
            token: token!,
            profile: activeProfile!.id,
            end: 0,
            limit: 10,
        }),
        staleTime: 1000 * 60 * 2, // 2 minutos
        enabled: !!token && !!activeProfile,
    });

    return {
        slider: sliderQuery.data?.data || [],
        categories: categoriesQuery.data?.data || [],
        playlistPremium: playlistPremiumQuery.data?.data || [],
        recommended: recommendedQuery.data?.data || [],
        continueWatching: continueWatchingQuery.data?.data || [],
        isLoading: sliderQuery.isLoading || categoriesQuery.isLoading || playlistPremiumQuery.isLoading || recommendedQuery.isLoading,
        isError: sliderQuery.isError || categoriesQuery.isError || playlistPremiumQuery.isError || recommendedQuery.isError
    };
};

