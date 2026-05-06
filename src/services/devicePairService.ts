import api from './api';
import { RUDO_DEVICE_PAIR_URL } from '@/config-global';

interface DevicePairResponse {
    status: 'ok' | 'error';
    code: number;
    msj: string;
}

export const devicePairService = {
    /**
     * Vincula un dispositivo TV usando el código que aparece en pantalla.
     */
    pair: async (token: string, code_tv: string): Promise<DevicePairResponse> => {
        const { data } = await api.post<DevicePairResponse>(RUDO_DEVICE_PAIR_URL, {
            token,
            code_tv,
        });
        return data;
    },
};
