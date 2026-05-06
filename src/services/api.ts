import axios from 'axios';
import qs from 'qs';
import { CLIENT } from '@/config-global';

/**
 * Instancia de Axios preconfigurada para la API de Rudo.
 * - Inyecta `client` y `_t` (cache-buster) automáticamente en cada POST.
 * - Serializa el body como `application/x-www-form-urlencoded`.
 */
const api = axios.create({
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
});

// Interceptor: inyecta client + cache-buster en cada POST
api.interceptors.request.use((config) => {
    if (config.method === 'post' && config.data) {
        // Parse existing body, add client + _t, re-serialize
        const parsed = typeof config.data === 'string'
            ? qs.parse(config.data)
            : config.data;

        config.data = qs.stringify({
            client: CLIENT,
            _t: Date.now(),
            ...parsed,
        });
    }
    return config;
});

export default api;
