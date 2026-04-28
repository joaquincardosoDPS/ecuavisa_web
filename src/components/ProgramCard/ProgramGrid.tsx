import type { Program } from "@/interfaces/catalog.interface";
import type { FavoriteItem } from "@/interfaces/favorites.interface";
import AlternativeCard from "./AlternativeCard";

type GridItem = Program | FavoriteItem;

interface ProgramGridProps {
  programs: GridItem[];
  isLoading?: boolean;
  isError?: boolean;
  loadingText?: string;
  errorText?: string;
  cols?: number;
}

function isProgram(item: GridItem): item is Program {
  return "segments" in item;
}

function toProgram(item: GridItem): Program {
  if (isProgram(item)) return item;
  // Adaptar FavoriteItem a la forma mínima que Card necesita
  return item as unknown as Program;
}

function ProgramGrid({
  programs,
  isLoading = false,
  isError = false,
  loadingText = "Cargando...",
  errorText = "Error al cargar",
  cols = 4,
}: ProgramGridProps) {
  const gridCols: Record<number, string> = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  };

  return (
    <>
      {isLoading && (
        <p className="animate-pulse text-xl font-title">{loadingText}</p>
      )}
      <div className={`text-white grid ${gridCols[cols] || "grid-cols-4"} gap-4`}>
        {programs.map((item) => (
          <AlternativeCard key={item.id} program={toProgram(item)} />
        ))}
        {isError && (
          <p className="text-red-500 text-xl font-title">{errorText}</p>
        )}
      </div>
    </>
  );
}

export default ProgramGrid;
