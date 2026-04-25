import axios from 'axios';
import qs from 'qs';
import { RUDO_VOD_TIME, RUDO_VOD_HISTORY, RUDO_VOD_TIME_LINE, CLIENT } from '@/config-global';
import type { HistoryResponse, HistoryTimelineResponse, SaveHistoryParams, GetHistoryParams } from '@/interfaces/history.interface';

export const historyService = {
    /**
     * Obtiene el historial de reproducción de un perfil.
     */
    getAll: async (params: GetHistoryParams): Promise<HistoryResponse> => {
        const { data } = await axios.post<HistoryResponse>(
            RUDO_VOD_HISTORY,
            qs.stringify({
                client: CLIENT,
                token: params.token,
                profile: params.profile,
                ...(params.program && { program: params.program }),
                ...(params.page && { page: params.page }),
                ...(params.limit && { limit: params.limit }),
                ...(params.end !== undefined && { end: params.end }),
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return data;
    },

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

    /**
     * Obtiene el progreso de reproducción de capítulos específicos.
     */
    getTimeline: async (token: string, profileId: string, vodSlugs: string[]): Promise<HistoryTimelineResponse> => {
        const { data } = await axios.post<HistoryTimelineResponse>(
            RUDO_VOD_TIME_LINE,
            qs.stringify({
                client: CLIENT,
                token,
                profile: profileId,
                vod_slugs: vodSlugs,
            }, { arrayFormat: 'brackets' }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return data;
    },
};

