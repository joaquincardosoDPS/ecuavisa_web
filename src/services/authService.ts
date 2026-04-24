import axios from 'axios';
import qs from 'qs';
import { RUDO_REGISTER, RUDO_LOGIN, RUDO_SESSION, CLIENT } from '@/config-global';

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
     * POST application/x-www-form-urlencoded
     */
    register: async (params: RegisterParams): Promise<AuthResponse> => {
        const { data } = await axios.post<AuthResponse>(
            RUDO_REGISTER,
            qs.stringify({
                client: CLIENT,
                device: 'web',
                name: params.name,
                email: params.email,
                password: params.password,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return data;
    },

    /**
     * Inicia sesión de un usuario existente.
     * POST application/x-www-form-urlencoded
     */
    login: async (params: LoginParams): Promise<AuthResponse> => {
        const { data } = await axios.post<AuthResponse>(
            RUDO_LOGIN,
            qs.stringify({
                client: CLIENT,
                device: 'web',
                email: params.email,
                password: params.password,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return data;
    },

    /**
     * Valida la sesión activa del usuario.
     * POST application/x-www-form-urlencoded
     */
    validateSession: async (token: string): Promise<AuthResponse> => {
        const { data } = await axios.post<AuthResponse>(
            RUDO_SESSION,
            qs.stringify({
                client: CLIENT,
                device: 'web',
                token,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return data;
    },
};
