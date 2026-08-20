import { useState, useEffect, useRef } from "react";
import type { Program, Segment, Chapter } from "@/interfaces/catalog.interface";
import { useAnalytics } from "@/layout/AnalyticsWrapper";
import type { ActiveTab } from "@/pages/Program/components/Tabs";

interface UseProgramViewDataReturn {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeSegment: Segment | null;
  showDetails: boolean;
  activeSeason: number | null;
  setActiveSeason: (season: number | null) => void;
  firstChapter: Chapter | null;
  setFirstChapter: (chapter: Chapter | null) => void;
  tabsRef: React.RefObject<HTMLDivElement | null>;
  scrollToTabs: () => void;
  requestScroll: () => void;
  handleChaptersLoaded: () => void;
}

export function useProgramViewData(
  program: Program,
  slug: string,
  setIsLoading: (loading: boolean) => void
): UseProgramViewDataReturn {
  const firstSegment = program.segments?.[0] ?? null;

  const [activeTab, setActiveTabState] = useState<ActiveTab>(
    firstSegment ?? "details"
  );
  const [activeSeason, setActiveSeason] = useState<number | null>(
    firstSegment?.all_temp?.[0] ?? null
  );
  const [firstChapter, setFirstChapter] = useState<Chapter | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const pendingScroll = useRef(false);

  const { trackPage } = useAnalytics();

  // Segmento activo derivado del tab
  const activeSegment: Segment | null =
    typeof activeTab === "object" ? activeTab : null;
  const showDetails = activeTab === "details";

  // Override del path para GA4: /programas/{slug}/{segmento}
  const analyticsPath = activeSegment?.key
    ? `/programas/${slug}/${activeSegment.key}`
    : `/programas/${slug}`;

  // Enviar page_view cuando cambia el segmento (la URL no cambia)
  useEffect(() => {
    trackPage(analyticsPath);
  }, [analyticsPath, trackPage]);

  const scrollToTabs = () => {
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 50);
  };

  // Marca que el próximo onLoaded debe hacer scroll
  const requestScroll = () => {
    pendingScroll.current = true;
  };

  // Wrapper para setActiveTab que también dispara scroll
  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    requestScroll();
  };

  // Solo hace scroll si se pidió desde un clic en tab
  const handleChaptersLoaded = () => {
    setIsLoading(false);
    if (pendingScroll.current) {
      pendingScroll.current = false;
      scrollToTabs();
    }
  };

  // Reset de temporada al cambiar de segmento manualmente
  useEffect(() => {
    if (activeSegment?.all_temp && activeSegment.all_temp.length > 0) {
      setActiveSeason(activeSegment.all_temp[0]);
    }
  }, [activeSegment]);

  return {
    activeTab,
    setActiveTab,
    activeSegment,
    showDetails,
    activeSeason,
    setActiveSeason,
    firstChapter,
    setFirstChapter,
    tabsRef,
    scrollToTabs,
    requestScroll,
    handleChaptersLoaded,
  };
}
