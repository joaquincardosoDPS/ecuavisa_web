import { useEffect, useRef, useState, useCallback } from "react";
import iconoVolverRaw from "@/assets/img/icons/iconos-volver.svg?raw";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { getStoredVolume, setStoredVolume } from "@/utils/volumeStorage";
import "./RudoPlayer.css";

export interface RudoPlayerProps {
  rudoKey: string;
  mode: "live" | "vod";
  title: string;
  description?: string;
  onBack?: () => void;
  initialSeconds?: number;
  userToken?: string;
  userProfile?: string;
  vodSlug?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  hideOverlay?: boolean;
}



const resizeSvg = (raw: string, size: number) =>
  raw
    .replace(/width="[^"]*"/, `width="${size}"`)
    .replace(/height="[^"]*"/, `height="${size}"`);

function RudoPlayer({
  rudoKey,
  mode,
  title,
  description,
  onBack,
  initialSeconds,
  onTimeUpdate,
  hideOverlay,
  userToken,
  userProfile,
  vodSlug,
}: RudoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const currentTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const [isUIVisible, setIsUIVisible] = useState(true);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [backHovered, setBackHovered] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(() => getStoredVolume());
  const [isMuted, setIsMuted] = useState(false);
  const isPlayingRef = useRef(true);
  const pauseDetectionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const iframeSrc = mode === "vod"
    ? `https://rudo.video/vod/${rudoKey}/autostart/true`
    : `https://rudo.video/live/${rudoKey}`;

  useEffect(() => {
    setIframeLoaded(false);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(true);
    currentTimeRef.current = 0;
    durationRef.current = 0;
  }, [rudoKey]);

  // ---- Watch History ("Seguir viendo") ----
  useWatchHistory({
    vodSlug,
    currentTime,
    duration,
    isPlaying,
    isLive: mode === "live",
    token: userToken,
    profile: userProfile,
  });

  // ---- PostMessage helpers ----
  const postToIframe = useCallback(
    (payload: Record<string, unknown>) => {
      iframeRef.current?.contentWindow?.postMessage(
        { message: payload },
        "*",
      );
    },
    [],
  );

  const enviarPlay = useCallback(
    () => {
      postToIframe({ event: "play" });
      setIsPlaying(true);
    },
    [postToIframe],
  );

  const enviarPause = useCallback(
    () => {
      postToIframe({ event: "pause" });
      setIsPlaying(false);
    },
    [postToIframe],
  );

  const enviarSeek = useCallback(
    (seconds: number) => {
      postToIframe({ event: "seek", current: seconds });
      setCurrentTime(seconds);
      currentTimeRef.current = seconds;
    },
    [postToIframe],
  );

  const enviarVolume = useCallback(
    (vol: number) => {
      postToIframe({ event: "volumeon", value: vol });
      setVolume(vol);
      setStoredVolume(vol);
    },
    [postToIframe],
  );

  // ---- Listen for iframe messages ----
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = event.data?.message;
        if (!data) return;

        if (data.event === "timeupdate") {
          if (typeof data.current === "number") {
            currentTimeRef.current = data.current;
            setCurrentTime(data.current);
          }
          if (typeof data.duration === "number" && data.duration > 0) {
            durationRef.current = data.duration;
            setDuration(data.duration);
          }
          // Notify parent with current time and duration
          onTimeUpdate?.(
            currentTimeRef.current,
            durationRef.current,
          );

          // Detectar play/pause por flujo de timeupdate
          if (!isPlayingRef.current) {
            // timeupdate llegó → el video está corriendo de nuevo
            isPlayingRef.current = true;
            setIsPlaying(true);
            // Iniciar auto-hide ya que el video volvió a reproducirse
            resetUIVisibility();
          }
          // Resetear timer: si no llega otro timeupdate en 1.5s → pausado
          if (pauseDetectionRef.current) clearTimeout(pauseDetectionRef.current);
          pauseDetectionRef.current = setTimeout(() => {
            isPlayingRef.current = false;
            setIsPlaying(false);
            // Mostrar UI al detectar pausa
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
            setIsUIVisible(true);
          }, 1500);
        } else if (data.event === "play") {
          setIsPlaying(true);
          isPlayingRef.current = true;
        } else if (data.event === "pause") {
          setIsPlaying(false);
          isPlayingRef.current = false;
          if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
          setIsUIVisible(true);
        } else if (data.event === "durationchange" && typeof data.duration === "number") {
          durationRef.current = data.duration;
          setDuration(data.duration);
        } else if (data.event === "show-controls") {
          if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
          setIsUIVisible(true);
        } else if (data.event === "hide-controls") {
          if (!isPlayingRef.current) return;
          if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
          setIsUIVisible(false);
        } else if (data.event === "mousemove") {
          resetUIVisibility();
        }
      } catch {
        // Silently ignore cross-origin messages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onTimeUpdate]);

  // ---- On iframe load: restore volume + seek resume ----
  useEffect(() => {
    if (!iframeLoaded) return;

    // Restore user's preferred volume for both live and VOD
    const storedVol = getStoredVolume();
    const volTimer = setTimeout(() => enviarVolume(storedVol), 800);

    // Seek resume (VOD only)
    if (
      mode === "vod" &&
      typeof initialSeconds === "number" &&
      !isNaN(initialSeconds) &&
      initialSeconds > 0
    ) {
      const seekTimer = setTimeout(() => enviarSeek(initialSeconds), 1500);
      return () => {
        clearTimeout(volTimer);
        clearTimeout(seekTimer);
      };
    }

    return () => clearTimeout(volTimer);
  }, [iframeLoaded, initialSeconds, enviarSeek, enviarVolume, mode]);

  // ---- UI visibility (auto-hide after 3s, never when paused) ----
  const resetUIVisibility = useCallback(() => {
    setIsUIVisible(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    // No auto-hide si el video está pausado
    if (!isPlayingRef.current) return;
    hideTimeoutRef.current = setTimeout(() => {
      setIsUIVisible(false);
    }, 3000);
  }, []);

  useEffect(() => {
    resetUIVisibility();

    const handleMouseMove = () => resetUIVisibility();
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [resetUIVisibility]);

  // ---- Keyboard controls ----
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC / Backspace → Back
      if (e.key === "Escape" || e.key === "Backspace") {
        e.preventDefault();
        onBack?.();
        return;
      }

      // Space / Enter → Play/Pause
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (isPlaying) enviarPause();
        else enviarPlay();
        resetUIVisibility();
        return;
      }

      // Arrow Left / Right → Skip ±10s (VOD only)
      if (e.key === "ArrowLeft" && mode === "vod") {
        e.preventDefault();
        const newTime = Math.max(0, currentTimeRef.current - 10);
        enviarSeek(newTime);
        resetUIVisibility();
        return;
      }
      if (e.key === "ArrowRight" && mode === "vod") {
        e.preventDefault();
        const maxTime = durationRef.current || Infinity;
        const newTime = Math.min(maxTime, currentTimeRef.current + 10);
        enviarSeek(newTime);
        resetUIVisibility();
        return;
      }

      // Arrow Up / Down → Volume ±10%
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const newVol = Math.min(1, volume + 0.1);
        enviarVolume(newVol);
        setIsMuted(false);
        resetUIVisibility();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const newVol = Math.max(0, volume - 0.1);
        enviarVolume(newVol);
        if (newVol === 0) setIsMuted(true);
        resetUIVisibility();
        return;
      }

      // M → Mute/Unmute
      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        if (isMuted) {
          enviarVolume(volume > 0 ? volume : 1);
          setIsMuted(false);
        } else {
          enviarVolume(0);
          setIsMuted(true);
        }
        resetUIVisibility();
        return;
      }

      resetUIVisibility();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack, isPlaying, enviarPlay, enviarPause, enviarSeek, enviarVolume, volume, isMuted, mode, resetUIVisibility]);

  return (
    <div className="rudo-player-container">
      {/* ---- Iframe ---- */}
      <iframe
        ref={iframeRef}
        id="vrudo"
        src={iframeSrc}
        width="100%"
        height="100%"
        title={title}
        allow="autoplay; fullscreen"
        onLoad={() => setIframeLoaded(true)}
        style={{ border: "none", overflow: "hidden" }}
      />

      {/* Capa invisible para detectar mouse cuando los controles están ocultos */}
      {!hideOverlay && (
        <div
          onMouseMove={resetUIVisibility}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: isUIVisible ? "none" : "auto",
            cursor: "default",
          }}
        />
      )}

      {/* ---- Top Bar Overlay ---- */}
      {!hideOverlay && (
        <div
          className={`rudo-player-topbar ${isUIVisible ? "rudo-player-topbar--visible" : ""}`}
        >
          <div className="rudo-player-topbar__left">
            {/* Botón Volver */}
            <button
              onClick={onBack}
              onMouseEnter={() => setBackHovered(true)}
              onMouseLeave={() => setBackHovered(false)}
              className="rudo-player-back-btn"
              style={{
                color: backHovered ? "var(--foc-primary)" : "var(--clr-text-primary-button)",
              }}
            >
              <span
                className="rudo-player-back-icon"
                dangerouslySetInnerHTML={{
                  __html: resizeSvg(iconoVolverRaw, 20),
                }}
              />
            </button>

            {/* Título y descripción */}
            <div className="rudo-player-topbar__text">
              <h1 className="rudo-player-title">{title}</h1>
              {description && (
                <h2 className="rudo-player-description">{description}</h2>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RudoPlayer;
