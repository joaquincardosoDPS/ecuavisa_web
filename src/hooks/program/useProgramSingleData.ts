import { useState, useEffect, useRef } from "react";
import type { Program, Segment, Chapter } from "@/interfaces/catalog.interface";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { catalogService } from "@/services/catalogService";
import { useAnalytics } from "@/layout/AnalyticsWrapper";
import type { ActiveTab } from "@/pages/Program/components/TabsSingle";

const RELATED_LIMIT = 8;

interface UseProgramSingleDataReturn {
  chapter: Chapter | null;
  relatedPrograms: Program[];
  isLoadingRelatedPrograms: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  segments: Segment[];
  hasSegments: boolean;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeSeason: number | null;
  setActiveSeason: (season: number | null) => void;
  activeSegment: Segment | null;
  tabsRef: React.RefObject<HTMLDivElement | null>;
  scrollToTabs: () => void;
  requestScroll: () => void;
  handleChaptersLoaded: () => void;
}

export function useProgramSingleData(
  program: Program,
  setIsLoading: (loading: boolean) => void
): UseProgramSingleDataReturn {
  const { data: chapterData, isLoading: isLoadingChapters } = useQuery({
    queryKey: ["singleChapters", program.key],
    queryFn: () =>
      catalogService.getChapters({
        program: program.key,
        page: 1,
        limit: 1,
      }),
    enabled: !!program.key,
  });

  const category = program.category?.slug || program.name_category;

  const {
    data: relatedProgramsData,
    isLoading: isLoadingRelatedPrograms,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["relatedPrograms", program.key, category],
    queryFn: ({ pageParam = 1 }) =>
      catalogService.searchPrograms({
        slug_exclude: program.key,
        category,
        page: pageParam,
        limit: RELATED_LIMIT,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPageParam < lastPage.last_page) {
        return lastPageParam + 1;
      }
      return undefined;
    },
    enabled: !!program.key,
  });

  const relatedPrograms =
    relatedProgramsData?.pages.flatMap((page) => page.data) ?? [];
  const chapter = chapterData?.data?.[0] ?? null;
  const segments = program.segments ?? [];
  const hasSegments = segments.length > 0;

  // Tab activo: objeto de segmento, "related" o "details"
  const [activeTab, setActiveTabState] = useState<ActiveTab>(
    hasSegments ? segments[0] : "related"
  );
  const [activeSeason, setActiveSeason] = useState<number | null>(
    hasSegments ? (segments[0].all_temp?.[0] ?? null) : null
  );

  const tabsRef = useRef<HTMLDivElement>(null);
  const pendingScroll = useRef(false);

  const { trackPage } = useAnalytics();

  // Override del path para GA4
  const analyticsPath =
    typeof activeTab === "object" && activeTab.key
      ? `/programas/${program.key}/${activeTab.key}`
      : `/programas/${program.key}`;

  // Enviar page_view cuando cambia el tab/segmento (la URL no cambia)
  useEffect(() => {
    trackPage(analyticsPath);
  }, [analyticsPath, trackPage]);

  const scrollToTabs = () => {
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 50);
  };

  const requestScroll = () => {
    pendingScroll.current = true;
  };

  // Wrapper para setActiveTab que también dispara scroll
  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    requestScroll();
  };

  const handleChaptersLoaded = () => {
    if (pendingScroll.current) {
      pendingScroll.current = false;
      scrollToTabs();
    }
  };

  // Resetear temporada al cambiar de segmento
  useEffect(() => {
    if (typeof activeTab === "object" && activeTab.all_temp?.length > 0) {
       
      setActiveSeason(activeTab.all_temp[0]);
    }
  }, [activeTab]);

  // Notificar al padre que la vista está lista
  useEffect(() => {
    if (!isLoadingChapters && !isLoadingRelatedPrograms) {
      setIsLoading(false);
    }
  }, [isLoadingChapters, isLoadingRelatedPrograms, setIsLoading]);

  // Segmento activo para ChaptersContainer
  const activeSegment: Segment | null =
    typeof activeTab === "object" ? activeTab : null;

  return {
    chapter,
    relatedPrograms,
    isLoadingRelatedPrograms,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    segments,
    hasSegments,
    activeTab,
    setActiveTab,
    activeSeason,
    setActiveSeason,
    activeSegment,
    tabsRef,
    scrollToTabs,
    requestScroll,
    handleChaptersLoaded,
  };
}
