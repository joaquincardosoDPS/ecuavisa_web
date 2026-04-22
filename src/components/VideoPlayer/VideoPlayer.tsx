import React, { useCallback, useEffect, useState, useRef } from "react";
import { useHlsPlayer } from "@/hooks/useHlsPlayer";
import { useAdsPolicy } from "@/hooks/useAdsPolicy";
import { usePlayerAnalytics } from "@/hooks/usePlayerAnalytics";
import { VastPlayer } from "@/components/VastPlayer/VastPlayer";
import { Spinner } from "@/components/ui/Spinner";
import { PlayerTopBar } from "./UI/PlayerTopBar";
import { PlayerControls } from "./UI/PlayerControls";
import { NextEpisodeOverlay } from "./UI/NextEpisodeOverlay";
import type { VideoPlayerProps } from "@/interfaces/player";
import "./VideoPlayer.css";

/**
 * Componente orquestador del reproductor de video
 */
const VideoPlayerComponent = ({
  src,
  title,
  description,
  isLive = false,
  vastUrl,
  livetoken,
  rudoKey,
  autoplay = true,
  onBack,
  episodes = [],
  currentEpisodeKey,
  onEpisodeSelect,
  hideUI = false,
  onQualitiesChange,
  onQualityChange,
  onAdsPlaying,
  onAdsFinished,
  initialSeconds,
}: VideoPlayerProps) => {
  const [playingAds, setPlayingAds] = useState(false);

  // UI Overlay state
  const [isUIVisible, setIsUIVisible] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Next Episode Overlay state
  const [showNextEpisode, setShowNextEpisode] = useState(false);
  const [nextEpisode, setNextEpisode] = useState<any>(null);
  const [nextEpisodeCountdown, setNextEpisodeCountdown] = useState(60);
  const nextEpisodeTriggeredRef = useRef(false);

  // Resetear Next Episode al cambiar capítulo
  useEffect(() => {
    nextEpisodeTriggeredRef.current = false;
    setShowNextEpisode(false);
    setNextEpisode(null);
    setNextEpisodeCountdown(60);
  }, [currentEpisodeKey]);

  // HLS Qualities
  const [qualities, setQualities] = useState<
    { value: string; label: string }[]
  >([]);
  const [currentQuality, setCurrentQuality] = useState("auto");

  // Evaluar política de ads
  const { shouldPlayAds, effectiveVastUrl, evaluated } = useAdsPolicy({
    vastUrl,
  });

  console.log('[VideoPlayer] Ads debug:', { vastUrl, effectiveVastUrl, shouldPlayAds, evaluated, playingAds });

  // Activar ads al inicio si corresponde
  useEffect(() => {
    if (evaluated && shouldPlayAds && effectiveVastUrl) {
      console.log("[VideoPlayer] Ads detectados, activando playingAds");
      setPlayingAds(true);
    }
  }, [evaluated, shouldPlayAds, effectiveVastUrl]);

  // Inicializar HLS (no autoplay si hay ads pendientes)
  const hlsPlayer = useHlsPlayer({
    src,
    autoplay: autoplay && !playingAds,
    isLive,
    livetoken,
    initialSeconds: initialSeconds,
  });

  const {
    hlsRef,
    levels: hlsLevels,
    videoRef,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    play,
    pause,
  } = hlsPlayer;

  // Overlay Mouse / Key visibility logic
  const resetUIVisibility = useCallback(() => {
    setIsUIVisible(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

    if (!isSidebarOpen) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsUIVisible(false);
      }, 4000);
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const code = e.keyCode;

      // Back: ESC(27), Backspace(8), Tizen Back(10009), webOS Back(461)
      if (code === 27 || code === 8 || code === 10009 || code === 461) {
        e.preventDefault();
        if (onBack) onBack();
        return;
      }

      // Reproducir/Pausar con Enter (13) si NO es en vivo y NO hay overlay visible
      if (code === 13 && !isLive && !isUIVisible) {
        e.preventDefault();
        if (isPlaying) {
          pause();
        } else {
          play();
        }
        resetUIVisibility();
        return;
      }

      // Para los demás botones, mostrar la interfaz
      resetUIVisibility();
    };

    // Start the timeout on mount natively without forcing a state update
    if (isUIVisible && !hideTimeoutRef.current) {
      resetUIVisibility();
    }

    window.addEventListener("mousemove", resetUIVisibility);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousemove", resetUIVisibility);
      window.removeEventListener("keydown", handleKeyDown);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [resetUIVisibility, onBack, isLive, isUIVisible, isPlaying, play, pause]);

  // Extraer calidades de HLS JS
  useEffect(() => {
    if (hlsLevels && hlsLevels.length > 0) {
      const lvls = hlsLevels.map((l) => ({
        value: l.height.toString(),
        label: l.height === 0 ? "Audio" : `${l.height}p`,
      }));
      // Eliminar duplicados si los hay (ej: variantes de bitrate misma resolución)
      const unique = lvls.filter(
        (v, i, a) => a.findIndex((t) => t.value === v.value) === i,
      );
      const newQualities = [{ value: "auto", label: "Auto" }, ...unique.reverse()];
      setQualities(newQualities); // Mayor resolución arriba
      if (onQualitiesChange) onQualitiesChange(newQualities);
    }
  }, [hlsLevels, onQualitiesChange]);

  const handleQualityChange = useCallback((quality: string) => {
    setCurrentQuality(quality);
    if (onQualityChange) onQualityChange(quality);
    if (!hlsRef.current || hlsRef.current.levels.length === 0) return;

    if (quality === "auto") {
      hlsRef.current.currentLevel = -1;
    } else {
      const targetHeight = parseInt(quality);
      const levelIndex = hlsRef.current.levels.findIndex(
        (l) => l.height === targetHeight,
      );
      if (levelIndex !== -1) {
        hlsRef.current.currentLevel = levelIndex;
      } else {
        const closest = hlsRef.current.levels.reduce((prev, curr) =>
          Math.abs(curr.height - targetHeight) <
            Math.abs(prev.height - targetHeight)
            ? curr
            : prev,
        );
        hlsRef.current.currentLevel = hlsRef.current.levels.indexOf(closest);
      }
    }
  }, []);

  // Analytics y Tracking de VOD
  const currentEpisodeDetails = episodes?.find((e: any) => e.key === currentEpisodeKey);
  const analytics = usePlayerAnalytics(rudoKey, currentEpisodeDetails, description);

  // Reportar progreso en cada timeupdate
  useEffect(() => {
    if (!isLive && !playingAds && currentTime > 0 && duration > 0) {
      // console.log('[VideoPlayer] Tracking heart-beat:', { currentTime, duration });
      analytics.onPlaybackProgress(currentTime, duration);
    }
  }, [currentTime, duration, playingAds, isLive, analytics]); // eslint-disable-line react-hooks/exhaustive-deps

  // Chequear tiempo restante para Next Episode
  useEffect(() => {
    if (isLive || !episodes || episodes.length === 0 || !currentEpisodeKey || duration <= 0) return;

    const timeLeft = duration - currentTime;
    const NEXT_EP_THRESHOLD = 60;

    if (timeLeft <= NEXT_EP_THRESHOLD && timeLeft >= -1) {
      const currentIndex = episodes.findIndex((ep: any) => ep.key === currentEpisodeKey);
      const nextIndex = currentIndex + 1;
      if (currentIndex >= 0 && nextIndex < episodes.length) {
        if (!nextEpisodeTriggeredRef.current) {
          nextEpisodeTriggeredRef.current = true;
          setNextEpisode(episodes[nextIndex]);
          setShowNextEpisode(true);
        }
        setNextEpisodeCountdown(Math.max(0, Math.ceil(timeLeft)));
      }
    } else if (nextEpisodeTriggeredRef.current && timeLeft > NEXT_EP_THRESHOLD) {
      nextEpisodeTriggeredRef.current = false;
      setShowNextEpisode(false);
      setNextEpisode(null);
    }
  }, [currentTime, duration, isLive, episodes, currentEpisodeKey]);

  const handleNextEpisodeSelect = useCallback((ep: any) => {
    setShowNextEpisode(false);
    if (onEpisodeSelect) onEpisodeSelect(ep);
  }, [onEpisodeSelect]);

  const handleNextEpisodeDismiss = useCallback(() => {
    setShowNextEpisode(false);
  }, []);

  // Callbacks de VAST
  const handleAdsPlaying = useCallback(() => {
    console.log("[VideoPlayer] Ads reproduciendo");
    setPlayingAds(true);
    pause();
    analytics.onAdStarted();
    if (onAdsPlaying) onAdsPlaying();
  }, [pause, analytics, onAdsPlaying]);

  const handleAdsFinished = useCallback(() => {
    console.log("[VideoPlayer] Ads finalizados");
    setPlayingAds(false);
    play();
    analytics.onAdCompleted();
    if (onAdsFinished) onAdsFinished();
  }, [play, analytics, onAdsFinished]);

  // (Manejo de Back ahora integrado en el keydown principal para evitar conflictos de listeners)

  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent) => {
      // Ignorar clics en botones interactivos, barra de progreso o menú lateral
      const target = e.target as Element;
      if (
        target.closest(
          'button, .seekbar-track, .seekbar-wrapper, [role="button"]',
        )
      ) {
        return;
      }

      // En VOD, el click central en el área vacía pausa o reanuda
      if (!isLive) {
        if (isPlaying) pause();
        else play();
      }
    },
    [isLive, isPlaying, play, pause],
  );

  return (
    <div className="video-player-container" onClick={handleBackgroundClick}>
      {/* VAST Ads overlay */}
      {playingAds && effectiveVastUrl && (
        <VastPlayer
          url={effectiveVastUrl}
          onAdsPlaying={handleAdsPlaying}
          onAdsFinished={handleAdsFinished}
        />
      )}

      {/* Video principal */}
      <video
        id="hls-video-player"
        ref={videoRef}
        className={playingAds ? "hidden" : ""}
        playsInline
        autoPlay={autoplay && !playingAds}
        controls={false}
        muted={playingAds}
        tabIndex={-1}
      />

      {/* UI Overlay */}
      {!playingAds && !hideUI && (
        <>
          <PlayerTopBar
            title={title}
            description={description}
            isVisible={isUIVisible}
            isLive={isLive}
            onBackClick={onBack}
            isNextEpisodeOverlayVisible={showNextEpisode}
          />
          <PlayerControls
            playing={hlsPlayer.isPlaying}
            visible={isUIVisible}
            isLive={isLive}
            duration={hlsPlayer.duration}
            seekTime={hlsPlayer.currentTime}
            loadedTime={hlsPlayer.loadedTime}
            onPlayButtonClick={
              hlsPlayer.isPlaying ? hlsPlayer.pause : hlsPlayer.play
            }
            onSeek={(time) => {
              if (hlsPlayer.videoRef.current) {
                hlsPlayer.videoRef.current.currentTime = time;
              }
            }}
            availableQualities={qualities}
            currentQuality={currentQuality}
            onQualityChange={handleQualityChange}
            episodes={episodes}
            currentEpisodeKey={currentEpisodeKey}
            onEpisodeSelect={onEpisodeSelect}
            onHideControls={() => setIsUIVisible(false)}
            onSidebarVisibilityChange={setIsSidebarOpen}
            isNextEpisodeOverlayVisible={showNextEpisode}
          />
        </>
      )}

      {/* Siguiente Episodio Overlay */}
      {showNextEpisode && nextEpisode && !isLive && !playingAds && (
        <NextEpisodeOverlay
          episode={nextEpisode}
          countdown={nextEpisodeCountdown}
          controlsVisible={isUIVisible}
          onSelect={handleNextEpisodeSelect}
          onDismiss={handleNextEpisodeDismiss}
        />
      )}

      {/* Spinner de carga */}
      {isLoading && !playingAds && (
        <div className="video-player-spinner">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export const VideoPlayer = React.memo(VideoPlayerComponent);
