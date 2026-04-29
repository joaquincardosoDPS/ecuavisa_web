import { useState, useRef, useCallback, useEffect } from "react";
import type { Program } from "@/interfaces/catalog.interface";
import { useQuery } from "@tanstack/react-query";
import { catalogService } from "@/services/catalogService";
import Banner from "./components/Banner";
import DetailsProgram from "./components/DetailsProgram";
import TabsSingle from "./components/TabsSingle";
import RelatedProgramsContainer from "./components/RelatedProgramsContainer";

interface ProgramSingleViewProps {
    program: Program;
    setIsLoading: (loading: boolean) => void;
}

function ProgramSingleView({ program: programDetail, setIsLoading }: ProgramSingleViewProps) {

    const { data: chapterData, isLoading: isLoadingChapters } = useQuery({
        queryKey: ['singleChapters', programDetail.key],
        queryFn: () => catalogService.getChapters({
            program: programDetail.key,
            no_segments: true,
        }),
        enabled: !!programDetail.key,
    });

    const { data: relatedProgramsData, isLoading: isLoadingRelatedPrograms } = useQuery({
        queryKey: ['relatedPrograms', programDetail.key],
        queryFn: () => catalogService.searchPrograms({ slug_exclude: programDetail.key, category: programDetail.category?.slug }),
        enabled: !!programDetail.key,
    });

    const relatedPrograms = relatedProgramsData?.data ?? [];
    const chapter = chapterData?.data?.[0] ?? null;

    const [showDetails, setShowDetails] = useState(false);
    const tabsRef = useRef<HTMLDivElement>(null);

    const scrollToTabs = useCallback(() => {
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }, 50);
    }, []);

    // Signal parent that this view is ready when all data loads
    useEffect(() => {
        if (!isLoadingChapters && !isLoadingRelatedPrograms) {
            setIsLoading(false);
        }
    }, [isLoadingChapters, isLoadingRelatedPrograms, setIsLoading]);

    return (
        <div className="min-h-screen w-full relative">
            <Banner program={programDetail} isSingle={true} chapter={chapter} />
            <TabsSingle
                showDetails={showDetails}
                setShowDetails={setShowDetails}
                tabsRef={tabsRef}
                scrollToTabs={scrollToTabs}
            />

            <div className="mx-25 mt-5 2xl:mt-10 mb-10 2xl:mb-20">
                {showDetails ? (
                    <DetailsProgram programDetail={programDetail} />
                ) : (
                    <RelatedProgramsContainer
                        programs={relatedPrograms}
                        isLoading={isLoadingRelatedPrograms}
                    />
                )}
            </div>
        </div>
    );
}

export default ProgramSingleView;
