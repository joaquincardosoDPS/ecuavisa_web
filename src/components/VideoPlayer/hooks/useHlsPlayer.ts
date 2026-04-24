import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';

interface UseHlsPlayerOptions {
    src: string;
    autoplay?: boolean;
    isLive?: boolean;
    livetoken?: string;
    enabled?: boolean;
    onReady?: (videoElement: HTMLVideoElement) => void;
    onPlaying?: () => void;
    onPause?: () => void;
    initialSeconds?: number;
}




/**
 * Hook central del reproductor HLS
 */
export function useHlsPlayer({ src, autoplay = true, isLive = false, livetoken, enabled = true, onReady, onPlaying, onPause, initialSeconds }: UseHlsPlayerOptions) {
    const effectiveLivetoken = (livetoken && livetoken !== 'undefined' && livetoken !== 'null') ? livetoken : '';

    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [loadedTime, setLoadedTime] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [isEnded, setIsEnded] = useState(false);
    const [levels, setLevels] = useState<{ height: number, name?: string }[]>([]);

    // Movido aquí para no alterar el orden inicial de los hooks críticos
    useEffect(() => {
        if (enabled) {
            console.log('[HLS] Effective livetoken status:', effectiveLivetoken ? 'present' : 'missing');
        }
    }, [effectiveLivetoken, enabled]);

    // Build live URL with auth-token
    const buildLiveUrl = (src: string, token: string) => {
        if (!token || token === 'undefined' || token === 'null') return src;
        // Extract the first segment after /hls/ from the original url
        const match = src.match(/\/hls\/([^/]+)\//);
        const firstSegment = match ? match[1] : null;
        if (firstSegment) {
            // Don't modify the token, just add it as is
            return `https://redirector.dps.live/hls/${firstSegment}/playlist.m3u8?auth-token=${encodeURIComponent(token)}`;
        }
        // fallback: use the original url if no assetKey or livetoken
        return src;
    };

    // Inicializar HLS
    useEffect(() => {
        if (enabled === false) return;
        const videoElement = videoRef.current;
        if (!videoElement) return;

        if (!src || src === 'undefined' || src === 'null') {
            console.warn('[HLS] URL inválida:', src);
            return;
        }

        // Destruir instancia HLS previa y liberar recursos del video
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }
        videoElement.pause();
        videoElement.removeAttribute('src');
        videoElement.load();

        // Resetear estados para evitar datos residuales del stream anterior
        setIsLoading(true);
        setIsReady(false);
        setIsEnded(false);
        setCurrentTime(0);
        setDuration(0);
        setLoadedTime(0);
        setLevels([]);

        console.log('[HLS] Inicializando player:', { src, isLive, autoplay, enabled });

        if (Hls.isSupported()) {
            const hls = new Hls({
                autoStartLoad: true,
                enableWorker: true,
                maxBufferSize: 1000 * 1000 * 100,
                maxBufferLength: 1500,
                maxMaxBufferLength: 2200,
                liveSyncDurationCount: 15,
                liveMaxLatencyDurationCount: Infinity,
                maxLiveSyncPlaybackRate: 1.0,
                highBufferWatchdogPeriod: 15000,
                startLevel: -1,
                liveDurationInfinity: isLive,
                liveBackBufferLength: 121,
            });
            hlsRef.current = hls;

            const hlsUrl = isLive ? buildLiveUrl(src, effectiveLivetoken) : src;
            console.log('[HLS] URL final:', hlsUrl);

            hls.loadSource(hlsUrl);
            hls.attachMedia(videoElement);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('[HLS] MANIFEST_PARSED, levels:', hls.levels.length);
                console.log('[HLS] Audio tracks:', hls.audioTracks?.length || 0);
                setIsReady(true);

                if (hls.levels && hls.levels.length > 0) {
                    setLevels(hls.levels.map(l => ({ height: l.height, name: l.name })));
                }

                if (autoplay) {
                    console.log('[HLS] Calling play() after manifest parsed');
                    videoElement.play().then(() => {
                        console.log('[HLS] play() resolved successfully');
                    }).catch(err => console.warn('[HLS] Autoplay prevented:', err));
                }

                if (initialSeconds && initialSeconds > 0 && !isLive) {
                    console.log('[HLS] Initial seek to:', initialSeconds);
                    videoElement.currentTime = initialSeconds;
                }

                // Call onReady callback
                onReady?.(videoElement);
            });

            // DEBUG: Escuchar siempre que HLS.js cambie efectivamente de calidad
            hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
                const level = hls.levels[data.level];
                if (level) {
                    console.info(`[HLS] Calidad de video cambiada a: ${level.height}p (${Math.round(level.bitrate / 1024)} kbps)`);
                }
            });

            hls.on(Hls.Events.ERROR, (_event, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.error('[HLS] Network error, reintentando:', data);
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.error('[HLS] Media error, recuperando:', data);
                            hls.recoverMediaError();
                            break;
                        default:
                            console.error('[HLS] Error fatal:', data);
                            hls.destroy();
                            break;
                    }
                }
            });
        } else {
            // Soporte nativo (Safari / iOS)
            videoElement.src = isLive ? buildLiveUrl(src, livetoken ?? '') : src;
            videoElement.addEventListener('loadedmetadata', () => {
                setIsReady(true);
                if (videoElement) {
                    if (initialSeconds && initialSeconds > 0 && !isLive) {
                        console.log('[HLS] Native Initial seek to:', initialSeconds);
                        videoElement.currentTime = initialSeconds;
                    }
                    onReady?.(videoElement);
                }
            }, { once: true });
        }

        // Eventos del video element
        const handleNativePlay = () => {
            setIsPlaying(true);
            onPlaying?.();
        };
        const handleNativePause = () => {
            setIsPlaying(false);
            onPause?.();
        };
        const handleNativeWaiting = () => setIsLoading(true);
        const handleNativeCanPlay = () => setIsLoading(false);
        const handleNativePlaying = () => {
            console.log('[HLS] Video element playing event');
            setIsLoading(false);
            setIsPlaying(true);
            onPlaying?.();
        };
        const handleNativeTimeUpdate = () => {
            setCurrentTime(videoElement.currentTime);
            if (videoElement.duration && !isNaN(videoElement.duration)) {
                setDuration(videoElement.duration);
            }
            if (videoElement.buffered.length > 0) {
                setLoadedTime(videoElement.buffered.end(videoElement.buffered.length - 1));
            }
        };
        const handleNativeEnded = () => {
            setIsEnded(true);
            setIsPlaying(false);
        };

        videoElement.addEventListener('play', handleNativePlay);
        videoElement.addEventListener('pause', handleNativePause);
        videoElement.addEventListener('waiting', handleNativeWaiting);
        videoElement.addEventListener('canplay', handleNativeCanPlay);
        videoElement.addEventListener('playing', handleNativePlaying);
        videoElement.addEventListener('timeupdate', handleNativeTimeUpdate);
        videoElement.addEventListener('ended', handleNativeEnded);

        // Cleanup draconiano (Regla 4)
        return () => {
            videoElement.removeEventListener('play', handleNativePlay);
            videoElement.removeEventListener('pause', handleNativePause);
            videoElement.removeEventListener('waiting', handleNativeWaiting);
            videoElement.removeEventListener('canplay', handleNativeCanPlay);
            videoElement.removeEventListener('playing', handleNativePlaying);
            videoElement.removeEventListener('timeupdate', handleNativeTimeUpdate);
            videoElement.removeEventListener('ended', handleNativeEnded);

            if (hlsRef.current) {
                console.log('[HLS] Destruyendo instancia');
                hlsRef.current.destroy();
                hlsRef.current = null;
            }

            // Liberar recursos del elemento <video>
            videoElement.pause();
            videoElement.removeAttribute('src');
            videoElement.load();
        };
    }, [src, autoplay, isLive, livetoken, enabled]);

    const play = useCallback(() => {
        const video = videoRef.current;
        if (!video) {
            console.log('[HLS] Play: no video element');
            return;
        }

        console.log('[HLS] Play: readyState =', video.readyState, 'isPlaying =', isPlaying);

        if (video.readyState >= 2) {
            video.play().then(() => {
                console.log('[HLS] Play: success');
            }).catch(err => console.warn('[HLS] Play error:', err));
        } else {
            console.log('[HLS] Play: waiting for canplay');
            video.addEventListener('canplay', () => {
                console.log('[HLS] Play: canplay event, calling play');
                video.play().then(() => {
                    console.log('[HLS] Play: success after canplay');
                }).catch(err => console.warn('[HLS] Play error after canplay:', err));
            }, { once: true });
        }
    }, []);

    const pause = useCallback(() => {
        videoRef.current?.pause();
    }, []);

    return {
        videoRef,
        hlsRef,
        isPlaying,
        isLoading,
        isReady,
        isEnded,
        levels,
        currentTime,
        loadedTime,
        duration,
        play,
        pause,
    };
}

