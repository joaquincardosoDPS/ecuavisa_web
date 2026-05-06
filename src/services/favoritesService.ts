import api from './api';
import { RUDO_FAVORITES_ALL, RUDO_FAVORITES_ADD, RUDO_FAVORITES_VALIDATE, RUDO_FAVORITES_DELETE } from '@/config-global';
import type { FavoritesResponse, FavoriteValidateResponse } from '@/interfaces/favorites.interface';
import type { ProfileMutationResponse } from '@/interfaces/profile.interface';

export const favoritesService = {
    /**
     * Obtiene todos los favoritos de un perfil.
     */
    getAll: async (token: string, profileId: string, page = 1, limit = 50): Promise<FavoritesResponse> => {
        const { data } = await api.post<FavoritesResponse>(RUDO_FAVORITES_ALL, {
            token, profile: profileId, page, limit,
        });
        return data;
    },

    /**
     * Agrega un programa a favoritos.
     */
    add: async (token: string, profileId: string, programSlug: string): Promise<ProfileMutationResponse> => {
        const { data } = await api.post<ProfileMutationResponse>(RUDO_FAVORITES_ADD, {
            token, profile: profileId, program: programSlug,
        });
        return data;
    },

    /**
     * Valida si un programa está en favoritos.
     * Retorna true si el programa existe en la lista.
     */
    validate: async (token: string, profileId: string, programSlug: string): Promise<FavoriteValidateResponse> => {
        const { data } = await api.post<FavoriteValidateResponse>(RUDO_FAVORITES_VALIDATE, {
            token, profile: profileId, program: programSlug,
        });
        return data;
    },

    /**
     * Elimina un programa de favoritos.
     */
    delete: async (token: string, profileId: string, programSlug: string): Promise<ProfileMutationResponse> => {
        const { data } = await api.post<ProfileMutationResponse>(RUDO_FAVORITES_DELETE, {
            token, profile: profileId, program: programSlug,
        });
        return data;
    },
};
