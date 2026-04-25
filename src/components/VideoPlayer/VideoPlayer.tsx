import React, { useCallback, useEffect, useState, useRef } from "react";
import { useHlsPlayer } from "./hooks/useHlsPlayer";
import { useAdsPolicy } from "./hooks/useAdsPolicy";
import { usePlayerAnalytics } from "./hooks/usePlayerAnalytics";
import { useWatchHistory } from "./hooks/useWatchHistory";
import { VastPlayer } from "./ads/VastPlayer";
import { Spinner } from "@/components/ui/Spinner";
import { PlayerTopBar } from "./UI/PlayerTopBar";
import { PlayerControls } from "./UI/PlayerControls";
import type { VideoPlayerProps } from "./types";
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
  onAdsPlaying,
  onAdsFinished,
  programBackgroundImage,
  initialSeconds,
  vodSlug,
  userToken,
  userProfile,
}: VideoPlayerProps) => {
  const [playingAds, setPlayingAds] = useState(false);

  // UI Overlay state
  const [isUIVisible, setIsUIVisible] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Volume state
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  // End-of-episode PiP transition state
  const [isEndingTransition, setIsEndingTransition] = useState(false);
  const [nextEpisode, setNextEpisode] = useState<any>(null);
  const [endingCountdown, setEndingCountdown] = useState(10);
  const endingTriggeredRef = useRef(false);
  const nextEpisodeRef = useRef<any>(null);
  const autoNavFiredRef = useRef(false);

  // Hold-to-seek state
  const [keySeekPreview, setKeySeekPreview] = useState<number | null>(null);
  const keySeekIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const seekTargetRef = useRef<number | null>(null);

  // Resetear transición al cambiar capítulo
  useEffect(() => {
    endingTriggeredRef.current = false;
    autoNavFiredRef.current = false;
    nextEpisodeRef.current = null;
    setIsEndingTransition(false);
    setNextEpisode(null);
    setEndingCountdown(10);
  }, [currentEpisodeKey]);

  // Evaluar política de ads
  const { shouldPlayAds, effectiveVastUrl, evaluated } = useAdsPolicy({
    vastUrl,
  });

  // console.log('[VideoPlayer] Ads debug:', { vastUrl, effectiveVastUrl, shouldPlayAds, evaluated, playingAds });

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
    levels: hlsLevels,
    videoRef,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    play,
    pause,
  } = hlsPlayer;

  // Forzar pausa del video HLS cuando las ads están reproduciéndose
  useEffect(() => {
    if (playingAds && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.muted = true;
    }
  }, [playingAds, videoRef]);

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
    // Start the timeout on mount natively without forcing a state update
    if (isUIVisible && !hideTimeoutRef.current) {
      resetUIVisibility();
    }

    window.addEventListener("mousemove", resetUIVisibility);

    return () => {
      window.removeEventListener("mousemove", resetUIVisibility);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [resetUIVisibility, isUIVisible]);

  // Notificar calidades disponibles al padre
  useEffect(() => {
    if (hlsLevels && hlsLevels.length > 0 && onQualitiesChange) {
      const lvls = hlsLevels.map((l) => ({
        value: l.height.toString(),
        label: l.height === 0 ? "Audio" : `${l.height}p`,
      }));
      const unique = lvls.filter(
        (v, i, a) => a.findIndex((t) => t.value === v.value) === i,
      );
      const newQualities = [
        { value: "auto", label: "Auto" },
        ...unique.reverse(),
      ];
      onQualitiesChange(newQualities);
    }
  }, [hlsLevels, onQualitiesChange]);

  // Analytics y Tracking de VOD
  const currentEpisodeDetails = episodes?.find(
    (e: any) => e.key === currentEpisodeKey,
  );
  const analytics = usePlayerAnalytics(
    rudoKey,
    currentEpisodeDetails,
    description,
  );

  // Guardado periódico de historial "Seguir viendo"
  const { saveProgress } = useWatchHistory({
    vodSlug,
    currentTime,
    duration,
    isPlaying,
    isLive,
    playingAds,
    token: userToken,
    profile: userProfile,
  });

  // Limpiar preview de seek cuando el currentTime alcanza la posición objetivo
  useEffect(() => {
    if (
      seekTargetRef.current !== null &&
      keySeekPreview !== null &&
      !keySeekIntervalRef.current
    ) {
      const diff = Math.abs(currentTime - seekTargetRef.current);
      if (diff < 3) {
        seekTargetRef.current = null;
        setKeySeekPreview(null);
      }
    }
  }, [currentTime, keySeekPreview]);

  // Reportar progreso en cada timeupdate
  useEffect(() => {
    if (!isLive && !playingAds && currentTime > 0 && duration > 0) {
      analytics.onPlaybackProgress(currentTime, duration);
    }
  }, [currentTime, duration, playingAds, isLive, analytics]);

  // Función para auto-navegar al siguiente episodio (guarded)
  const autoNavigateToNext = useCallback(() => {
    if (autoNavFiredRef.current) return;
    const ep = nextEpisodeRef.current;
    if (ep && onEpisodeSelect) {
      autoNavFiredRef.current = true;
      console.log("[VideoPlayer] Auto-playing next episode:", ep.title);
      onEpisodeSelect(ep);
    }
  }, [onEpisodeSelect]);

  // Chequear tiempo restante para transición PiP de fin de episodio
  useEffect(() => {
    if (isLive || duration <= 0) return;

    const timeLeft = duration - currentTime;
    const PIP_THRESHOLD = 10;

    if (timeLeft <= PIP_THRESHOLD && timeLeft >= -1) {
      if (!endingTriggeredRef.current) {
        endingTriggeredRef.current = true;
        setIsEndingTransition(true);

        // Buscar siguiente episodio si existe
        if (episodes && episodes.length > 0 && currentEpisodeKey) {
          const currentIndex = episodes.findIndex(
            (ep: any) => ep.key === currentEpisodeKey,
          );
          const nextIndex = currentIndex + 1;
          if (currentIndex >= 0 && nextIndex < episodes.length) {
            const next = episodes[nextIndex];
            nextEpisodeRef.current = next;
            setNextEpisode(next);
          }
        }
      }
      setEndingCountdown(Math.max(0, Math.ceil(timeLeft)));

      // Auto-navegar cuando timeLeft llega a 0
      if (timeLeft <= 0) {
        autoNavigateToNext();
      }
    } else if (endingTriggeredRef.current && timeLeft > PIP_THRESHOLD) {
      endingTriggeredRef.current = false;
      autoNavFiredRef.current = false;
      nextEpisodeRef.current = null;
      setIsEndingTransition(false);
      setNextEpisode(null);
    }
  }, [
    currentTime,
    duration,
    isLive,
    episodes,
    currentEpisodeKey,
    autoNavigateToNext,
  ]);

  // Fallback: auto-navegar cuando el video emite 'ended'
  useEffect(() => {
    if (hlsPlayer.isEnded) {
      saveProgress(1); // Marcar episodio actual como finalizado
      autoNavigateToNext();
    }
  }, [hlsPlayer.isEnded, autoNavigateToNext, saveProgress]);

  const handleNextEpisodeSelect = useCallback(
    (ep: any) => {
      setIsEndingTransition(false);
      if (onEpisodeSelect) onEpisodeSelect(ep);
    },
    [onEpisodeSelect],
  );

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
    if (videoRef.current) {
      videoRef.current.muted = false;
    }
    play();
    analytics.onAdCompleted();
    if (onAdsFinished) onAdsFinished();
  }, [play, analytics, onAdsFinished, videoRef]);

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

      // No pausar durante la transición PiP de fin de episodio
      if (isEndingTransition) return;

      // No interactuar durante los ads
      if (playingAds) return;

      // Click central pausa o reanuda
      if (isPlaying) pause();
      else play();
    },
    [isLive, isPlaying, play, pause, isEndingTransition, playingAds],
  );

  // --- Volume / Skip / Fullscreen handlers ---
  const handleVolumeChange = useCallback(
    (newVolume: number) => {
      setVolume(newVolume);
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
        if (newVolume > 0 && muted) {
          videoRef.current.muted = false;
          setMuted(false);
        }
      }
    },
    [videoRef, muted],
  );

  const handleMuteToggle = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      if (videoRef.current) {
        videoRef.current.muted = next;
      }
      return next;
    });
  }, [videoRef]);

  const handleSkip = useCallback(
    (seconds: number) => {
      if (videoRef.current && duration > 0) {
        const newTime = Math.max(
          0,
          Math.min(duration, videoRef.current.currentTime + seconds),
        );
        videoRef.current.currentTime = newTime;
      }
    },
    [videoRef, duration],
  );

  const handleFullscreen = useCallback(() => {
    const container = videoRef.current?.closest(
      ".video-player-container",
    ) as HTMLElement | null;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen().catch(console.error);
    }
  }, [videoRef]);

  // Refs estables para keyboard (evitar que el effect se re-ejecute cada frame)
  const currentTimeRef = useRef(currentTime);
  const durationRef = useRef(duration);
  currentTimeRef.current = currentTime;
  durationRef.current = duration;

  // Keyboard controls con hold-to-seek
  useEffect(() => {
    const SEEK_STEP = 15; // segundos por tick
    const SEEK_INTERVAL = 60; // ms entre ticks al mantener

    const startKeySeeking = (direction: number) => {
      if (keySeekIntervalRef.current) return;
      const startTime = videoRef.current?.currentTime ?? currentTimeRef.current;
      const firstPreview = Math.max(
        0,
        Math.min(durationRef.current, startTime + direction * SEEK_STEP),
      );
      setKeySeekPreview(firstPreview);
      resetUIVisibility();

      keySeekIntervalRef.current = setInterval(() => {
        setKeySeekPreview((prev) => {
          const base = prev ?? currentTimeRef.current;
          return Math.max(
            0,
            Math.min(durationRef.current, base + direction * SEEK_STEP),
          );
        });
        resetUIVisibility();
      }, SEEK_INTERVAL);
    };

    const stopKeySeeking = () => {
      if (keySeekIntervalRef.current) {
        clearInterval(keySeekIntervalRef.current);
        keySeekIntervalRef.current = null;
      }
      // Aplicar el seek y mantener preview hasta que currentTime alcance
      setKeySeekPreview((prev) => {
        if (prev !== null && videoRef.current) {
          videoRef.current.currentTime = prev;
          seekTargetRef.current = prev;
        }
        return prev;
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const code = e.keyCode;
      if (playingAds) return;

      // Back: ESC(27), Backspace(8)
      if (code === 27 || code === 8) {
        e.preventDefault();
        if (onBack) onBack();
        return;
      }

      // Reproducir/Pausar con Enter (13) o Espacio (32)
      if ((code === 13 || code === 32) && !isLive) {
        e.preventDefault();
        if (isPlaying) pause();
        else play();
        resetUIVisibility();
        return;
      }

      // Flechas izquierda (37) / derecha (39): hold-to-seek
      if ((code === 37 || code === 39) && !isLive && durationRef.current > 0) {
        e.preventDefault();
        const dir = code === 37 ? -1 : 1;
        startKeySeeking(dir);
        return;
      }

      // Flechas arriba (38) / abajo (40): subir/bajar volumen
      if (code === 38 || code === 40) {
        e.preventDefault();
        const delta = code === 38 ? 0.1 : -0.1;
        const newVolume = Math.max(0, Math.min(1, volume + delta));
        handleVolumeChange(newVolume);
        resetUIVisibility();
        return;
      }

      resetUIVisibility();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.keyCode;
      if ((code === 37 || code === 39) && keySeekIntervalRef.current) {
        stopKeySeeking();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (keySeekIntervalRef.current) {
        clearInterval(keySeekIntervalRef.current);
        keySeekIntervalRef.current = null;
      }
    };
  }, [
    resetUIVisibility,
    onBack,
    isLive,
    isPlaying,
    play,
    pause,
    playingAds,
    handleVolumeChange,
    volume,
    videoRef,
  ]);

  return (
    <div className="video-player-container" onClick={handleBackgroundClick}>
      {/* Fondo durante transición PiP */}
      {isEndingTransition && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: programBackgroundImage
              ? `url(${programBackgroundImage})`
              : "none",
            backgroundColor: "#000",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
            animation: "fadeIn 0.6s ease-out forwards",
          }}
        >
          {/* Overlay oscuro para legibilidad */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%)",
            }}
          />
          {/* Info del siguiente episodio */}
          {nextEpisode && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                color: "#fff",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  fontSize: "1rem",
                  color: "#b9b9b9",
                  marginBottom: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                A continuación
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                {nextEpisode.title}
              </div>
              <div
                style={{
                  fontSize: "1.1rem",
                  color: "#b9b9b9",
                  marginBottom: "24px",
                }}
              >
                T{nextEpisode.season}:E{nextEpisode.chapter}
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "#b9b9b9",
                  marginBottom: "16px",
                }}
              >
                Reproduciendo en {endingCountdown}s
              </div>
              <button
                onClick={() => handleNextEpisodeSelect(nextEpisode)}
                style={{
                  padding: "12px 32px",
                  borderRadius: "999px",
                  border: "none",
                  backgroundColor: "var(--clr-secondary-button, #FA6428)",
                  color: "var(--clr-text-primary-button, #fff)",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "transform 0.15s ease, opacity 0.15s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Reproducir ahora
              </button>
            </div>
          )}
        </div>
      )}

      {/* VAST Ads overlay */}
      {playingAds && effectiveVastUrl && (
        <VastPlayer
          url={effectiveVastUrl}
          onAdsPlaying={handleAdsPlaying}
          onAdsFinished={handleAdsFinished}
        />
      )}

      {/* Video principal — se achica a PiP cuando isEndingTransition */}
      <video
        id="hls-video-player"
        ref={videoRef}
        className={playingAds ? "hidden" : ""}
        playsInline
        autoPlay={autoplay && !playingAds}
        controls={false}
        muted={playingAds}
        tabIndex={-1}
        onClick={(e) => {
          if (isEndingTransition) {
            e.stopPropagation();
            setIsEndingTransition(false);
            setNextEpisode(null);
          }
        }}
        style={{
          transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          ...(isEndingTransition && !playingAds
            ? {
                position: "absolute",
                bottom: "40px",
                right: "40px",
                width: "320px",
                height: "180px",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                zIndex: 10,
                objectFit: "cover",
                cursor: "pointer",
              }
            : {}),
        }}
      />

      {/* UI Overlay (ocultar durante transición PiP) */}
      {!playingAds && !hideUI && !isEndingTransition && (
        <>
          <PlayerTopBar
            title={title}
            description={description}
            isVisible={isUIVisible}
            isLive={isLive}
            onBackClick={onBack}
          />
          <PlayerControls
            playing={hlsPlayer.isPlaying}
            visible={isUIVisible}
            isLive={isLive}
            duration={hlsPlayer.duration}
            seekTime={hlsPlayer.currentTime}
            previewSeekTime={keySeekPreview}
            loadedTime={hlsPlayer.loadedTime}
            volume={volume}
            muted={muted}
            onPlayButtonClick={
              hlsPlayer.isPlaying ? hlsPlayer.pause : hlsPlayer.play
            }
            onSeek={(time) => {
              if (hlsPlayer.videoRef.current) {
                hlsPlayer.videoRef.current.currentTime = time;
              }
            }}
            onSkip={handleSkip}
            onVolumeChange={handleVolumeChange}
            onMuteToggle={handleMuteToggle}
            onFullscreen={handleFullscreen}
            currentEpisodeKey={currentEpisodeKey}
            onHideControls={() => setIsUIVisible(false)}
            onSidebarVisibilityChange={setIsSidebarOpen}
          />
        </>
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
