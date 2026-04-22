import React from "react";
import iconoVolver from "@/assets/img/icons/iconos-volver.svg";

interface PlayerTopBarProps {
  title: string;
  description?: string;
  isVisible: boolean;
  isLive?: boolean;
  onBackClick?: () => void;
  isNextEpisodeOverlayVisible?: boolean;
}

const PlayerTopBarComponent = ({
  title,
  description,
  isVisible,
  isLive = false,
  onBackClick,
  isNextEpisodeOverlayVisible,
}: PlayerTopBarProps) => {

  return (
    <div
      style={{
        position: "fixed",
        top: 62, // 12 * 8
        left: 40, // 12 * 8
        zIndex: 2001,
        opacity: isVisible ? 1 : 0,
        transition: "opacity .3s ease",
        pointerEvents: isVisible ? "auto" : "none",
        display: "flex",
        alignItems: "start",
        gap: "16px", // spacing(2)
      }}
    >
      {/* Botón Volver */}
      {!isLive && (
        <button
          onClick={onBackClick}
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            border: "2px solid rgba(255, 255, 255, 0.6)",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            outline: "none",
            transition: "all 0.2s ease",
            padding: 0,
            flexShrink: 0,
          }}
        >
          <img src={iconoVolver} alt="Volver" width={22} height={22} />
        </button>
      )}

      {/* Textos */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          color: "#fff",
          pointerEvents: "none",
          maxWidth: "80vw",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontWeight: 800,
            fontSize: "2.5rem",
            lineHeight: 1,
          }}
        >
          {title}
        </h1>
        {description && (
          <h2
            style={{
              marginTop: "10px",
              fontWeight: 500,
              fontSize: "1.5rem",
              opacity: 0.9,
            }}
          >
            {description}
          </h2>
        )}
      </div>
    </div>
  );
};

export const PlayerTopBar = React.memo(PlayerTopBarComponent);
