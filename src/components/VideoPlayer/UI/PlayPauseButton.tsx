import React, { useState } from "react";
import iconoPlay from "@/assets/img/icons/iconos-play.svg";
import iconoPause from "@/assets/img/icons/iconos-pause.svg";

interface PlayPauseButtonProps {
  playing?: boolean;
  onClick?: () => void;
}

const PlayPauseButtonComponent = ({
  playing = false,
  onClick,
}: PlayPauseButtonProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "none",
        border: "none",
        color: "#fff",
        cursor: "pointer",
        padding: "8px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
      }}
      title={playing ? "Pausar" : "Reproducir"}
    >
      <img
        src={playing ? iconoPause : iconoPlay}
        alt={playing ? "Pausar" : "Reproducir"}
        width={20}
        height={20}
        style={{
          filter: hovered ? "brightness(1)" : "brightness(0.725)",
          transition: "filter 0.15s ease",
        }}
      />
    </button>
  );
};

export const PlayPauseButton = React.memo(PlayPauseButtonComponent);
