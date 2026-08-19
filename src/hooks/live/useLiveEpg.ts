import { useQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalogService';
import type { EPGChannel } from '@/interfaces/catalog.interface';

/**
 * EPG global: programa actual en cada señal (RUDO_PLAYLIST_GLOBAL_EPG_URL).
 * Comparte la misma caché entre el grid del home y la vista /live.
 */
export const useLiveEpg = () =>
    useQuery<EPGChannel[]>({
        queryKey: ['live', 'epg'],
        queryFn: () => catalogService.getChannelList(),
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60,
    });
