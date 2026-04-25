import React, { useState } from "react";
import iconoVolumenRaw from "@/assets/img/icons/iconos-volumen.svg?raw";

interface VolumeControlProps {
  volume?: number;
  muted?: boolean;
  onVolumeChange?: (volume: number) => void;
  onMuteToggle?: () => void;
}

const resizeSvg = (raw: string, size: number) =>
  raw.replace(/width="[^"]*"/, `width="${size}"`).replace(/height="[^"]*"/, `height="${size}"`);

const VolumeControlComponent = ({
  volume = 1,
  muted = false,
  onVolumeChange,
  onMuteToggle,
}: VolumeControlProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Botón de mute */}
      <button
        onClick={onMuteToggle}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isHovered ? "var(--foc-primary)" : "#b9b9b9",
          opacity: muted ? 0.5 : 1,
          transition: "color 0.15s ease, opacity 0.15s ease",
        }}
        title={muted ? "Activar sonido" : "Silenciar"}
      >
        <span
          style={{ display: "inline-flex", width: 28, height: 28 }}
          dangerouslySetInnerHTML={{
            __html: resizeSvg(iconoVolumenRaw, 28),
          }}
        />
      </button>

      {/* Slider vertical flotante */}
      <div
        style={{
          position: "absolute",
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          paddingBottom: "12px",
          opacity: isHovered ? 1 : 0,
          pointerEvents: isHovered ? "auto" : "none",
          transition: "opacity 0.2s ease",
        }}
      >
        <div
          style={{
            padding: "12px 8px",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) =>
            onVolumeChange && onVolumeChange(parseFloat(e.target.value))
          }
          style={{
            writingMode: "vertical-lr",
            direction: "rtl",
            width: "4px",
            height: "80px",
            accentColor: "#fff",
            cursor: "pointer",
            appearance: "auto",
          }}
          title="Volumen"
        />
        </div>
      </div>
    </div>
  );
};

export const VolumeControl = React.memo(VolumeControlComponent);
