import axios from 'axios';
import qs from 'qs';
import {
    RUDO_VOD_BANNER,
    RUDO_VOD_CATEGORY,
    RUDO_PLAYLIST_PREMIUM_URL,
    RUDO_VOD_FEATURED,
    RUDO_VOD_SEARCH,
    RUDO_VOD_DETAIL,
    RUDO_VOD_CHAPTERS,
    RUDO_VOD_NEXT_CHAPTER,
    CLIENT,
    RUDO_PLAYLIST_GLOBAL_EPG_URL
} from '@/config-global';
import type {
    SliderResponse,
    CategoriesResponse,
    PlaylistPremiumResponse,
    RecommendedProgramsResponse,
    ProgramDetailResponse,
    ChaptersResponse,
    Chapter,
    EPGChannel,
} from '@/interfaces/catalog.interface';

export const catalogService = {
    getSlider: async (): Promise<SliderResponse> => {
        const { data } = await axios.post<SliderResponse>(
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

    getCategories: async (options?: {
        page?: number;
        limit?: number;
        limit_prog?: number;
        type?: 0 | 1;
        show_event?: boolean;
        show_ranking?: boolean;
    }): Promise<CategoriesResponse> => {
        const { data } = await axios.post<CategoriesResponse>(
            `${RUDO_VOD_CATEGORY}`,
            qs.stringify({
                ...options,
                client: CLIENT,
            }),
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

    getChannelList: async (): Promise<EPGChannel[]> => {
        const { data } = await axios.get<EPGChannel[]>(`${RUDO_PLAYLIST_GLOBAL_EPG_URL}?random=${Math.random()}`);
        return data;
    },

    getRecommendedPrograms: async (): Promise<RecommendedProgramsResponse> => {
        const { data } = await axios.post<RecommendedProgramsResponse>(
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

    searchPrograms: async (options: {
        search?: string;
        category?: string;
        genders?: string;
        slug_exclude?: string;
        page?: number;
    } = {}): Promise<RecommendedProgramsResponse> => {
        const { data } = await axios.post<RecommendedProgramsResponse>(
            `${RUDO_VOD_SEARCH}`,
            qs.stringify({ client: CLIENT, ...options }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );
        return data;
    },

    getProgramDetail: async (slug: string): Promise<ProgramDetailResponse> => {
        const { data } = await axios.post<ProgramDetailResponse>(
            `${RUDO_VOD_DETAIL}`,
            qs.stringify({ client: CLIENT, program: slug }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );
        return data;
    },

    getChapters: async (options: {
        program: string;
        limit?: number;
        season?: number;
        segment?: string;
        page?: number;
        no_segments?: boolean;
    }): Promise<ChaptersResponse> => {
        const { data } = await axios.post<ChaptersResponse>(
            `${RUDO_VOD_CHAPTERS}`,
            qs.stringify({
                client: CLIENT,
                ...options,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );
        return data;
    },

    /**
     * Obtiene la data completa de un capítulo por su slug.
     * Incluye m3u8, key, título, etc.
     */
    getChapterBySlug: async (segment: string, season: number, chapter: number): Promise<{ status: string; code: number; data: Chapter }> => {
        const { data } = await axios.post<{ status: string; code: number; data: Chapter }>(
            `${RUDO_VOD_NEXT_CHAPTER}`,
            qs.stringify({ client: CLIENT, segment, season, chapter }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );
        return data;
    },

};
