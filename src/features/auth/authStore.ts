import { create } from 'zustand';
import { authService } from '@/services/authService';
import type { Profile } from '@/interfaces/profile.interface';

interface AuthUser {
    id: string;
    email: string;
    name: string;
    token: string;
    [key: string]: unknown;
}

interface AuthState {
    /** Usuario autenticado (null = no logueado) */
    user: AuthUser | null;
    /** Token de sesión */
    token: string | null;
    /** Perfil activo seleccionado */
    activeProfile: Profile | null;
    /** Si el usuario está autenticado */
    isAuthenticated: boolean;
    /** Si se está validando la sesión */
    isValidating: boolean;
    /** Guardar sesión tras login exitoso */
    login: (token: string, userData?: Record<string, unknown>) => void;
    /** Cerrar sesión */
    logout: () => void;
    /** Seleccionar perfil activo */
    setActiveProfile: (profile: Profile) => void;
    /** Validar sesión contra la API */
    validateSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
    // Restaurar sesión desde localStorage al iniciar
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    const storedProfile = localStorage.getItem('active_profile');

    return {
        user: storedUser ? JSON.parse(storedUser) : null,
        token: storedToken,
        activeProfile: storedProfile ? JSON.parse(storedProfile) : null,
        isAuthenticated: !!storedToken,
        isValidating: false,

        login: (token, userData) => {
            const user = { token, ...userData } as AuthUser;
            localStorage.setItem('auth_token', token);
            localStorage.setItem('auth_user', JSON.stringify(user));
            set({ user, token, isAuthenticated: true });
        },

        logout: () => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            localStorage.removeItem('active_profile');
            set({ user: null, token: null, activeProfile: null, isAuthenticated: false });
        },

        setActiveProfile: (profile) => {
            localStorage.setItem('active_profile', JSON.stringify(profile));
            set({ activeProfile: profile });
        },

        validateSession: async () => {
            const { token } = get();
            if (!token) {
                set({ isAuthenticated: false, user: null, token: null });
                return;
            }

            set({ isValidating: true });

            try {
                const response = await authService.validateSession(token);

                if (response.status === 'error') {
                    console.warn('[Auth] Session invalid, logging out');
                    get().logout();
                    return;
                }

                // Sesión válida: actualizar datos del usuario (puede haber cambios)
                const user = { ...response.user, token: response.user?.token || token } as AuthUser;
                localStorage.setItem('auth_user', JSON.stringify(user));
                set({ user, token: user.token, isAuthenticated: true });
                console.log('[Auth] Session validated');
            } catch (error) {
                console.warn('[Auth] Session validation failed, logging out', error);
                get().logout();
            } finally {
                set({ isValidating: false });
            }
        },
    };
});
