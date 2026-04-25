import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Player, PlayerOptions, loadImaSdk } from '@glomex/vast-ima-player';
import { getDeviceAdInfo, appendAdParamsToVastUrl } from './deviceAdService';
import he from 'he';
import './VastPlayer.css';

interface VastPlayerProps {
    url: string;
    onAdsPlaying?: () => void;
    onAdsFinished?: () => void;
}

/**
 * Reproductor de publicidad VAST con IMA SDK
 */
const VastPlayerComponent = ({ url, onAdsPlaying, onAdsFinished }: VastPlayerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const imaPlayerRef = useRef<any>(null);
    const mountIdRef = useRef(0);
    const adTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Cada mount obtiene un ID único; si otro mount ocurre, el ID cambia
        // y las operaciones async del mount anterior se abortan
        const currentMountId = ++mountIdRef.current;
        const isStale = () => mountIdRef.current !== currentMountId;

        const initAds = async () => {
            try {
                if (!videoRef.current || !containerRef.current) {
                    console.warn('[VAST] Refs no disponibles');
                    return;
                }
                if (!url || url.trim() === '' || url === 'none') {
                    console.log('[VAST] Sin URL, finalizando');
                    onAdsFinished?.();
                    return;
                }

                console.log('[VAST] Cargando ads:', url);

                // Obtener info del dispositivo y enriquecer URL
                const adInfo = await getDeviceAdInfo();

                let decodedUrl = he.decode(url);
                while (decodedUrl.indexOf('&amp;') !== -1) {
                    decodedUrl = decodedUrl.replace(/&amp;/g, '&');
                }

                const enrichedUrl = appendAdParamsToVastUrl(decodedUrl, adInfo);
                console.log('[VAST] URL enriquecida:', enrichedUrl);

                if (isStale()) return;

                // Cargar IMA SDK
                const ima = await loadImaSdk();
                console.log('[VAST] IMA SDK cargado');

                if (isStale()) return;

                ima.settings.setLocale('es_cl');
                ima.settings.setVpaidMode(ima.ImaSdkSettings.VpaidMode.ENABLED);
                ima.settings.setNumRedirects(8);
                ima.settings.setPlayerType('hlsjs');
                ima.settings.setPlayerVersion('1.0.0');
                ima.settings.setAutoPlayAdBreaks(true);

                const adsRenderingSettings = new ima.AdsRenderingSettings();
                adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
                adsRenderingSettings.loadVideoTimeout = 15000;
                adsRenderingSettings.enablePreloading = true;
                adsRenderingSettings.autoAlign = true;
                adsRenderingSettings.uiElements = [
                    ima.UiElements.COUNTDOWN,
                    ima.UiElements.AD_ATTRIBUTION,
                ];

                // No usar autoResize — IMA lo sobreescribe a width:0
                const playerOptions = new PlayerOptions();

                const imaPlayer = new Player(
                    ima,
                    videoRef.current!,
                    containerRef.current!,
                    adsRenderingSettings,
                    playerOptions,
                );
                imaPlayerRef.current = imaPlayer;

                const adsRequest = new ima.AdsRequest();
                adsRequest.adTagUrl = enrichedUrl;
                adsRequest.setAdWillAutoPlay(true);
                adsRequest.setAdWillPlayMuted(false);

                // Helper: forzar dimensiones del contenedor y sus hijos IMA
                const forceContainerSize = () => {
                    const w = window.innerWidth;
                    const h = window.innerHeight;
                    if (containerRef.current) {
                        containerRef.current.style.setProperty('width', `${w}px`, 'important');
                        containerRef.current.style.setProperty('height', `${h}px`, 'important');
                        // Forzar también los divs hijos que IMA crea (ad containers)
                        const imaDivs = containerRef.current.querySelectorAll(':scope > div');
                        imaDivs.forEach((div) => {
                            (div as HTMLElement).style.setProperty('width', `${w}px`, 'important');
                            (div as HTMLElement).style.setProperty('height', `${h}px`, 'important');
                        });
                    }
                    // También llamar resizeAd en el player
                    try {
                        imaPlayer.resizeAd(w, h);
                    } catch (_e) { /* ignore */ }
                };

                // Timeout de seguridad: si el ad no inicia en 30s, continuar
                adTimeoutRef.current = setTimeout(() => {
                    console.warn('[VAST] Timeout - continuando sin ad');
                    setIsLoading(false);
                    onAdsFinished?.();
                }, 30000);

                // Event listeners del IMA player
                imaPlayer.addEventListener('AdStarted', (event: any) => {
                    const podInfo = event.detail?.ad?.getAdPodInfo?.();
                    console.log('[VAST] Ad started', podInfo);
                    setIsLoading(false);
                    if (adTimeoutRef.current) clearTimeout(adTimeoutRef.current);
                    // Forzar dimensiones cuando el ad empieza
                    forceContainerSize();
                    onAdsPlaying?.();
                });

                // Si el ad se pausa (SIMID/TrueView play button), reanudar automáticamente
                imaPlayer.addEventListener('AdPaused', () => {
                    console.log('[VAST] Ad pausado, reanudando automáticamente');
                    try { videoRef.current?.play(); } catch (_e) { /* ignore */ }
                });

                imaPlayer.addEventListener('AdAllAdsCompleted', () => {
                    console.log('[VAST] Todos los ads completados');
                    if (adTimeoutRef.current) clearTimeout(adTimeoutRef.current);
                    onAdsFinished?.();
                });

                imaPlayer.addEventListener('AdError', (event: any) => {
                    const detail = event?.detail;
                    const code = detail?.errorCode || 'unknown';
                    const msg = detail?.message || detail?.error?.message || 'Unknown';
                    const vastCode = detail?.vastErrorCode || detail?.error?.vastErrorCode || 'N/A';
                    console.warn('[VAST] AdError:', { code, vastCode, msg });

                    if (adTimeoutRef.current) clearTimeout(adTimeoutRef.current);
                    setIsLoading(false);
                    onAdsFinished?.();
                });

                imaPlayer.addEventListener('AdContentResumeRequested', () => {
                    console.log('[VAST] Resume content');
                    if (adTimeoutRef.current) clearTimeout(adTimeoutRef.current);
                    onAdsFinished?.();
                });

                // Listener de resize de ventana
                const handleResize = () => forceContainerSize();
                window.addEventListener('resize', handleResize);

                imaPlayer.playAds(adsRequest);
                console.log('[VAST] playAds ejecutado');

                // Forzar dimensiones inmediatamente y con delay (IMA las setea async)
                forceContainerSize();
                setTimeout(forceContainerSize, 100);
                setTimeout(forceContainerSize, 500);
                setTimeout(forceContainerSize, 1000);

            } catch (error) {
                console.error('[VAST] Error cargando ads:', error);
                setIsLoading(false);
                onAdsFinished?.();
            }
        };

        initAds();

        // Cleanup
        return () => {
            if (adTimeoutRef.current) clearTimeout(adTimeoutRef.current);
            if (imaPlayerRef.current) {
                try {
                    imaPlayerRef.current.destroy?.();
                } catch (_e) {
                    // Silenciar errores de destroy
                }
                imaPlayerRef.current = null;
            }
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.removeAttribute('src');
                videoRef.current.load();
            }
            console.log('[VAST] Cleanup completo');
        };
    }, [url]); // eslint-disable-line react-hooks/exhaustive-deps

    return createPortal(
        <div
            id="adVideoContainer"
            ref={containerRef}
            className="vast-container"
        >
            <video
                id="adVideoElement"
                ref={videoRef}
                style={{
                    width: '100vw',
                    height: '100vh',
                    objectFit: 'contain',
                    background: 'black',
                }}
                playsInline
            />
            {isLoading && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10000,
                    }}
                >
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            border: '4px solid rgba(255,255,255,0.3)',
                            borderTop: '4px solid #fff',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            marginBottom: '16px',
                        }}
                    />
                    <span style={{ color: '#fff', fontSize: '1.1rem' }}>
                        Cargando publicidad...
                    </span>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            )}
        </div>,
        document.body
    );
};

export const VastPlayer = React.memo(VastPlayerComponent);
