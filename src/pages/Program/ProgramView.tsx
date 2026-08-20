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
    handleChaptersLoaded,
  } = useProgramViewData(programDetail, slug, setIsLoading);

  return (
    <div className="mx-25">
      <Banner program={programDetail} firstChapter={firstChapter} />
      <div className="">
        <Tabs
          program={programDetail}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabsRef={tabsRef}
          scrollToTabs={scrollToTabs}
        />

        <div className="mt-5 2xl:mt-10 mb-10 2xl:mb-20">
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
