import type { Program } from "@/interfaces/catalog.interface";
import { useProgramViewData } from "@/hooks/program/useProgramViewData";
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

  const {
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
  } = useProgramViewData(programDetail, slug, setIsLoading);

  return (
    <div className="ml-40">
      <Banner program={programDetail} firstChapter={firstChapter} />
      <div className="">
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

        <div className="mb-10 2xl:mb-20">
          {showDetails ? (
            <DetailsProgram programDetail={programDetail} />
          ) : (
            <ChaptersContainer
              slug={slug || ""}
              programKey={programDetail.key}
              activeSegment={activeSegment}
              activeSeason={activeSeason}
              setActiveSeason={setActiveSeason}
              onLoaded={handleChaptersLoaded}
              onFirstChapter={setFirstChapter}
              showChapter={programDetail.active_number}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgramView;
