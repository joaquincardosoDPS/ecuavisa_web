import type { Chapter } from "@/interfaces/catalog.interface";

interface NextChapterCardProps {
  chapter: Chapter;
  onPlay: () => void;
}

export function NextChapterCard({ chapter, onPlay }: NextChapterCardProps) {
  return (
    <div
      onClick={onPlay}
      style={{
        position: "absolute",
        bottom: "12rem",
        left: "5rem",
        zIndex: 45,
        display: "flex",
        alignItems: "center",
        gap: "1.25rem",
        cursor: "pointer",
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(12px)",
        borderRadius: "12px",
        padding: "1rem",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        maxWidth: "32rem",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 0 20px var(--foc-primary, #ff1376)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <img
        src={chapter.image_land?.medium || chapter.image}
        alt={chapter.title}
        style={{
          width: "10rem",
          height: "5.6rem",
          objectFit: "cover",
          borderRadius: "8px",
          flexShrink: 0,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <span
          style={{
            color: "var(--foc-primary, #ff1376)",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Siguiente capítulo
        </span>
        <span
          style={{
            color: "#fff",
            fontSize: "1rem",
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          T{chapter.season}:E{chapter.chapter}
        </span>
        <span
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "0.8rem",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {chapter.title || chapter.name_program}
        </span>
      </div>
    </div>
  );
}
