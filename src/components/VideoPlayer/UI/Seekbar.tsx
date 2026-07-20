import React, { useCallback, useEffect, useRef, useState } from "react";
import { SkipButton } from "./SkipButton";
import { PlayPauseButton } from "./PlayPauseButton";
import { VolumeControl } from "./VolumeControl";
import { FullscreenButton } from "./FullscreenButton";
import { LiveControls } from "./LiveControls";

interface SeekbarProps {
  seekTime?: number;
  previewSeekTime?: number | null;
  loadedTime?: number;
  duration?: number;
  isLive?: boolean;
  playing?: boolean;
  volume?: number;
  muted?: boolean;
  onSeek?: (time: number) => void;
  onSeekStart?: () => void;
  onPlayPause?: () => void;
  onSkip?: (seconds: number) => void;
  onVolumeChange?: (volume: number) => void;
  onMuteToggle?: () => void;
  onFullscreen?: () => void;
}

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const SeekbarComponent = ({
  seekTime = 0,
  previewSeekTime = null,
  loadedTime = 0,
  duration = 0,
  isLive = false,
  playing = false,
  volume = 1,
  muted = false,
  onSeek,
  onPlayPause,
  onSkip,
  onVolumeChange,
  onMuteToggle,
  onFullscreen,
}: SeekbarProps) => {
  const [position, setPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const consecutiveSeeksRef = useRef(0);
  const lastTargetPositionRef = useRef<number | null>(null);
  const dragPositionRef = useRef(0);

  const applySeek = useCallback(
    (newPos: number) => {
      consecutiveSeeksRef.current = 0;
      lastTargetPositionRef.current = newPos;
      if (onSeek) onSeek(newPos);
      setIsSeeking(false);

      setTimeout(() => {
        lastTargetPositionRef.current = null;
      }, 2000);
    },
    [onSeek],
  );

  // --- Utilidad: calcular posición a partir de un clientX ---
  const calcPositionFromClientX = useCallback(
    (clientX: number): number => {
      if (!trackRef.current || duration <= 0) return 0;
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );
      return ratio * duration;
    },
    [duration],
  );

  // --- Click directo sobre la barra (sin drag) ---
  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isLive || duration <= 0) return;
      // Ignorar el click si acabamos de soltar un drag
      if (isDragging) return;

      const newPos = calcPositionFromClientX(e.clientX);
      setPosition(newPos);
      applySeek(newPos);
    },
    [isLive, duration, isDragging, calcPositionFromClientX, applySeek],
  );

  // --- Drag handlers ---
  const handleDragMove = useCallback(
    (clientX: number) => {
      const newPos = calcPositionFromClientX(clientX);
      dragPositionRef.current = newPos;
      setPosition(newPos);
    },
    [calcPositionFromClientX],
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setIsSeeking(false);
    applySeek(dragPositionRef.current);
  }, [applySeek]);

  // Mouse events
  const onMouseMove = useCallback(
    (e: MouseEvent) => handleDragMove(e.clientX),
    [handleDragMove],
  );
  const onMouseUp = useCallback(() => handleDragEnd(), [handleDragEnd]);

  // Touch events
  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length > 0) handleDragMove(e.touches[0].clientX);
    },
    [handleDragMove],
  );
  const onTouchEnd = useCallback(() => handleDragEnd(), [handleDragEnd]);

  // Registrar/desregistrar listeners globales al hacer drag
  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDragging, onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  // Iniciar drag con mouse
  const handleThumbMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isLive || duration <= 0) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setIsSeeking(true);
      dragPositionRef.current = position;
    },
    [isLive, duration, position],
  );

  // Iniciar drag con touch
  const handleThumbTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isLive || duration <= 0) return;
      e.stopPropagation();
      setIsDragging(true);
      setIsSeeking(true);
      dragPositionRef.current = position;
    },
    [isLive, duration, position],
  );

  // Sincronización natural de playback vs seeking/dragging
  useEffect(() => {
    // Si hay preview de teclado, usarlo como posición absoluta
    if (previewSeekTime !== null && previewSeekTime !== undefined) {
      setPosition(previewSeekTime);
      return;
    }

    if (isSeeking || isDragging) return;

    if (lastTargetPositionRef.current !== null) {
      const diff = Math.abs(seekTime - lastTargetPositionRef.current);
      if (diff < 5) {
        lastTargetPositionRef.current = null;
        setPosition(seekTime);
      }
    } else {
      setPosition(seekTime);
    }
  }, [seekTime, previewSeekTime, isSeeking, isDragging]);

  // Cálculo visual
  const percentage = isLive
    ? 0
    : duration > 0
      ? (position / duration) * 100
      : 0;
  const loadedPercentage = isLive
    ? 0
    : duration > 0
      ? (loadedTime / duration) * 100
      : 0;
  const barColor = isLive ? "#888888" : "#FFFFFF";

  return (
    <div
      className="seekbar-wrapper"
      style={{ width: "100%" }}
    >
      {/* ═══════ LIVE: Controles simplificados ═══════ */}
      {isLive && (
        <LiveControls
          playing={playing}
          volume={volume}
          muted={muted}
          onPlayPause={onPlayPause}
          onVolumeChange={onVolumeChange}
          onMuteToggle={onMuteToggle}
          onFullscreen={onFullscreen}
        />
      )}

      {/* ═══════ VOD: Controles completos + Seekbar ═══════ */}
      {!isLive && (
        <>
          {/* Fila de controles */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginBottom: "10px",
              color: "var(--clr-primary-text)",
            }}
          >
            {/* Tiempo */}
            <div style={{ display: "flex", gap: "0.5rem", fontWeight: "normal" }}>
              <div style={{ textAlign: "start" }}>{formatTime(duration)}</div>
              <span>{" / "}</span>
              <div style={{ textAlign: "right" }}>{formatTime(position)}</div>
            </div>

            {/* Skip / Play / Skip */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <SkipButton seconds={-10} onClick={() => onSkip && onSkip(-10)} />
              <PlayPauseButton playing={playing} onClick={onPlayPause} />
              <SkipButton seconds={10} onClick={() => onSkip && onSkip(10)} />
            </div>

            {/* Volumen / Fullscreen */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <VolumeControl
                volume={volume}
                muted={muted}
                onVolumeChange={onVolumeChange}
                onMuteToggle={onMuteToggle}
              />
              <FullscreenButton onClick={onFullscreen} />
            </div>
          </div>

          {/* Barra de progreso */}
          <div
            ref={trackRef}
            className="seekbar-track"
            onClick={handleTrackClick}
            style={{
              width: "100%",
              height: "3px",
              backgroundColor: 'var(--clr-secondary)',
              borderRadius: "999px",
              position: "relative",
              transition: "outline 0.2s ease",
              opacity: 1,
              marginBottom: "10px",
              cursor: "pointer",
            }}
          >
            <div
              className="seekbar-loaded"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${loadedPercentage}%`,
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                borderRadius: "999px",
                transition: "width 0.2s linear",
              }}
            />
            <div
              className="seekbar-fill"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${percentage}%`,
                backgroundColor: barColor,
                borderRadius: "999px",
                transition: isSeeking || isDragging ? "none" : "width 0.2s linear",
              }}
            />
            <div
              className="seekbar-thumb"
              onMouseDown={handleThumbMouseDown}
              onTouchStart={handleThumbTouchStart}
              style={{
                position: "absolute",
                left: `${percentage}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "15px",
                height: "15px",
                backgroundColor: 'var(--clr-primary-title)',
                border: "3px solid #FFFFFF",
                borderRadius: "50%",
                cursor: isDragging ? "grabbing" : "grab",
                transition: isDragging ? "none" : "all 0.15s ease",
                touchAction: "none",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export const Seekbar = React.memo(SeekbarComponent);
