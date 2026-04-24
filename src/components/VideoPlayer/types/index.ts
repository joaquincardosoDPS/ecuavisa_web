// VideoPlayer Module — Types
// All types used by the VideoPlayer module are defined here.
// External consumers should import types from '@/components/VideoPlayer'.

export interface ImageSet {
    small: string;
    medium: string;
    normal: string;
    big: string;
    default: string;
}

/**
 * Capítulo del catálogo (API de catálogo)
 */
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

/**
 * Capítulo simplificado (API de VOD/Programa)
 */
export interface ProgramChapter {
    id: string;
    key: string;
    title: string;
    image: string;
    link: string;
    duration?: string;
    restriction: string;
    packs?: string[];
    description?: string;
    initialSeconds?: number;
}

/**
 * Props del componente VideoPlayer
 */
export interface VideoPlayerProps {
    src: string;
    title: string;
    description?: string;
    isLive?: boolean;
    vastUrl?: string;
    livetoken?: string;
    rudoKey?: string;
    autoplay?: boolean;
    onBack?: () => void;
    episodes?: Chapter[];
    currentEpisodeKey?: string;
    onEpisodeSelect?: (episode: Chapter) => void;
    hideUI?: boolean;
    onQualitiesChange?: (qualities: { value: string; label: string }[]) => void;
    onQualityChange?: (quality: string) => void;
    onAdsPlaying?: () => void;
    onAdsFinished?: () => void;
    programBackgroundImage?: string;
    initialSeconds?: number;
    /** Slug del capítulo para guardado de historial "Seguir viendo" */
    vodSlug?: string;
    /** Token del usuario autenticado */
    userToken?: string;
    /** ID del perfil activo */
    userProfile?: string;
}

export interface VodMediaInfo {
    m3u8: string;
    mp4?: string;
    duration: number;
    restriction: string;
    packs?: string[];
    vast?: string;
    title?: string;
    image?: string;
    show?: string;
}

export interface PlayerState {
    isPlaying: boolean;
    isLoading: boolean;
    currentTime: number;
    duration: number;
    playingAds: boolean;
}

export interface DeviceAdInfo {
    rdid: string;
    is_lat: string;
    idtype: string;
}
