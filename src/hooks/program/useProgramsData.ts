import { useInfiniteQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalogService';

export const useProgramsData = () => {
    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['programs', 'categories'],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await catalogService.getCategories({
                limit: 10,
                page: pageParam,
                show_event: false,
                show_ranking: false
            });
            if (res.status === 'error' || !res.data) {
                throw new Error(res.msj || 'Error fetching categories');
            }
            return res;
        },
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length + 1;
            // Forzamos el intento de carga de la siguiente página si la actual tiene datos
            // o si last_page nos lo indica.
            const hasMore = lastPage.last_page ? nextPage <= lastPage.last_page : (lastPage.data?.length || 0) > 0;
            return hasMore ? nextPage : undefined;
        },
        initialPageParam: 1,
        staleTime: 1000 * 60 * 5,
    });

    const categories = data?.pages.flatMap(page => page.data || []) || [];

    return {
        categories,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        lastPageInfo: data?.pages[data.pages.length - 1]?.last_page
    };
};
