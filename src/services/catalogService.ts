import api from './api';
import {
    RUDO_VOD_BANNER,
    RUDO_VOD_CATEGORY,
    RUDO_PLAYLIST_PREMIUM_URL,
    RUDO_VOD_FEATURED,
    RUDO_VOD_SEARCH,
    RUDO_VOD_DETAIL,
    RUDO_VOD_CHAPTERS,
    RUDO_VOD_NEXT_CHAPTER,
    RUDO_PLAYLIST_GLOBAL_EPG_URL
} from '@/config-global';
import type {
    SliderResponse,
    CategoriesResponse,
    PlaylistPremiumResponse,
    RecommendedProgramsResponse,
    ProgramDetailResponse,
    ChaptersResponse,
    ChapterDetailResponse,
    EPGChannel,
} from '@/interfaces/catalog.interface';

export const catalogService = {
    getSlider: async (): Promise<SliderResponse> => {
        const { data } = await api.post<SliderResponse>(RUDO_VOD_BANNER, {});
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
        const { data } = await api.post<CategoriesResponse>(RUDO_VOD_CATEGORY, { ...options });
        return data;
    },

    getPlaylistPremium: async (): Promise<PlaylistPremiumResponse> => {
        const { data } = await api.get(`${RUDO_PLAYLIST_PREMIUM_URL}?random=${Math.random()}`);
        return data;
    },

    getChannelList: async (): Promise<EPGChannel[]> => {
        const { data } = await api.get<EPGChannel[]>(`${RUDO_PLAYLIST_GLOBAL_EPG_URL}?random=${Math.random()}`);
        return data;
    },

    getRecommendedPrograms: async (options?: {
        page?: number;
        limit?: number;
    }): Promise<RecommendedProgramsResponse> => {
        const { data } = await api.post<RecommendedProgramsResponse>(RUDO_VOD_FEATURED, { ...options });
        return data;
    },

    searchPrograms: async (options: {
        search?: string;
        category?: string;
        genders?: string;
        slug_exclude?: string;
        page?: number;
        limit?: number;
    } = {}): Promise<RecommendedProgramsResponse> => {
        const { data } = await api.post<RecommendedProgramsResponse>(RUDO_VOD_SEARCH, { ...options });
        return data;
    },

    getProgramDetail: async (slug: string): Promise<ProgramDetailResponse> => {
        const { data } = await api.post<ProgramDetailResponse>(RUDO_VOD_DETAIL, { program: slug });
        return data;
    },

    getChapters: async (options: {
        program: string;
        limit?: number;
        season?: number;
        segment?: string;
        page?: number;
        order_type?: "asc" | "desc";
        no_segments?: boolean;
    }): Promise<ChaptersResponse> => {
        const { data } = await api.post<ChaptersResponse>(RUDO_VOD_CHAPTERS, { ...options });
        return data;
    },

    /**
     * Obtiene la data completa de un capítulo por su slug.
     * Incluye m3u8, key, título, etc.
     */
    getChapterBySlug: async (options: {
        segment?: string;
        season: number;
        chapter: number;
        program?: string;
    }): Promise<ChapterDetailResponse> => {
        const { data } = await api.post<ChapterDetailResponse>(
            RUDO_VOD_NEXT_CHAPTER,
            { ...options },
        );
        return data;
    },
};
