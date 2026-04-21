import { useQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalogService';

export const useHomeData = () => {
    const sliderQuery = useQuery({
        queryKey: ['home', 'slider'],
        queryFn: catalogService.getSlider,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    const categoriesQuery = useQuery({
        queryKey: ['home', 'categories'],
        queryFn: catalogService.getCategories,
        staleTime: 1000 * 60 * 5,
    });

    const playlistPremiumQuery = useQuery({
        queryKey: ['home', 'playlist-premium'],
        queryFn: catalogService.getPlaylistPremium,
        staleTime: 1000 * 60 * 5,
    });

    const recommendedQuery = useQuery({
        queryKey: ['home', 'recommended'],
        queryFn: catalogService.getRecommendedPrograms,
        staleTime: 1000 * 60 * 5,
    });

    return {
        slider: {
            data: sliderQuery.data?.data || [],
            isLoading: sliderQuery.isLoading,
            isError: sliderQuery.isError
        },
        categories: {
            data: categoriesQuery.data?.data || [],
            isLoading: categoriesQuery.isLoading,
            isError: categoriesQuery.isError
        },
        playlistPremium: {
            data: playlistPremiumQuery.data || [],
            isLoading: playlistPremiumQuery.isLoading,
            isError: playlistPremiumQuery.isError
        },
        recommended: {
            data: recommendedQuery.data?.data || [],
            isLoading: recommendedQuery.isLoading,
            isError: recommendedQuery.isError
        },
        isLoading: sliderQuery.isLoading || categoriesQuery.isLoading || playlistPremiumQuery.isLoading || recommendedQuery.isLoading,
        isError: sliderQuery.isError || categoriesQuery.isError || playlistPremiumQuery.isError || recommendedQuery.isError
    };
};
