import { useState } from "react";
import iconosExpandirRaw from "@/assets/img/icons/iconos-expandir.svg?raw";
import iconosContraerRaw from "@/assets/img/icons/iconos-contraer.svg?raw";

interface ExpandButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}

const resizeSvg = (raw: string, size: number) =>
  raw.replace(/width="[^"]*"/, `width="${size}"`).replace(/height="[^"]*"/, `height="${size}"`);

function ExpandButton({ isExpanded, onClick }: ExpandButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="absolute bottom-4 right-4 z-10000 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
      style={{
        backgroundColor: hovered ? "var(--foc-primary)" : "rgba(0, 0, 0, 0.6)",
        color: hovered ? "#fff" : "var(--clr-secondary-text)",
        transition: "background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease",
      }}
      title={isExpanded ? "Contraer" : "Expandir"}
    >
      <span
        style={{ display: "inline-flex", width: 20, height: 20 }}
        dangerouslySetInnerHTML={{
          __html: resizeSvg(isExpanded ? iconosContraerRaw : iconosExpandirRaw, 20),
        }}
      />
    </button>
  );
}

export default ExpandButton;
