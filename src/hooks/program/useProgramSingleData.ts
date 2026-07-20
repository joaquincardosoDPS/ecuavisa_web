import { useState, useEffect, useRef } from "react";
import type { Program, Segment, Chapter } from "@/interfaces/catalog.interface";
import { useQuery } from "@tanstack/react-query";
import { catalogService } from "@/services/catalogService";
import { useAnalytics } from "@/layout/AnalyticsWrapper";
import type { ActiveTab } from "@/pages/Program/components/TabsSingle";

interface UseProgramSingleDataReturn {
  chapter: Chapter | null;
  relatedPrograms: Program[];
  isLoadingRelatedPrograms: boolean;
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
        no_segments: true,
      }),
    enabled: !!program.key,
  });

  const { data: relatedProgramsData, isLoading: isLoadingRelatedPrograms } =
    useQuery({
      queryKey: ["relatedPrograms", program.key],
      queryFn: () =>
        catalogService.searchPrograms({
          slug_exclude: program.key,
          category: program.name_category,
        }),
      enabled: !!program.key,
    });

  const relatedPrograms = relatedProgramsData?.data ?? [];
  const chapter = chapterData?.data?.[0] ?? null;
  const segments = program.segments ?? [];
  const hasSegments = segments.length > 0;

  // Tab activo: objeto de segmento, "related" o "details"
  const [activeTab, setActiveTabState] = useState<ActiveTab>(
    hasSegments ? segments[0] : "related"
  );
  const [activeSeason, setActiveSeason] = useState<number | null>(
    hasSegments ? (segments[0].all_temp?.[0] ?? 1) : null
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
