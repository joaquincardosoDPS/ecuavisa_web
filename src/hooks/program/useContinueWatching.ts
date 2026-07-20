import { useQuery } from '@tanstack/react-query';
import { historyService } from '@/services/historyService';
import { useAuthStore } from '@/features/auth/authStore';
import type { HistoryItem } from '@/interfaces/history.interface';

interface ContinueWatchingResult {
    /** El item del historial sin terminar (o null si no existe) */
    item: HistoryItem | null;
    /** Si está cargando la consulta */
    isLoading: boolean;
}

/**
 * Hook que consulta si hay un capítulo sin terminar ("Seguir viendo")
 * para un programa específico. Usa el parámetro `program` del historyService
 * (key_program) para filtrar, y `end: 0` para obtener solo los no finalizados.
 */
export function useContinueWatching(programKey: string): ContinueWatchingResult {
    const token = useAuthStore((s) => s.token);
    const activeProfile = useAuthStore((s) => s.activeProfile);

    const enabled = !!token && !!activeProfile && !!programKey;

    const { data, isLoading } = useQuery({
        queryKey: ['continue-watching', programKey, token, activeProfile?.id],
        queryFn: async () => {
            const response = await historyService.getAll({
                token: token!,
                profile: activeProfile!.id,
                program: programKey,
                end: 0,
                limit: 1,
            });
            return response.data || [];
        },
        enabled,
        staleTime: 1000 * 60 * 2, // 2 minutos
    });

    return {
        item: data && data.length > 0 ? data[0] : null,
        isLoading,
    };
}
