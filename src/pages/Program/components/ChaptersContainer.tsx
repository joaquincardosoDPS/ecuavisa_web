import type { Chapter, Segment } from "@/interfaces/catalog.interface";
import { useChapters } from "@/hooks/useChapters";
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
    chapters: chaptersData,
    isLoading: isLoadingChapters,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChapters(slug, activeSeason, activeSegment?.key || null);

  const chapters =
    chaptersData?.pages?.flatMap((page) => page?.data || []) || [];

  useEffect(() => {
    if (!isLoadingChapters && onLoaded) {
      onLoaded();
    }
    if (!isLoadingChapters && chapters.length > 0 && onFirstChapter) {
      onFirstChapter(chapters[0]);
    }
  }, [isLoadingChapters]);

  return (
    <div className="flex flex-col gap-5 2xl:gap-10 animate-in fade-in duration-500 min-h-[calc(100vh-281px)]">
      <div className="grid grid-cols-5 2xl:grid-cols-8 gap-5">
        {activeSegment?.all_temp.map((temp) => {
          const isSeasonActive = activeSeason === temp;
          return (
            <div
              key={temp}
              onClick={() => setActiveSeason(temp)}
              className={`shrink-0 font-bold text-base transition-colors cursor-pointer ${isSeasonActive
                ? "text-white"
                : "text-(--clr-secondary-text) hover:text-white"
                }`}
            >
              Temporada {temp}
            </div>
          );
        })}
      </div>

      {isLoadingChapters ? (
        <p className="text-white">Cargando capítulos...</p>
      ) : chapters && chapters.length > 0 ? (
        <>
          <div className="grid grid-cols-5 gap-x-6 gap-y-10">
            {chapters.map((chapter, index) => (
              <ChapterCard
                key={`${chapter.key}-${index}`}
                chapter={chapter}
                index={index + 1}
                programKey={programKey}
                showChapter={showChapter}
              />
            ))}
          </div>
          {hasNextPage && (
            <div className="flex justify-center">
              <Button
                variant="tertiary"
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
        <p className="text-white">
          No hay capítulos disponibles para esta temporada.
        </p>
      )}
    </div>
  );
}

export default ChaptersContainer;
