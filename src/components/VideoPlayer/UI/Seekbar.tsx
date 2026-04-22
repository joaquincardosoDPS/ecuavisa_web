import React, { useCallback, useEffect, useRef, useState } from "react";

interface SeekbarProps {
  seekTime?: number;
  loadedTime?: number;
  duration?: number;
  isLive?: boolean;
  onSeek?: (time: number) => void;
  onSeekStart?: () => void;
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
  loadedTime = 0,
  duration = 0,
  isLive = false,
  onSeek,
}: SeekbarProps) => {
  const [position, setPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const consecutiveSeeksRef = useRef(0);
  const lastTargetPositionRef = useRef<number | null>(null);

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

  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isLive || duration <= 0) return;

    // Obtener la posición relativa del clic
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newPos = percentage * duration;

    setPosition(newPos);
    applySeek(newPos);
  }, [isLive, duration, applySeek]);


  // Sincronización natural de playback vs seeking
  useEffect(() => {
    if (isSeeking) return;

    if (lastTargetPositionRef.current !== null) {
      const diff = Math.abs(seekTime - lastTargetPositionRef.current);
      if (diff < 5) {
        lastTargetPositionRef.current = null;
        setPosition(seekTime);
      }
    } else {
      setPosition(seekTime);
    }
  }, [seekTime, isSeeking]);

  // Cálculo visual
  const percentage = isLive ? 0 : (duration > 0 ? (position / duration) * 100 : 0);
  const loadedPercentage = isLive ? 0 : (duration > 0 ? (loadedTime / duration) * 100 : 0);
  const barColor = isLive ? "#888888" : "#FFFFFF";

  return (
    <div
      className="seekbar-wrapper"
      style={{
        width: "100%",
      }}
    >
      {/* Barra de progreso */}
      <div
        className="seekbar-track"
        onClick={handleTrackClick}
        style={{
          width: "100%",
          height: "3px",
          backgroundColor: "#525252",
          borderRadius: "999px",
          position: "relative",
          transition: "outline 0.2s ease",
          opacity: 1,
          marginBottom: "10px",
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
            transition: isSeeking ? "none" : "width 0.2s linear",
          }}
        />
        {!isLive && (
          <div
            className="seekbar-thumb"
            style={{
              position: "absolute",
              left: `${percentage}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "30px",
              height: "30px",
              backgroundColor: "#FFFFFF",
              border: "3px solid #FFFFFF",
              borderRadius: "50%",
              transition: "all 0.15s ease",
            }}
          />
        )}
      </div>
      {!isLive && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold",
              width: "75px",
              textAlign: "start",
            }}
          >
            {formatTime(position)}
          </div>
          <div
            style={{
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold",
              width: "75px",
              textAlign: "right",
            }}
          >
            {formatTime(duration)}
          </div>
        </div>
      )}
    </div>
  );
};

export const Seekbar = React.memo(SeekbarComponent);
