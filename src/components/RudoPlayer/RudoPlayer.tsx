import { useEffect, useRef, useState, useCallback } from "react";
import iconoVolverRaw from "@/assets/img/icons/iconos-volver.svg?raw";
import { useWatchHistory } from "@/hooks/useWatchHistory";
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
  onTimeUpdate?: (currentTime: number) => void;
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
  userToken,
  userProfile,
  vodSlug,
}: RudoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const currentTimeRef = useRef<number>(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const [isUIVisible, setIsUIVisible] = useState(true);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [backHovered, setBackHovered] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1);

  const iframeSrc = mode === "vod"
    ? `https://rudo.video/vod/${rudoKey}/autostart/true`
    : `https://rudo.video/live/${rudoKey}`;

  useEffect(() => {
    setIframeLoaded(false);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(true);
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
    },
    [postToIframe],
  );

  const enviarVolume = useCallback(
    (vol: number) => {
      postToIframe({ event: "volumeon", value: vol });
      setVolume(vol);
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
            onTimeUpdate?.(data.current);
          }
          if (typeof data.duration === "number" && data.duration > 0) {
            setDuration(data.duration);
          }
        } else if (data.event === "play") {
          setIsPlaying(true);
        } else if (data.event === "pause") {
          setIsPlaying(false);
        } else if (data.event === "durationchange" && typeof data.duration === "number") {
          setDuration(data.duration);
        } else if (
          data.event === "mousemove" ||
          data.event === "show-controls"
        ) {
          resetUIVisibility();
        } else if (data.event === "hide-controls") {
          setIsUIVisible(false);
        }
      } catch {
        // Silently ignore cross-origin messages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onTimeUpdate]);

  // ---- On iframe load: seek resume (VOD) ----
  // Autoplay se maneja via /autostart/true en la URL de Rudo
  useEffect(() => {
    if (!iframeLoaded) return;

    if (
      typeof initialSeconds === "number" &&
      !isNaN(initialSeconds) &&
      initialSeconds > 0
    ) {
      // Delay para que Rudo inicie antes de buscar posición
      const seekTimer = setTimeout(() => enviarSeek(initialSeconds), 1500);
      return () => clearTimeout(seekTimer);
    }
  }, [iframeLoaded, initialSeconds, enviarSeek]);

  // ---- UI visibility (auto-hide after 3s) ----
  const resetUIVisibility = useCallback(() => {
    setIsUIVisible(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
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

      // Arrow Left / Right → Skip ±10s
      if (e.key === "ArrowLeft" && mode === "vod") {
        e.preventDefault();
        const newTime = Math.max(0, currentTimeRef.current - 10);
        enviarSeek(newTime);
        resetUIVisibility();
        return;
      }
      if (e.key === "ArrowRight" && mode === "vod") {
        e.preventDefault();
        const newTime = Math.min(duration, currentTimeRef.current + 10);
        enviarSeek(newTime);
        resetUIVisibility();
        return;
      }

      // Arrow Up / Down → Volume
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const newVol = Math.min(1, volume + 0.1);
        enviarVolume(newVol);
        resetUIVisibility();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const newVol = Math.max(0, volume - 0.1);
        enviarVolume(newVol);
        resetUIVisibility();
        return;
      }

      resetUIVisibility();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onBack, isPlaying, enviarPlay, enviarPause, enviarSeek, enviarVolume, volume, duration, mode, resetUIVisibility]);

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

      {/* ---- Top Bar Overlay ---- */}
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
              color: backHovered ? "var(--foc-primary)" : "#b9b9b9",
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

      {/* ---- Bottom Controls (Seekbar + Buttons) ---- */}
      {/* <div
        className={`rudo-player-controls ${isUIVisible ? "rudo-player-controls--visible" : ""}`}
      >
        <div className="rudo-player-controls__inner">
          <Seekbar
            seekTime={currentTime}
            duration={duration}
            isLive={mode === "live"}
            playing={isPlaying}
            volume={volume}
            muted={muted}
            onSeek={handleSeek}
            onPlayPause={handlePlayPause}
            onSkip={handleSkip}
            onVolumeChange={handleVolumeChange}
            onMuteToggle={handleMuteToggle}
            onFullscreen={handleFullscreen}
          />
        </div>
      </div> */}

      {/* ---- Gradient overlays (top & bottom) for readability ---- */}
      {/* <div
        className={`rudo-player-gradient rudo-player-gradient--top ${isUIVisible ? "rudo-player-gradient--visible" : ""}`}
      />
      <div
        className={`rudo-player-gradient rudo-player-gradient--bottom ${isUIVisible ? "rudo-player-gradient--visible" : ""}`}
      /> */}
    </div>
  );
}

export default RudoPlayer;
