import type { Chapter } from "@/interfaces/catalog.interface";
import Button from "@/components/ui/Button";

interface ShrunkBackdropProps {
  chapterImage: string;
  nextChapter: Chapter | null;
  programTitle: string;
  remainingSeconds: number;
  onPlayNext: () => void;
  onGoToEpisodes: () => void;
}

export function ShrunkBackdrop({
  chapterImage,
  nextChapter,
  programTitle,
  remainingSeconds,
  onPlayNext,
  onGoToEpisodes,
}: ShrunkBackdropProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 40,
        background: `url(${chapterImage}) center/cover no-repeat #000`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />

      {/* Action buttons */}
      <div
        style={{
          position: "absolute",
          top: "12rem",
          left: "5rem",
          zIndex: 45,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h1 className="text-5xl font-bold text-white line-height-7 mb-5">{programTitle}</h1>
        {nextChapter &&
          <p className="text-white max-w-[50%]">{nextChapter.description}</p>}
        <div className="flex flex-row gap-5 mt-5">
          {nextChapter && (
            <Button variant="primary" showArrow onClick={onPlayNext}>
              Siguiente episodio en <span className="inline-block min-w-[2ch] text-center tabular-nums">{remainingSeconds}</span>s
            </Button>
          )}

          <Button variant="tertiary" onClick={onGoToEpisodes}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
            Listado de episodios
          </Button>
        </div>
      </div>
    </div>
  );
}
