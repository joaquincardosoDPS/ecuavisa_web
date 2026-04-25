import axios from 'axios';
import qs from 'qs';
import { RUDO_PROFILE, RUDO_PROFILE_AVATAR, RUDO_PROFILE_CREATE, RUDO_PROFILE_UPDATE, RUDO_PROFILE_DELETE, CLIENT } from '@/config-global';
import type { ProfilesResponse, AvatarsResponse, ProfileMutationResponse } from '@/interfaces/profile.interface';

export const profileService = {
    /**
     * Obtiene todos los perfiles del usuario autenticado.
     */
    getAll: async (token: string): Promise<ProfilesResponse> => {
        const { data } = await axios.post<ProfilesResponse>(
            RUDO_PROFILE,
            qs.stringify({ client: CLIENT, token }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return data;
    },

    /**
     * Obtiene todos los avatares disponibles.
     */
    getAvatars: async (): Promise<AvatarsResponse> => {
        const { data } = await axios.post<AvatarsResponse>(
            RUDO_PROFILE_AVATAR,
            qs.stringify({ client: CLIENT }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return data;
    },

    /**
     * Crea un nuevo perfil.
     */
    create: async (token: string, name_perfil: string, avatar: string | null): Promise<ProfileMutationResponse> => {
        const { data } = await axios.post<ProfileMutationResponse>(
            RUDO_PROFILE_CREATE,
            qs.stringify({ client: CLIENT, token, name_perfil, avatar: avatar ?? '' }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return data;
    },

    /**
     * Actualiza un perfil existente.
     */
    update: async (token: string, id: string, name_perfil: string, avatar: string | null): Promise<ProfileMutationResponse> => {
        const { data } = await axios.post<ProfileMutationResponse>(
            RUDO_PROFILE_UPDATE,
            qs.stringify({ client: CLIENT, token, id, name_perfil, avatar: avatar ?? null }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return data;
    },

    /**
     * Elimina un perfil. No se puede eliminar el perfil por defecto.
     */
    delete: async (token: string, id: string): Promise<ProfileMutationResponse> => {
        const { data } = await axios.post<ProfileMutationResponse>(
            RUDO_PROFILE_DELETE,
            qs.stringify({ client: CLIENT, token, id }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return data;
    },
};
