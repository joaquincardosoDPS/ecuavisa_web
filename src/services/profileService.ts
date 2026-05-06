import api from './api';
import { RUDO_PROFILE, RUDO_PROFILE_AVATAR, RUDO_PROFILE_CREATE, RUDO_PROFILE_UPDATE, RUDO_PROFILE_DELETE } from '@/config-global';
import type { ProfilesResponse, AvatarsResponse, ProfileMutationResponse } from '@/interfaces/profile.interface';

export const profileService = {
    /**
     * Obtiene todos los perfiles del usuario autenticado.
     */
    getAll: async (token: string): Promise<ProfilesResponse> => {
        const { data } = await api.post<ProfilesResponse>(RUDO_PROFILE, { token });
        return data;
    },

    /**
     * Obtiene todos los avatares disponibles.
     */
    getAvatars: async (): Promise<AvatarsResponse> => {
        const { data } = await api.post<AvatarsResponse>(RUDO_PROFILE_AVATAR, {});
        return data;
    },

    /**
     * Crea un nuevo perfil.
     */
    create: async (token: string, name_perfil: string, avatar: string | null): Promise<ProfileMutationResponse> => {
        const { data } = await api.post<ProfileMutationResponse>(RUDO_PROFILE_CREATE, {
            token, name_perfil, avatar: avatar ?? '',
        });
        return data;
    },

    /**
     * Actualiza un perfil existente.
     */
    update: async (token: string, id: string, name_perfil: string, avatar: string | null): Promise<ProfileMutationResponse> => {
        const { data } = await api.post<ProfileMutationResponse>(RUDO_PROFILE_UPDATE, {
            token, id, name_perfil, avatar: avatar ?? null,
        });
        return data;
    },

    /**
     * Elimina un perfil. No se puede eliminar el perfil por defecto.
     */
    delete: async (token: string, id: string): Promise<ProfileMutationResponse> => {
        const { data } = await api.post<ProfileMutationResponse>(RUDO_PROFILE_DELETE, { token, id });
        return data;
    },
};
