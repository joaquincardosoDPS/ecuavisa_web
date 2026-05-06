import api from './api';
import { RUDO_REGISTER, RUDO_LOGIN, RUDO_SESSION } from '@/config-global';

interface RegisterParams {
    name: string;
    email: string;
    password: string;
}

interface LoginParams {
    email: string;
    password: string;
}

interface AuthResponse {
    status: string;
    code: number;
    /** La API usa "msj" para mensajes de error/éxito */
    msj?: string;
    user?: {
        id: string;
        email: string;
        name: string;
        last_name?: string | null;
        token: string;
        pay_status?: boolean;
        [key: string]: unknown;
    };
}

export const authService = {
    /**
     * Registra un nuevo usuario.
     */
    register: async (params: RegisterParams): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>(RUDO_REGISTER, {
            device: 'web',
            name: params.name,
            email: params.email,
            password: params.password,
        });
        return data;
    },

    /**
     * Inicia sesión de un usuario existente.
     */
    login: async (params: LoginParams): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>(RUDO_LOGIN, {
            device: 'web',
            email: params.email,
            password: params.password,
        });
        return data;
    },

    /**
     * Valida la sesión activa del usuario.
     */
    validateSession: async (token: string): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>(RUDO_SESSION, {
            device: 'web',
            token,
        });
        return data;
    },
};
