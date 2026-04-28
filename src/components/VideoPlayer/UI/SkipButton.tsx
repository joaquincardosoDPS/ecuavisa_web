import React, { useState } from "react";
import iconoRetrocederRaw from "@/assets/img/icons/iconos-retroceder.svg?raw";
import iconoAvanzarRaw from "@/assets/img/icons/iconos-avanzar.svg?raw";

interface SkipButtonProps {
  /** Segundos a saltar: negativo para retroceder, positivo para avanzar */
  seconds: number;
  onClick?: () => void;
}

const resizeSvg = (raw: string, size: number) =>
  raw.replace(/width="[^"]*"/, `width="${size}"`).replace(/height="[^"]*"/, `height="${size}"`);

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
        cursor: "pointer",
        padding: "8px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: hovered ? "var(--foc-primary)" : "var(--clr-text-primary-button)",
        transition: "color 0.15s ease",
      }}
      title={label}
    >
      <span
        style={{ display: "inline-flex", width: 32, height: 32 }}
        dangerouslySetInnerHTML={{
          __html: resizeSvg(isForward ? iconoAvanzarRaw : iconoRetrocederRaw, 32),
        }}
      />
    </button>
  );
};

export const SkipButton = React.memo(SkipButtonComponent);
