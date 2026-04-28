import type { Segment } from "@/interfaces/catalog.interface";
import { useChapters } from "@/hooks/useChapters";
import { useEffect } from "react";
import ChapterCard from "@/pages/Event/components/ChapterCard";

interface Props {
  slug: string;
  activeSegment: Segment | null;
  activeSeason: number | null;
  setActiveSeason: (season: number) => void;
  onLoaded?: () => void;
}
function ChaptersContainer({
  slug,
  activeSegment,
  activeSeason,
  setActiveSeason,
  onLoaded,
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
    if (!isLoadingChapters && chapters.length > 0 && onLoaded) {
      onLoaded();
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
              />
            ))}
          </div>
          {hasNextPage && (
            <div className="flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-12 py-3 border-2 border-white/30 text-white rounded-full font-bold hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFetchingNextPage ? "Cargando..." : "Ver más"}
              </button>
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
