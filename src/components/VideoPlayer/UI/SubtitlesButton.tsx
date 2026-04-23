import React, { useState } from "react";
import iconoSubtitle from "@/assets/img/icons/iconos-subtitle.svg";

interface SubtitlesButtonProps {
  active?: boolean;
  onClick?: () => void;
}

const SubtitlesButtonComponent = ({
  active = false,
  onClick,
}: SubtitlesButtonProps) => {
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
      }}
      title={active ? "Desactivar subtítulos" : "Activar subtítulos"}
    >
      <img
        src={iconoSubtitle}
        alt="Subtítulos"
        width={22}
        height={22}
        style={{
          filter: active || hovered ? "brightness(1.38)" : "none",
          transition: "filter 0.15s ease",
        }}
      />
    </button>
  );
};

export const SubtitlesButton = React.memo(SubtitlesButtonComponent);
