import type { Chapter } from "@/interfaces/catalog.interface";

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
            <button
              onClick={onPlayNext}
              className="flex items-center gap-3 py-3.5 px-6 rounded-lg border-none cursor-pointer text-[0.95rem] bg-(--clr-primary-button) text-(--clr-text-primary-button) transition-transform duration-200 ease-out hover:bg-white hover:text-black"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Siguiente episodio en <span className="inline-block min-w-[2ch] text-center tabular-nums">{remainingSeconds}</span>s</span>
            </button>
          )}

          <button
            onClick={onGoToEpisodes}
            className="flex items-center gap-3 py-3.5 px-6 rounded-lg border border-white cursor-pointer text-[0.95rem] bg-transparent text-white transition-all duration-200 ease-out hover:bg-white hover:text-black"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
            </svg>
            <span>Listado de episodios</span>
          </button>
        </div>
      </div>
    </div>
  );
}
