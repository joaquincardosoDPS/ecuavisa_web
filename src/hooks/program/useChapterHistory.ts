import { useInfiniteQuery } from '@tanstack/react-query';
import { historyService } from '@/services/historyService';
import { useAuthStore } from '@/features/auth/authStore';
import type { HistoryItem } from '@/interfaces/history.interface';
import { useEffect } from 'react';

/**
 * Hook que carga todo el historial de reproducción de un programa
 * filtrado por segmento y temporada. Usa paginación infinita y
 * auto-fetch de todas las páginas disponibles para construir un
 * Map<slug, { time, end }> completo.
 */
export function useChapterHistory(
    programKey: string,
    segmentSlug: string | null,
    season: number | null,
) {
    const token = useAuthStore((s) => s.token);
    const activeProfile = useAuthStore((s) => s.activeProfile);

    const enabled = !!token && !!activeProfile && !!programKey && !!segmentSlug && season !== null;

    const historyQuery = useInfiniteQuery({
        queryKey: ['chapter-history', programKey, segmentSlug, season, token, activeProfile?.id],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await historyService.getAll({
                token: token!,
                profile: activeProfile!.id,
                program: programKey,
                segment: segmentSlug!,
                season: season!,
                page: pageParam,
            });
            return response;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage || !allPages) return undefined;
            const totalPages = lastPage.last_page || 0;
            return allPages.length < totalPages ? allPages.length + 1 : undefined;
        },
        enabled,
        staleTime: 0,
        refetchOnMount: 'always',
    });

    // Auto-fetch de todas las páginas del historial
    useEffect(() => {
        if (historyQuery.hasNextPage && !historyQuery.isFetchingNextPage) {
            historyQuery.fetchNextPage();
        }
    }, [historyQuery.hasNextPage, historyQuery.isFetchingNextPage, historyQuery.fetchNextPage]);

    // Construir el Map de historial por slug
    const allHistoryItems: HistoryItem[] =
        historyQuery.data?.pages?.flatMap((page) => page?.data || []) || [];

    const historyMap = new Map<string, { time: number; end: 0 | 1 }>();
    for (const item of allHistoryItems) {
        historyMap.set(item.slug, { time: item.time, end: item.end });
    }

    return {
        historyMap,
        isLoadingHistory: historyQuery.isLoading,
        /** True si aún se están cargando páginas adicionales del historial */
        isFetchingAllHistory: historyQuery.isFetchingNextPage || historyQuery.hasNextPage === true,
    };
}
