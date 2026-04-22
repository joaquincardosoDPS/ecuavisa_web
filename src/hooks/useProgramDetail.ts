import { useQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalogService';

export const useProgramDetail = (slug: string) => {
    const programQuery = useQuery({
        queryKey: ['programDetail', slug],
        queryFn: () => catalogService.getProgramDetail(slug),
        enabled: !!slug, // Solo ejecuta si hay un slug válido
        staleTime: 1000 * 60 * 5, // 5 minutos de caché
    });

    return {
        data: programQuery.data?.data,
        isLoading: programQuery.isLoading,
        isError: programQuery.isError
    }
};
