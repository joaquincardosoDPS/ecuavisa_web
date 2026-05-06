import api from './api';
import type { ApiConfigResponse } from "@/interfaces/config.interface";
import { RUDO_CONFIG } from "@/config-global";

export const fetchAppConfig = async (): Promise<ApiConfigResponse> => {
    const { data } = await api.post<ApiConfigResponse>(RUDO_CONFIG, {});
    return data;
};