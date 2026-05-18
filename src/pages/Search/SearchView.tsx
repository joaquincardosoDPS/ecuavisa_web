import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import ProgramGrid from "@/components/ProgramCard/ProgramGrid";
import { useDebounce } from "@/hooks/useDebounce";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { catalogService } from "@/services/catalogService";
import Button from "@/components/ui/Button";

const SEARCH_LIMIT = 12;

function SearchView() {
	useDocumentTitle('Buscador');

	const [query, setQuery] = useState("");
	const debouncedQuery = useDebounce(query, 500);

	const {
		data,
		isLoading,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["search", debouncedQuery],
		queryFn: ({ pageParam }) =>
			catalogService.searchPrograms({
				search: debouncedQuery,
				limit: SEARCH_LIMIT,
				page: pageParam,
			}),
		initialPageParam: 1,
		getNextPageParam: (lastPage, _allPages, lastPageParam) => {
			if (lastPageParam < lastPage.last_page) {
				return lastPageParam + 1;
			}
			return undefined;
		},
		enabled:
			debouncedQuery.trim().length === 0 ||
			debouncedQuery.trim().length >= 3,
	});

	const programs = data?.pages.flatMap((page) => page.data) ?? [];

	return (
		<div className="px-25 pt-16 | xs:max-md:px-7.5 xs:max-md:pt-10">
			<input
				type="text"
				placeholder="Ingresa tu búsqueda..."
				className="block mx-auto w-full max-w-[70vw] bg-[#2C404B] px-9 py-4 text-(clr-secondary-text) text-2xl 2xl:text-3xl font-medium focus:outline-none focus:ring-0 mb-10 | xs:max-md:text-[1rem] xs:max-md:px-5 xs:max-md:py-3 xs:max-md:max-w-full"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
			/>

			<ProgramGrid
				programs={programs}
				isLoading={isLoading}
				isError={isError}
				loadingText="Buscando..."
				errorText="Error al buscar"
			/>

			{hasNextPage && (
				<div className="flex justify-center my-10">
					<Button
						variant="tertiary"
						onClick={() => fetchNextPage()}
						disabled={isFetchingNextPage}
						className="rounded-full"
					>
						{isFetchingNextPage ? "Cargando..." : "Ver más"}
					</Button>
				</div>
			)}
		</div>
	);
}

export default SearchView;
