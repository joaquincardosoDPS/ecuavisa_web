import api from './api';
import { RUDO_EVENT_ALL, RUDO_EVENT_GET } from "@/config-global";
import type { EventResponse, EventsResponse } from "@/interfaces/catalog.interface";

export const eventService = {
    getAll: async (options?: {
        page?: number;
        limit?: number;
        category?: string;
        type?: "live" | "program";
        search?: string;
        slug_exclude?: string;
    }): Promise<EventsResponse> => {
        const { data } = await api.post<EventsResponse>(RUDO_EVENT_ALL, { ...options });
        return data;
    },

    getEvent: async (event: string): Promise<EventResponse> => {
        const { data } = await api.post<EventResponse>(RUDO_EVENT_GET, { event });
        return data;
    },
};