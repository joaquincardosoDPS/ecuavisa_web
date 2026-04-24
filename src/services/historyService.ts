import axios from 'axios';
import qs from 'qs';
import { RUDO_VOD_TIME, CLIENT } from '@/config-global';

interface SaveHistoryParams {
    /** Token del usuario autenticado */
    token: string;
    /** ID del perfil activo */
    profile: string;
    /** Slug del capítulo */
    vod: string;
    /** Tiempo de reproducción en segundos */
    time: number;
    /** 0 = no finalizado, 1 = finalizado */
    end?: 0 | 1;
}

export const historyService = {
    /**
     * Guarda/actualiza el progreso de reproducción de un capítulo.
     * POST application/x-www-form-urlencoded
     */
    saveProgress: async (params: SaveHistoryParams): Promise<void> => {
        try {
            await axios.post(
                RUDO_VOD_TIME,
                qs.stringify({
                    client: CLIENT,
                    token: params.token,
                    profile: params.profile,
                    vod: params.vod,
                    time: Math.floor(params.time),
                    ...(params.end !== undefined && { end: params.end }),
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );
        } catch (error) {
            console.warn('[HistoryService] Error saving progress:', error);
        }
    },
};
