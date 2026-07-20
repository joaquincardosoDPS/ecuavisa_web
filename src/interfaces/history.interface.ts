import type { ImageSet } from './catalog.interface';

export interface HistoryItem {
    key: string;
    slug: string;
    title: string;
    name_program: string;
    key_segment: string;
    key_program: string;
    description: string;
    season: number;
    chapter: number;
    duration: string;
    duration_seg: number;
    image_land: ImageSet;
    image: string;
    m3u8: string;
    restriction: number;
    time: number;
    end: 0 | 1;
}

export interface HistoryResponse {
    status: string;
    code: number;
    total_records?: number;
    total_display_records?: number;
    last_page?: number;
    data?: HistoryItem[];
    msj?: string;
}

export interface SaveHistoryParams {
    /** Token del usuario autenticado */
    token: string;
    /** ID del perfil activo */
    profile: string;
    /** Slug del capítulo */
    vod: string;
    /** Tiempo de reproducción en segundos */
    time: number;
    /** 0 = no finalizado, 1 = finalizado */
    end?: 0 | 1;
}

export interface GetHistoryParams {
    token: string;
    profile: string;
    program?: string;
    page?: number;
    limit?: number;
    end?: 0 | 1;
}

export interface HistoryTimelineItem {
    slug: string;
    time: number;
    end: 0 | 1;
}

export interface HistoryTimelineResponse {
    status: string;
    code: number;
    total?: number;
    data?: HistoryTimelineItem[];
    msj?: string;
}
