// Interfaces del reproductor de video
import type { ProgramChapter } from "@/interfaces/vod";
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
    episodes?: ProgramChapter[];
    currentEpisodeKey?: string;
    onEpisodeSelect?: (episode: ProgramChapter) => void;
    hideUI?: boolean;
    onQualitiesChange?: (qualities: { value: string; label: string }[]) => void;
    onQualityChange?: (quality: string) => void;
    onAdsPlaying?: () => void;
    onAdsFinished?: () => void;
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
