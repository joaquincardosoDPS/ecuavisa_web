export interface Classification {
    id: string;
    name: string;
}

export interface ImageSet {
    small: string;
    medium: string;
    normal: string;
    big: string;
    default: string;
}

export interface Gender {
    slug: string;
    name: string;
}

export interface Segment {
    id: string;
    key: string;
    name: string;
    max_temp: number;
    all_temp: number[];
}

export interface MaxCap {
    chapter: number;
    segment: string;
    season: number;
    program: string;
}

export interface Program {
    id: string;
    key: string;
    title: string;
    description_short: string;
    description: string;
    status_ads: boolean;
    image_port: ImageSet;
    image_land: ImageSet;
    image_logo: ImageSet;
    image_slider: ImageSet;
    image_background?: ImageSet;
    classification?: string;
    anio_production?: string;
    "max-cap": MaxCap | null;
    segments: Segment[];
    genders?: Gender[];
    actors?: string;
}

export interface SliderResponse {
    status: string;
    code: number;
    total_records: number;
    total_display_records: number;
    last_page: number;
    data: Program[];
}

export interface Category {
    key: string;
    format: string;
    title: string;
    image_logo_category: ImageSet;
    image_background_category: ImageSet;
    total_records: number;
    total_display_records: number;
    programs: Program[];
}

export interface CategoriesResponse {
    status: string;
    code: number;
    total_records: number;
    total_display_records: number;
    last_page: number;
    data: Category[];
}

// Live Signals Interfaces
export interface ActiveItemData {
    is_ads?: boolean;
    title?: string;
    description?: string;
    image?: string;
    time_playing?: string;
}

export interface LiveSignal {
    id: string;
    key: string;
    key_live: string;
    name_live: string;
    background_image: string;
    logo: string;
    color: string;
    order: number;
    is_playlist: boolean;
    title: string;
    timezone: string;
    active: boolean;
    active_external: boolean;
    live: string;
    is_schedule: boolean;
    active_item_data: ActiveItemData;
    folder: string | null;
    m3u8: string;
    vast: string;
    type: string;
    preview_m3u8: string;
    in_review: boolean;
    restriction: string;
    geo_blocking: boolean;
    timezone_live: string | null;
    DPSDAIAssetKey: string | null;
    assetKey?: string | null;
    ads: string;
}

export interface PlaylistPremiumResponse {
    status: string;
    code_error: number;
    msj: string;
    t_found: number;
    t_data: number;
    data: LiveSignal[];
}

export interface RecommendedProgramsResponse {
    status: string;
    code: number;
    total_records: number;
    total_display_records: number;
    last_page: number;
    data: Program[];
}

export interface ProgramDetailResponse {
    status: string;
    code: number;
    data: Program;
}

export interface Chapter {
    chapter: number;
    date_create: string;
    date_update: string;
    description: string;
    duration: string;
    image: string;
    image_land: ImageSet;
    key: string;
    key_segment: string;
    m3u8: string;
    name_program: string;
    name_segment: string;
    restriction: string;
    season: number;
    slug: string;
    title: string;
    title_complete: string;
}

export interface ChaptersResponse {
    status: string;
    code: number;
    total_records: number;
    total_display_records: number;
    last_page: number;
    data: Chapter[];
}


export interface EPGPictures {
    photo: string;
    poster: string;
    cover: string;
    background: string;
}

export interface EPGEvent {
    id: string;
    programId: string;
    beginTime: string;
    endTime: string;
    title: string;
    synopsis: string;
    genre: string[] | null;
    episodeTitle: string;
    pictures: EPGPictures;
    rating: string;
}

export interface EPGChannel {
    key_live: string;
    channel: string;
    channelCode: string;
    updated: string;
    eventsFrom: string;
    eventsTo: string;
    events: EPGEvent[];
}
