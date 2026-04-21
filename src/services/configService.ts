import { CLIENT, RUDO_CONFIG } from "@/config-global";
import type { ApiConfigResponse } from "@/interfaces/config.interface";

export const fetchAppConfig = async (): Promise<ApiConfigResponse> => {
    const formData = new URLSearchParams();
    formData.append('client', CLIENT);
    const response = await fetch(RUDO_CONFIG, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
    });
    if (!response.ok) {
        throw new Error('Error al cargar la configuración desde Rudo');
    }
    return response.json();
};