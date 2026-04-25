import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { catalogService } from "@/services/catalogService";
import { useDebounce } from "@/hooks/useDebounce";
import ProgramGrid from "@/components/ProgramCard/ProgramGrid";

function SearchView() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  const {
    data: searchResults,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => catalogService.searchPrograms(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
  });

  return (
    <div className="px-25 pt-16">
      <input
        type="text"
        placeholder="Ingresa tu búsqueda..."
        className="block mx-auto w-full max-w-[70vw] bg-[#2C404B] px-9 py-4 text-[#B9B9B9] text-[30px] font-medium focus:outline-none focus:ring-0 mb-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <ProgramGrid
        programs={searchResults?.data || []}
        isLoading={isLoading}
        isError={isError}
        loadingText="Buscando..."
        errorText="Error al buscar"
      />
    </div>
  );
}

export default SearchView;
