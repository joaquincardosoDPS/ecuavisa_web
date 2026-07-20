import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalogService';
import { historyService } from '@/services/historyService';
import { useAuthStore } from '@/features/auth/authStore';

export const useHomeData = () => {
    const token = useAuthStore((s) => s.token);
    const activeProfile = useAuthStore((s) => s.activeProfile);

    const sliderQuery = useQuery({
        queryKey: ['home', 'slider'],
        queryFn: () => catalogService.getSlider(),
        staleTime: 1000 * 60 * 5,
    });

    const categoriesQuery = useInfiniteQuery({
        queryKey: ['home', 'categories'],
        queryFn: ({ pageParam }) => catalogService.getCategories({ page: pageParam, show_event: true, show_ranking: true }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            if (lastPageParam < lastPage.last_page) return lastPageParam + 1;
            return undefined;
        },
        staleTime: 1000 * 60 * 5,
    });

    const playlistPremiumQuery = useQuery({
        queryKey: ['home', 'playlist-premium'],
        queryFn: () => catalogService.getPlaylistPremium(),
        staleTime: 1000 * 60 * 5,
    });

    const liveSignalsQuery = useQuery({
        queryKey: ['home', 'live-signals'],
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
        staleTime: 1000 * 60 * 2,
        enabled: !!token && !!activeProfile,
    });

    const categories = categoriesQuery.data?.pages.flatMap((page) => page.data) ?? [];

    return {
        slider: sliderQuery.data?.data || [],
        categories,
        playlistPremium: playlistPremiumQuery.data?.data || [],
        recommended: recommendedQuery.data?.data || [],
        liveSignals: liveSignalsQuery.data?.data || [],
        continueWatching: continueWatchingQuery.data?.data || [],
        isLoading: sliderQuery.isLoading || categoriesQuery.isLoading || playlistPremiumQuery.isLoading || recommendedQuery.isLoading,
        isError: sliderQuery.isError || categoriesQuery.isError || playlistPremiumQuery.isError || recommendedQuery.isError,
        fetchNextPage: categoriesQuery.fetchNextPage,
        hasNextPage: categoriesQuery.hasNextPage,
        isFetchingNextPage: categoriesQuery.isFetchingNextPage,
    };
};
