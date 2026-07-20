import { useState, useEffect, useRef } from "react";
import type { Program, Segment, Chapter } from "@/interfaces/catalog.interface";
import { useAnalytics } from "@/layout/AnalyticsWrapper";

interface UseProgramViewDataReturn {
  activeSegment: Segment | null;
  setActiveSegment: (segment: Segment | null) => void;
  activeSeason: number | null;
  setActiveSeason: (season: number | null) => void;
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
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
  const [activeSegment, setActiveSegment] = useState<Segment | null>(null);
  const [activeSeason, setActiveSeason] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [firstChapter, setFirstChapter] = useState<Chapter | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const pendingScroll = useRef(false);

  const { trackPage } = useAnalytics();

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

  // Solo hace scroll si se pidió desde un clic en tab
  const handleChaptersLoaded = () => {
    setIsLoading(false);
    if (pendingScroll.current) {
      pendingScroll.current = false;
      scrollToTabs();
    }
  };

  // Inicialización por defecto
  useEffect(() => {
    if (
      program?.segments &&
      program.segments.length > 0 &&
      !activeSegment
    ) {
      const firstSegment = program.segments[0];
       
      setActiveSegment(firstSegment);
      if (firstSegment.all_temp && firstSegment.all_temp.length > 0) {
         
        setActiveSeason(firstSegment.all_temp[0]);
      }
    }
  }, [program, activeSegment]);

  // Reset de temporada al cambiar de segmento manualmente
  useEffect(() => {
    if (activeSegment?.all_temp && activeSegment.all_temp.length > 0) {
       
      setActiveSeason(activeSegment.all_temp[0]);
    }
  }, [activeSegment]);

  return {
    activeSegment,
    setActiveSegment,
    activeSeason,
    setActiveSeason,
    showDetails,
    setShowDetails,
    firstChapter,
    setFirstChapter,
    tabsRef,
    scrollToTabs,
    requestScroll,
    handleChaptersLoaded,
  };
}
