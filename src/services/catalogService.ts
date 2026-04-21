import axios from 'axios';
import qs from 'qs';
import {
    RUDO_VOD_BANNER,
    RUDO_VOD_CATEGORY,
    RUDO_PLAYLIST_PREMIUM_URL,
    RUDO_VOD_FEATURED,
    RUDO_VOD_SEARCH,
    CLIENT
} from '@/config-global';
import type {
    SliderResponse,
    CategoriesResponse,
    PlaylistPremiumResponse,
    RecommendedProgramsResponse,
} from '@/interfaces/catalog.interface';

export const catalogService = {
    getSlider: async (): Promise<SliderResponse> => {
        const { data } = await axios.post(
            `${RUDO_VOD_BANNER}`,
            qs.stringify({ client: CLIENT }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );
        return data;
    },

    getCategories: async (): Promise<CategoriesResponse> => {
        const { data } = await axios.post(
            `${RUDO_VOD_CATEGORY}`,
            qs.stringify({ client: CLIENT }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );
        return data;
    },

    getPlaylistPremium: async (): Promise<PlaylistPremiumResponse> => {
        const { data } = await axios.get(`${RUDO_PLAYLIST_PREMIUM_URL}?random=${Math.random()}`);
        return data;
    },

    getRecommendedPrograms: async (): Promise<RecommendedProgramsResponse> => {
        const { data } = await axios.post(
            `${RUDO_VOD_FEATURED}`,
            qs.stringify({ client: CLIENT }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );
        return data;
    },

    searchPrograms: async (query: string): Promise<RecommendedProgramsResponse> => {
        const { data } = await axios.post(
            `${RUDO_VOD_SEARCH}`,
            qs.stringify({ client: CLIENT, search: query }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );
        return data;
    }
};
