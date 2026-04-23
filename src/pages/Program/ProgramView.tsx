import { useParams } from "react-router-dom";
import { useProgramDetail } from "@/hooks/useProgramDetail";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import { useState, useEffect } from "react";
import type { Segment } from "@/interfaces/catalog.interface";
import Banner from "./components/Banner";
import Tabs from "./components/Tabs";
import DetailsProgram from "./components/DetailsProgram";
import ChaptersContainer from "./components/ChaptersContainer";

function ProgramView() {
  const { slug } = useParams<{ slug: string }>();
  const {
    data: programDetail,
    isLoading,
    isError,
  } = useProgramDetail(slug || "");
  const [activeSegment, setActiveSegment] = useState<Segment | null>(null);
  const [activeSeason, setActiveSeason] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);

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

  if (isLoading) {
    return <FullScreenSpinner message="Cargando Programa..." />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error al cargar el programa
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative">
      <Banner program={programDetail} />
      <Tabs
        program={programDetail}
        activeSegment={activeSegment}
        setActiveSegment={setActiveSegment}
        showDetails={showDetails}
        setShowDetails={setShowDetails}
      />

      <div className="mx-25 mt-10 mb-20">
        {showDetails ? (
          <DetailsProgram programDetail={programDetail} />
        ) : (
          <ChaptersContainer
            slug={slug || ""}
            activeSegment={activeSegment}
            activeSeason={activeSeason}
            setActiveSeason={setActiveSeason}
          />
        )}
      </div>
    </div>
  );
}

export default ProgramView;
