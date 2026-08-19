import { useQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalogService';
import type { LiveSignal } from '@/interfaces/catalog.interface';

/**
 * Señales en vivo desde RUDO_CHANNELS_URL (rudo.video/channels/{client}/list.json).
 * Devuelve el array de señales directamente y comparte la misma caché entre
 * el grid del home y la vista /live.
 */
export const useLiveChannels = () =>
    useQuery<LiveSignal[]>({
        queryKey: ['home', 'live-playlist'],
        queryFn: async () => {
            const res = await catalogService.getPlaylist();
            return res?.data || [];
        },
        staleTime: 1000 * 60 * 5,
    });
