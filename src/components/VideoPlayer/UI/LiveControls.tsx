import React from "react";
import iconoPlayRaw from "@/assets/img/icons/iconos-play.svg?raw";
import iconoPauseRaw from "@/assets/img/icons/iconos-pause.svg?raw";
import iconoVolumenRaw from "@/assets/img/icons/iconos-volumen.svg?raw";
import iconoFullscreenRaw from "@/assets/img/icons/iconos-fullscreen.svg?raw";

interface LiveControlsProps {
  playing?: boolean;
  volume?: number;
  muted?: boolean;
  onPlayPause?: () => void;
  onVolumeChange?: (volume: number) => void;
  onMuteToggle?: () => void;
  onFullscreen?: () => void;
}

const ICON_SIZE = 30;

/* ─── Ícono SVG inline con color heredado ─── */
const InlineSvgIcon = ({
  rawSvg,
  size = ICON_SIZE,
}: {
  rawSvg: string;
  size?: number;
}) => (
  <span
    style={{
      display: "inline-flex",
      width: size,
      height: size,
      alignItems: "center",
      justifyContent: "center",
    }}
    dangerouslySetInnerHTML={{
      __html: rawSvg.replace(
        /width="[^"]*"/,
        `width="${size}"`
      ).replace(
        /height="[^"]*"/,
        `height="${size}"`
      ),
    }}
  />
);

/* ─── Botón reutilizable ─── */
const LiveButton = ({
  onClick,
  title,
  icon,
  size = ICON_SIZE,
}: {
  onClick?: () => void;
  title: string;
  icon: string;
  size?: number;
}) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: hovered ? "var(--foc-primary)" : "var(--clr-text-primary-button)",
        transition: "color 0.15s ease",
      }}
      title={title}
    >
      <InlineSvgIcon rawSvg={icon} size={size} />
    </button>
  );
};

/* ─── Badge "En Vivo" ─── */
const LiveBadge = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      color: "var(--clr-primary-text)",
      fontSize: "0.85rem",
      fontWeight: 600,
      letterSpacing: "0.5px",
      userSelect: "none",
    }}
  >
    <span
      style={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: "var(--foc-primary)",
        animation: "livePulse 1.5s ease-in-out infinite",
      }}
    />
    EN VIVO
    <style>{`
      @keyframes livePulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
    `}</style>
  </div>
);

/* ─── Componente principal ─── */
const LiveControlsComponent = ({
  playing = false,
  volume = 1,
  muted = false,
  onPlayPause,
  onVolumeChange,
  onMuteToggle,
  onFullscreen,
}: LiveControlsProps) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Izquierda: Play/Pause + En Vivo */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <LiveButton
          onClick={onPlayPause}
          title={playing ? "Pausar" : "Ver ahora"}
          icon={playing ? iconoPauseRaw : iconoPlayRaw}
        />
        <LiveBadge />
      </div>

      {/* Derecha: Volumen + Fullscreen */}
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <VolumePopover
          volume={volume}
          muted={muted}
          onVolumeChange={onVolumeChange}
          onMuteToggle={onMuteToggle}
        />
        <LiveButton
          onClick={onFullscreen}
          title="Pantalla completa"
          icon={iconoFullscreenRaw}
        />
      </div>
    </div>
  );
};

/* ─── Volumen con popover ─── */
const VolumePopover = ({
  volume,
  muted,
  onVolumeChange,
  onMuteToggle,
}: {
  volume: number;
  muted: boolean;
  onVolumeChange?: (v: number) => void;
  onMuteToggle?: () => void;
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      style={{ position: "relative", display: "flex", alignItems: "center" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={onMuteToggle}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isHovered ? "var(--foc-primary)" : "var(--clr-text-primary-button)",
          opacity: muted ? 0.5 : 1,
          transition: "color 0.15s ease, opacity 0.15s ease",
        }}
        title={muted ? "Activar sonido" : "Silenciar"}
      >
        <InlineSvgIcon rawSvg={iconoVolumenRaw} />
      </button>

      {/* Slider vertical */}
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
            onChange={(e) => onVolumeChange?.(parseFloat(e.target.value))}
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

export const LiveControls = React.memo(LiveControlsComponent);
