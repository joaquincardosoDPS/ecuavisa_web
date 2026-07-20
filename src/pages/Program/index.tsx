import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import { useProgramDetail } from "@/hooks/program/useProgramDetail";
import { useDocumentTitle } from "@/hooks/shared/useDocumentTitle";
import { useParams } from "react-router-dom";
import ProgramSingleView from "./ProgramSingleView";
import ProgramView from "./ProgramView";
import { useState } from "react";

function ProgramPage() {
    const { slug } = useParams<{ slug: string }>();
    const [isChildLoading, setIsChildLoading] = useState(true);
    const {
        data: programDetail,
        isLoading: isLoadingProgramDetail,
        isError,
    } = useProgramDetail(slug || "");

    useDocumentTitle(programDetail?.title);

    const showSpinner = isLoadingProgramDetail || isChildLoading;

    if (isLoadingProgramDetail) {
        return <FullScreenSpinner />;
    }

    if (isError || !programDetail) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                Error al cargar el programa
            </div>
        );
    }

    return (
        <>
            {showSpinner && <FullScreenSpinner />}
            <div style={{ visibility: showSpinner ? "hidden" : "visible" }}>
                {programDetail.single_episode === true ? (
                    <ProgramSingleView
                        program={programDetail}
                        setIsLoading={setIsChildLoading}
                    />
                ) : (
                    <ProgramView
                        program={programDetail}
                        slug={slug || ""}
                        setIsLoading={setIsChildLoading}
                    />
                )}
            </div>
        </>
    );
}

export default ProgramPage;