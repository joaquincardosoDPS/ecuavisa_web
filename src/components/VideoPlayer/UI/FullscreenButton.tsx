import React, { useState } from "react";
import iconoFullscreen from "@/assets/img/icons/iconos-fullscreen.svg";

interface FullscreenButtonProps {
  onClick?: () => void;
}

const FullscreenButtonComponent = ({ onClick }: FullscreenButtonProps) => {
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
      }}
      title="Pantalla completa"
    >
      <img
        src={iconoFullscreen}
        alt="Pantalla completa"
        width={22}
        height={22}
        style={{
          filter: hovered ? "brightness(1.38)" : "none",
          transition: "filter 0.15s ease",
        }}
      />
    </button>
  );
};

export const FullscreenButton = React.memo(FullscreenButtonComponent);
