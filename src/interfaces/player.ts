// Interfaces del reproductor de video
import type { Chapter } from "@/interfaces/catalog.interface";
export interface VideoPlayerProps {
    src: string;
    title: string;
    description?: string;
    isLive?: boolean;
    vastUrl?: string;
    livetoken?: string;
    rudoKey?: string;
    restriction?: string;
    packs?: string[];
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
