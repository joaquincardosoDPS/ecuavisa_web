import React, { useState } from "react";
import iconoCast from "@/assets/img/icons/iconos-cast.svg";

interface CastButtonProps {
  onClick?: () => void;
}

const CastButtonComponent = ({ onClick }: CastButtonProps) => {
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
      title="Transmitir"
    >
      <img
        src={iconoCast}
        alt="Transmitir"
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

export const CastButton = React.memo(CastButtonComponent);
