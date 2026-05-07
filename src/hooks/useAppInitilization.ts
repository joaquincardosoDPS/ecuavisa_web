// src/hooks/useAppInitilization.ts
import { useQuery } from '@tanstack/react-query';
import { fetchAppConfig } from '../services/configService';
import { useConfigStore } from '../features/config/useConfigStore';
import { useAuthStore } from '../features/auth/authStore';
import { useEffect, useRef } from 'react';

export const useAppInitialization = () => {
    const setConfig = useConfigStore((state) => state.setConfig);
    const sessionChecked = useRef(false);

    const query = useQuery({
        queryKey: ['app-config'],
        queryFn: fetchAppConfig,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (query.data?.data) {
            const configData = query.data.data;
            setConfig(configData);

            // Título del sitio
            if (configData.name) {
                document.title = configData.name;
            }


            // Injecta variables CSS dinámicamente
            const root = document.documentElement;

            Object.entries(configData).forEach(([key, value]) => {
                // Filtra solo las propiedades de estilo
                if (
                    key.startsWith('clr-') ||
                    key.startsWith('foc-') ||
                    key.startsWith('grad-')
                ) {
                    root.style.setProperty(`--${key}`, value as string);
                }
            });

            // Validar sesión una vez al cargar la app
            if (!sessionChecked.current) {
                sessionChecked.current = true;
                const { token, validateSession } = useAuthStore.getState();
                if (token) {
                    validateSession();
                }
            }
        }
    }, [query.data, setConfig]);

    return query;
};

