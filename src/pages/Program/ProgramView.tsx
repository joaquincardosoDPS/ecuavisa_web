import { useState, useEffect, useRef, useCallback } from "react";
import type { Program, Segment } from "@/interfaces/catalog.interface";
import Banner from "./components/Banner";
import Tabs from "./components/Tabs";
import DetailsProgram from "./components/DetailsProgram";
import ChaptersContainer from "./components/ChaptersContainer";

interface ProgramViewProps {
  program: Program;
  slug: string;
  setIsLoading: (loading: boolean) => void;
}

function ProgramView({ program: programDetail, slug, setIsLoading }: ProgramViewProps) {

  const [activeSegment, setActiveSegment] = useState<Segment | null>(null);
  const [activeSeason, setActiveSeason] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const pendingScroll = useRef(false);

  const scrollToTabs = useCallback(() => {
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 50);
  }, []);

  // Marca que el próximo onLoaded debe hacer scroll
  const requestScroll = useCallback(() => {
    pendingScroll.current = true;
  }, []);

  // Solo hace scroll si se pidió desde un clic en tab
  const handleChaptersLoaded = useCallback(() => {
    setIsLoading(false);
    if (pendingScroll.current) {
      pendingScroll.current = false;
      scrollToTabs();
    }
  }, [scrollToTabs, setIsLoading]);

  // Inicialización por defecto
  useEffect(() => {
    if (
      programDetail?.segments &&
      programDetail.segments.length > 0 &&
      !activeSegment
    ) {
      const firstSegment = programDetail.segments[0];
      setActiveSegment(firstSegment);
      if (firstSegment.all_temp && firstSegment.all_temp.length > 0) {
        setActiveSeason(firstSegment.all_temp[0]);
      }
    }
  }, [programDetail, activeSegment]);

  // Reset de temporada al cambiar de segmento manualmente
  useEffect(() => {
    if (activeSegment?.all_temp && activeSegment.all_temp.length > 0) {
      setActiveSeason(activeSegment.all_temp[0]);
    }
  }, [activeSegment]);


  return (
    <div className="min-h-screen w-full relative">
      <Banner program={programDetail} />
      <Tabs
        program={programDetail}
        activeSegment={activeSegment}
        setActiveSegment={setActiveSegment}
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        tabsRef={tabsRef}
        scrollToTabs={scrollToTabs}
        requestScroll={requestScroll}
      />

      <div className="mx-25 mt-5 2xl:mt-10 mb-10 2xl:mb-20">
        {showDetails ? (
          <DetailsProgram programDetail={programDetail} />
        ) : (
          <ChaptersContainer
            slug={slug || ""}
            activeSegment={activeSegment}
            activeSeason={activeSeason}
            setActiveSeason={setActiveSeason}
            onLoaded={handleChaptersLoaded}
          />
        )}
      </div>
    </div>
  );
}

export default ProgramView;

