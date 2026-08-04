import api from './api';
import qs from 'qs';
import { RUDO_VOD_TIME, RUDO_VOD_HISTORY, RUDO_VOD_TIME_LINE } from '@/config-global';
import type { HistoryResponse, HistoryTimelineResponse, SaveHistoryParams, GetHistoryParams } from '@/interfaces/history.interface';

export const historyService = {
    /**
     * Obtiene el historial de reproducción de un perfil.
     */
    getAll: async (params: GetHistoryParams): Promise<HistoryResponse> => {
        const { data } = await api.post<HistoryResponse>(RUDO_VOD_HISTORY, {
            token: params.token,
            profile: params.profile,
            ...(params.program && { program: params.program }),
            ...(params.segment && { segment: params.segment }),
            ...(params.season !== undefined && { season: params.season }),
            ...(params.page && { page: params.page }),
            ...(params.limit && { limit: params.limit }),
            ...(params.end !== undefined && { end: params.end }),
        });
        return data;
    },

    /**
     * Guarda/actualiza el progreso de reproducción de un capítulo.
     */
    saveProgress: async (params: SaveHistoryParams): Promise<void> => {
        try {
            await api.post(RUDO_VOD_TIME, {
                token: params.token,
                profile: params.profile,
                vod: params.vod,
                time: Math.floor(params.time),
                ...(params.end !== undefined && { end: params.end }),
            });
        } catch (error) {
            console.warn('[HistoryService] Error saving progress:', error);
        }
    },

    /**
     * Obtiene el progreso de reproducción de capítulos específicos.
     */
    getTimeline: async (token: string, profileId: string, vodSlugs: string[]): Promise<HistoryTimelineResponse> => {
        const { data } = await api.post<HistoryTimelineResponse>(
            RUDO_VOD_TIME_LINE,
            qs.stringify({
                token,
                profile: profileId,
                vod_slugs: vodSlugs,
            }, { arrayFormat: 'brackets' }),
        );
        return data;
    },
};
