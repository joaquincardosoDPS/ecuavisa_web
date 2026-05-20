import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import type { Program, Segment } from "@/interfaces/catalog.interface";
import { useQuery } from "@tanstack/react-query";
import { catalogService } from "@/services/catalogService";
import { useAnalytics } from "@/layout/AnalyticsWrapper";
import Banner from "./components/Banner";
import DetailsProgram from "./components/DetailsProgram";
import TabsSingle from "./components/TabsSingle";
import type { ActiveTab } from "./components/TabsSingle";
import RelatedProgramsContainer from "./components/RelatedProgramsContainer";
import ChaptersContainer from "./components/ChaptersContainer";

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
        queryFn: () => catalogService.searchPrograms({ slug_exclude: programDetail.key, category: programDetail.name_category }),
        enabled: !!programDetail.key,
    });

    const relatedPrograms = relatedProgramsData?.data ?? [];
    const chapter = chapterData?.data?.[0] ?? null;
    const segments = programDetail.segments ?? [];
    const hasSegments = segments.length > 0;

    // Tab activo: objeto de segmento, "related" o "details"
    const [activeTab, setActiveTab] = useState<ActiveTab>(
        hasSegments ? segments[0] : "related"
    );
    const [activeSeason, setActiveSeason] = useState<number | null>(
        hasSegments ? (segments[0].all_temp?.[0] ?? 1) : null
    );

    const tabsRef = useRef<HTMLDivElement>(null);
    const pendingScroll = useRef(false);

    const { trackPage } = useAnalytics();

    // Override del path para GA4
    const analyticsPath = useMemo(() => {
        const basePath = `/programas/${programDetail.key}`;
        if (typeof activeTab === 'object' && activeTab.key) {
            return `${basePath}/${activeTab.key}`;
        }
        return basePath;
    }, [programDetail.key, activeTab]);

    // Enviar page_view cuando cambia el tab/segmento (la URL no cambia)
    useEffect(() => {
        trackPage(analyticsPath);
    }, [analyticsPath, trackPage]);

    const scrollToTabs = useCallback(() => {
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }, 50);
    }, []);

    const requestScroll = useCallback(() => {
        pendingScroll.current = true;
    }, []);

    const handleChaptersLoaded = useCallback(() => {
        if (pendingScroll.current) {
            pendingScroll.current = false;
            scrollToTabs();
        }
    }, [scrollToTabs]);

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

    return (
        <div className="min-h-screen w-full relative">
            <Banner program={programDetail} isSingle={true} chapter={chapter ?? undefined} />
            <TabsSingle
                segments={segments}
                activeTab={activeTab}
                setActiveTab={(tab) => {
                    setActiveTab(tab);
                    requestScroll();
                }}
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
                    />
                )}
            </div>
        </div>
    );
}

export default ProgramSingleView;
