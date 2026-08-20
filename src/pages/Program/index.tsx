import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import { useProgramDetail } from "@/hooks/program/useProgramDetail";
import { useDocumentTitle } from "@/hooks/shared/useDocumentTitle";
import { useParams } from "react-router-dom";
import ProgramSingleView from "./ProgramSingleView";
import ProgramView from "./ProgramView";
import { useState, useEffect } from "react";

function ProgramPage() {
    const { slug } = useParams<{ slug: string }>();
    const [isChildLoading, setIsChildLoading] = useState(true);
    const [activeSlug, setActiveSlug] = useState(slug);
    const {
        data: programDetail,
        isLoading: isLoadingProgramDetail,
        isError,
    } = useProgramDetail(slug || "");

    useDocumentTitle(programDetail?.title);

    // Al navegar entre programas (misma ruta /programas/:slug), resetear el
    // loading en fase de render (antes de montar la nueva vista) para no pisar
    // el setIsLoading(false) que el hijo reporta al terminar de cargar.
    if (slug !== activeSlug) {
        setActiveSlug(slug);
        setIsChildLoading(true);
    }

    // Scroll al inicio al cambiar de programa
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

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
                        key={slug}
                        program={programDetail}
                        setIsLoading={setIsChildLoading}
                    />
                ) : (
                    <ProgramView
                        key={slug}
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