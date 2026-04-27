import { CLIENT, RUDO_EVENT_ALL, RUDO_EVENT_GET } from "@/config-global";
import type { EventsResponse } from "@/interfaces/catalog.interface";
import axios from "axios";
import qs from 'qs';

export const eventService = {
    getAll: async (options?: {
        page?: number;
        limit?: number;
        category?: string;
        type?: "live" | "program";
        search?: string;
        slug_exclude?: string;
    }): Promise<EventsResponse> => {
        const { data } = await axios.post<EventsResponse>(
            `${RUDO_EVENT_ALL}`,
            qs.stringify({
                client: CLIENT,
                ...options
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })
        return data
    },
    getEvent: async (event: string): Promise<EventsResponse> => {
        const { data } = await axios.post<EventsResponse>(
            `${RUDO_EVENT_GET}`,
            qs.stringify({
                client: CLIENT,
                event
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })
        return data
    }
}