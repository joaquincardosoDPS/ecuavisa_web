import Button from "@/components/ui/Button";

interface PlayerErrorProps {
  error: string | null;
  onBack: () => void;
}

export function PlayerError({ error, onBack }: PlayerErrorProps) {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#000",
        color: 'var(--clr-icon)',
        fontSize: "1.5rem",
        gap: "1rem",
      }}
    >
      <span>{error || "Contenido no disponible"}</span>
      <Button variant="tertiary" onClick={onBack} className="rounded-full">
        Volver
      </Button>
    </div>
  );
}
