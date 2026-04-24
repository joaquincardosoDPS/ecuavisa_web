import React from "react";
import iconoVolver from "@/assets/img/icons/iconos-volver.svg";

interface PlayerTopBarProps {
  title: string;
  description?: string;
  isVisible: boolean;
  isLive?: boolean;
  onBackClick?: () => void;
}

const PlayerTopBarComponent = ({
  title,
  description,
  isVisible,
  isLive = false,
  onBackClick,
}: PlayerTopBarProps) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 44,
        left: 40,
        right: 40,
        zIndex: 2001,
        opacity: isVisible ? 1 : 0,
        transition: "opacity .3s ease",
        pointerEvents: isVisible ? "auto" : "none",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "10px",
        color: "#b9b9b9",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {/* Botón Volver */}
        {!isLive && (
          <button
            onClick={onBackClick}
            onMouseEnter={(e) => {
              const img = e.currentTarget.querySelector("img");
              if (img) img.style.filter = "brightness(1)";
            }}
            onMouseLeave={(e) => {
              const img = e.currentTarget.querySelector("img");
              if (img) img.style.filter = "brightness(0.725)";
            }}
            style={{
              width: "56px",
              height: "56px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              outline: "none",
              padding: 0,
              flexShrink: 0,
              background: "none",
              border: "none",
            }}
          >
            <img
              src={iconoVolver}
              alt="Volver"
              style={{
                filter: "brightness(0.725)",
                transition: "filter 0.15s ease",
              }}
            />
          </button>
        )}

        {/* Textos */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            pointerEvents: "none",
            maxWidth: "60vw",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontWeight: 500,
              fontSize: "1.4rem",
              lineHeight: 1,
            }}
          >
            {title}
          </h1>
          {description && (
            <h2
              style={{
                fontWeight: 500,
                fontSize: "1rem",
                opacity: 0.9,
              }}
            >
              {description}
            </h2>
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "start",
          justifyContent: "start",
          gap: "10px",
        }}
      >
        {/* <CastButton />
        <SubtitlesButton /> */}
      </div>
    </div>
  );
};

export const PlayerTopBar = React.memo(PlayerTopBarComponent);
