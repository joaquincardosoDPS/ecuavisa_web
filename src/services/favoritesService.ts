import axios from 'axios';
import qs from 'qs';
import { RUDO_FAVORITES_ALL, RUDO_FAVORITES_ADD, RUDO_FAVORITES_VALIDATE, RUDO_FAVORITES_DELETE, CLIENT } from '@/config-global';
import type { FavoritesResponse, FavoriteValidateResponse } from '@/interfaces/favorites.interface';
import type { ProfileMutationResponse } from '@/interfaces/profile.interface';

export const favoritesService = {
    /**
     * Obtiene todos los favoritos de un perfil.
     */
    getAll: async (
        token: string,
        profileId: string,
        page = 1,
        limit = 50,
    ): Promise<FavoritesResponse> => {
        const { data } = await axios.post<FavoritesResponse>(
            RUDO_FAVORITES_ALL,
            qs.stringify({ client: CLIENT, token, profile: profileId, page, limit }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return data;
    },

    /**
     * Agrega un programa a favoritos.
     */
    add: async (token: string, profileId: string, programSlug: string): Promise<ProfileMutationResponse> => {
        const { data } = await axios.post<ProfileMutationResponse>(
            RUDO_FAVORITES_ADD,
            qs.stringify({ client: CLIENT, token, profile: profileId, program: programSlug }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return data;
    },

    /**
     * Valida si un programa está en favoritos.
     * Retorna true si el programa existe en la lista.
     */
    validate: async (token: string, profileId: string, programSlug: string): Promise<FavoriteValidateResponse> => {
        const { data } = await axios.post<FavoriteValidateResponse>(
            RUDO_FAVORITES_VALIDATE,
            qs.stringify({ client: CLIENT, token, profile: profileId, program: programSlug }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return data;
    },

    /**
     * Elimina un programa de favoritos.
     */
    delete: async (token: string, profileId: string, programSlug: string): Promise<ProfileMutationResponse> => {
        const { data } = await axios.post<ProfileMutationResponse>(
            RUDO_FAVORITES_DELETE,
            qs.stringify({ client: CLIENT, token, profile: profileId, program: programSlug }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return data;
    },
};
