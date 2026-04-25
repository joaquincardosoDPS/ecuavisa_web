import type { ImageSet } from './catalog.interface';

export interface FavoriteItem {
    id: string;
    key: string;
    title: string;
    name_category: string;
    description_short: string;
    description: string;
    status_ads: boolean;
    image_port: ImageSet;
    image_land: ImageSet;
    image_slider: ImageSet;
    image_logo: ImageSet;
    classification: {
        id: string;
        name: string;
    };
}

export interface FavoritesResponse {
    status: string;
    code: number;
    total_records?: number;
    total_display_records?: number;
    last_page?: number;
    data?: FavoriteItem[];
    msj?: string;
}

export interface FavoriteValidateResponse {
    status: string;
    code: number;
    data: string[];
    msj?: string;
}
