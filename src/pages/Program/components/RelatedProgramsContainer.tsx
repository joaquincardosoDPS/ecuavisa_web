import type { Program } from "@/interfaces/catalog.interface";
import ProgramGrid from "@/components/ProgramCard/ProgramGrid";

interface RelatedProgramsContainerProps {
    programs: Program[];
    isLoading?: boolean;
    isFetchingNextPage?: boolean;
    hasNextPage?: boolean;
    fetchNextPage?: () => void;
}

function RelatedProgramsContainer({
    programs,
    isLoading = false,
    isFetchingNextPage = false,
    hasNextPage = false,
    fetchNextPage,
}: RelatedProgramsContainerProps) {
    return (
        <div className="flex flex-col gap-5 2xl:gap-10 animate-in fade-in duration-500 min-h-[calc(100vh-281px)]">
            {isLoading ? (
                <p className="text-(--clr-primary-title)">Cargando programas relacionados...</p>
            ) : programs.length > 0 ? (
                <ProgramGrid
                    programs={programs}
                    cols={5}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                />
            ) : (
                <p className="text-(--clr-primary-title)/60">
                    No hay programas relacionados disponibles.
                </p>
            )}
        </div>
    );
}

export default RelatedProgramsContainer;
