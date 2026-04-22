import { useInfiniteQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalogService';

export const useChapters = (slug: string, season: number | null, segmentSlug: string | null) => {
    const chaptersQuery = useInfiniteQuery({
        queryKey: ['chapters', slug, season, segmentSlug],
        queryFn: ({ pageParam = 1 }) => catalogService.getChapters(slug, season!, segmentSlug!, pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage || !allPages) return undefined;
            const totalPages = lastPage.last_page || 0;
            return allPages.length < totalPages ? allPages.length + 1 : undefined;
        },
        enabled: !!slug && season !== null && !!segmentSlug,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        chapters: chaptersQuery.data,
        fetchNextPage: chaptersQuery.fetchNextPage,
        hasNextPage: chaptersQuery.hasNextPage,
        isFetchingNextPage: chaptersQuery.isFetchingNextPage,
        isLoading: chaptersQuery.isLoading,
        isError: chaptersQuery.isError
    }

};
