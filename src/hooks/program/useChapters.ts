import { useInfiniteQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalogService';
import { useChapterHistory } from './useChapterHistory';
import type { ChapterWithHistory } from '@/interfaces/catalog.interface';

export const useChapters = (slug: string, season: number | null, segmentSlug: string | null) => {
    const chaptersQuery = useInfiniteQuery({
        queryKey: ['chapters', slug, season, segmentSlug],
        queryFn: ({ pageParam = 1 }) => catalogService.getChapters({
            program: slug,
            ...(season !== null ? { season } : {}),
            segment: segmentSlug!,
            page: pageParam,
            // order_type: "desc",
        }),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage || !allPages) return undefined;
            const totalPages = lastPage.last_page || 0;
            return allPages.length < totalPages ? allPages.length + 1 : undefined;
        },
        enabled: !!slug && !!segmentSlug,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Cargar historial en paralelo (usa su propia paginación independiente)
    const { historyMap, isLoadingHistory } = useChapterHistory(slug, segmentSlug, season);

    // Enriquecer capítulos con datos del historial
    const rawChapters = chaptersQuery.data?.pages?.flatMap((page) => page?.data || []) || [];

    const chaptersWithHistory: ChapterWithHistory[] = rawChapters.map((chapter) => {
        const history = historyMap.get(chapter.slug);
        return {
            ...chapter,
            playbackTime: history?.time ?? 0,
            isFinished: history?.end === 1,
        };
    });

    return {
        chapters: chaptersQuery.data,
        chaptersWithHistory,
        fetchNextPage: chaptersQuery.fetchNextPage,
        hasNextPage: chaptersQuery.hasNextPage,
        isFetchingNextPage: chaptersQuery.isFetchingNextPage,
        isLoading: chaptersQuery.isLoading,
        isLoadingHistory,
        isError: chaptersQuery.isError,
    };
};
