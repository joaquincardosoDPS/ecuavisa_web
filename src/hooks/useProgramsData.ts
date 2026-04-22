import { useQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalogService';

export const useProgramsData = () => {
    const categoriesQuery = useQuery({
        queryKey: ['programs', 'categories'],
        queryFn: () => catalogService.getCategories(),
        staleTime: 1000 * 60 * 5,
    });


    return {

        categories: categoriesQuery.data?.data || [],
        isLoading: categoriesQuery.isLoading,
        isError: categoriesQuery.isError
    };
};
