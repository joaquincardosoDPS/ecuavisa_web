import type { Program } from "@/interfaces/catalog.interface";
import ProgramGrid from "@/components/ProgramCard/ProgramGrid";

interface RelatedProgramsContainerProps {
    programs: Program[];
    isLoading?: boolean;
}

function RelatedProgramsContainer({ programs, isLoading = false }: RelatedProgramsContainerProps) {
    return (
        <div className="flex flex-col gap-5 2xl:gap-10 animate-in fade-in duration-500 min-h-[calc(100vh-281px)]">
            {isLoading ? (
                <p className="text-white">Cargando programas relacionados...</p>
            ) : programs.length > 0 ? (
                <ProgramGrid programs={programs} cols={5} />
            ) : (
                <p className="text-white/60">
                    No hay programas relacionados disponibles.
                </p>
            )}
        </div>
    );
}

export default RelatedProgramsContainer;
