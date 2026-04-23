import React, { useState } from "react";
import iconoRetroceder from "@/assets/img/icons/iconos-retroceder.svg";
import iconoAvanzar from "@/assets/img/icons/iconos-avanzar.svg";

interface SkipButtonProps {
  /** Segundos a saltar: negativo para retroceder, positivo para avanzar */
  seconds: number;
  onClick?: () => void;
}

const SkipButtonComponent = ({ seconds, onClick }: SkipButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const isForward = seconds > 0;
  const label = isForward
    ? `Avanzar ${Math.abs(seconds)} segundos`
    : `Retroceder ${Math.abs(seconds)} segundos`;

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
      title={label}
    >
      <img
        src={isForward ? iconoAvanzar : iconoRetroceder}
        alt={label}
        width={24}
        height={24}
        style={{
          filter: hovered ? "brightness(1.38)" : "none",
          transition: "filter 0.15s ease",
        }}
      />
    </button>
  );
};

export const SkipButton = React.memo(SkipButtonComponent);
