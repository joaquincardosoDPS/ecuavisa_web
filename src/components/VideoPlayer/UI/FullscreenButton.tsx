import React, { useState } from "react";
import iconoFullscreenRaw from "@/assets/img/icons/iconos-fullscreen.svg?raw";

interface FullscreenButtonProps {
  onClick?: () => void;
}

const resizeSvg = (raw: string, size: number) =>
  raw.replace(/width="[^"]*"/, `width="${size}"`).replace(/height="[^"]*"/, `height="${size}"`);

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
        cursor: "pointer",
        padding: "8px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: hovered ? "var(--foc-primary)" : "#b9b9b9",
        transition: "color 0.15s ease",
      }}
      title="Pantalla completa"
    >
      <span
        style={{ display: "inline-flex", width: 28, height: 28 }}
        dangerouslySetInnerHTML={{
          __html: resizeSvg(iconoFullscreenRaw, 28),
        }}
      />
    </button>
  );
};

export const FullscreenButton = React.memo(FullscreenButtonComponent);
