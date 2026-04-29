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
        color: "#fff",
        fontSize: "1.5rem",
        gap: "1rem",
      }}
    >
      <span>{error || "Contenido no disponible"}</span>
      <button
        onClick={onBack}
        style={{
          padding: "0.75rem 2rem",
          border: "2px solid rgba(255,255,255,0.3)",
          borderRadius: "999px",
          background: "transparent",
          color: "#fff",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Volver
      </button>
    </div>
  );
}
