import type { Program } from "@/interfaces/catalog.interface";
import { useProgramSingleData } from "@/hooks/program/useProgramSingleData";
import Banner from "./components/Banner";
import DetailsProgram from "./components/DetailsProgram";
import TabsSingle from "./components/TabsSingle";
import RelatedProgramsContainer from "./components/RelatedProgramsContainer";
import ChaptersContainer from "./components/ChaptersContainer";

interface ProgramSingleViewProps {
    program: Program;
    setIsLoading: (loading: boolean) => void;
}

function ProgramSingleView({ program: programDetail, setIsLoading }: ProgramSingleViewProps) {

    const {
        chapter,
        relatedPrograms,
        isLoadingRelatedPrograms,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        segments,
        activeTab,
        setActiveTab,
        activeSeason,
        setActiveSeason,
        activeSegment,
        tabsRef,
        scrollToTabs,
        handleChaptersLoaded,
    } = useProgramSingleData(programDetail, setIsLoading);

    return (
        <div className="min-h-screen w-full relative">
            <Banner program={programDetail} isSingle={true} chapter={chapter ?? undefined} />
            <TabsSingle
                segments={segments}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabsRef={tabsRef}
                scrollToTabs={scrollToTabs}
            />

            <div className="mx-25 mt-5 2xl:mt-10 mb-10 2xl:mb-20">
                {activeTab === "details" ? (
                    <DetailsProgram programDetail={programDetail} />
                ) : activeSegment ? (
                    <ChaptersContainer
                        slug={programDetail.key}
                        programKey={programDetail.key}
                        activeSegment={activeSegment}
                        activeSeason={activeSeason}
                        setActiveSeason={setActiveSeason}
                        onLoaded={handleChaptersLoaded}
                    />
                ) : (
                    <RelatedProgramsContainer
                        programs={relatedPrograms}
                        isLoading={isLoadingRelatedPrograms}
                        isFetchingNextPage={isFetchingNextPage}
                        hasNextPage={hasNextPage}
                        fetchNextPage={fetchNextPage}
                    />
                )}
            </div>
        </div>
    );
}

export default ProgramSingleView;
