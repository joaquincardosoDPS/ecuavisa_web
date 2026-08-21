import type { Chapter, ChapterWithHistory, Segment } from "@/interfaces/catalog.interface";
import { useChapters } from "@/hooks/program/useChapters";
import { useEffect } from "react";
import ChapterCard from "@/pages/Event/components/ChapterCard";
import Button from "@/components/ui/Button";

interface Props {
  slug: string;
  programKey: string;
  activeSegment: Segment | null;
  activeSeason: number | null;
  setActiveSeason: (season: number) => void;
  onLoaded?: () => void;
  onFirstChapter?: (chapter: Chapter) => void;
  showChapter?: boolean;
}
function ChaptersContainer({
  slug,
  programKey,
  activeSegment,
  activeSeason,
  setActiveSeason,
  onLoaded,
  onFirstChapter,
  showChapter = true,
}: Props) {
  const {
    chaptersWithHistory,
    isLoading: isLoadingChapters,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChapters(slug, activeSeason, activeSegment?.key || null);

  useEffect(() => {
    if (!isLoadingChapters && onLoaded) {
      onLoaded();
    }
    if (!isLoadingChapters && chaptersWithHistory.length > 0 && onFirstChapter) {
      onFirstChapter(chaptersWithHistory[0]);
    }
  }, [isLoadingChapters]);

  return (
    <div className="flex flex-col mr-40 gap-5 2xl:gap-10 animate-in fade-in duration-500 min-h-[calc(100vh-281px)]">
      {activeSegment?.all_temp && activeSegment.all_temp.length > 0 && (
        <div className="grid grid-cols-5 2xl:grid-cols-8 gap-5">
          {activeSegment.all_temp.map((temp) => {
            const isSeasonActive = activeSeason === temp;
            return (
              <div
                key={temp}
                onClick={() => setActiveSeason(temp)}
                className={`shrink-0 font-bold text-base transition-colors cursor-pointer ${isSeasonActive
                  ? "text-(--clr-primary-title)"
                  : "text-(--clr-secondary-text) hover:text-(--clr-primary-title)"
                  }`}
              >
                Temporada {temp}
              </div>
            );
          })}
        </div>
      )}

      {isLoadingChapters ? (
        <p className="text-(--clr-primary-title)">Cargando capítulos...</p>
      ) : chaptersWithHistory && chaptersWithHistory.length > 0 ? (
        <>
          <div className="grid grid-cols-5 gap-x-6 gap-y-10">
            {chaptersWithHistory.map((chapter: ChapterWithHistory, index: number) => (
              <ChapterCard
                key={`${chapter.key}-${index}`}
                chapter={chapter}
                index={index + 1}
                programKey={programKey}
                showChapter={showChapter}
                playbackTime={chapter.playbackTime}
                isFinished={chapter.isFinished}
              />
            ))}
          </div>
          {hasNextPage && (
            <div className="flex justify-center">
              <Button
                variant="primary"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-full"
              >
                {isFetchingNextPage ? "Cargando..." : "Ver más"}
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="text-(--clr-primary-title)">
          No hay capítulos disponibles para esta temporada.
        </p>
      )}
    </div>
  );
}

export default ChaptersContainer;
