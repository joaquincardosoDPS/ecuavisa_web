import ProgramGrid from "@/components/ProgramCard/ProgramGrid";
import { useDocumentTitle } from "@/hooks/shared/useDocumentTitle";
import { useSearchData } from "@/hooks/search/useSearchData";
import Button from "@/components/ui/Button";

function SearchView() {
	useDocumentTitle('Buscador');

	const {
		query,
		programs,
		totalRecords,
		isLoading,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useSearchData();

	return (
		<div className="px-25 pt-25 pb-16 | xs:max-md:px-7.5 xs:max-md:pt-10">
			{query.trim() ? (
				<div className="mb-8">
					<h1 className="text-2xl 2xl:text-3xl font-bold text-(--clr-primary-title)">
						Resultados para <span className="text-(--clr-secondary-button)">"{query}"</span>
					</h1>
					{!isLoading && (
						<p className="text-(--clr-primary-title)/60 text-sm 2xl:text-base mt-1 font-medium">
							{totalRecords === 1 ? '1 resultado encontrado' : `${totalRecords} resultados encontrados`}
						</p>
					)}
				</div>
			) : (
				<div className="mb-8">
					<h1 className="text-2xl 2xl:text-3xl font-bold mb-2 text-(--clr-primary-title)">Buscador</h1>
					<p className="text-(--clr-primary-title)/60 text-base">
						Explora nuestro catálogo de programas, series y contenidos.
					</p>
				</div>
			)}

			{!isLoading && query.trim().length > 0 && programs.length === 0 && (
				<div className="flex flex-col items-center justify-center py-16 gap-3">
					<p className="text-(--clr-primary-title)/70 text-lg text-center">
						No encontramos resultados para <span className="font-semibold text-(--clr-primary-title)">"{query}"</span>
					</p>
					<p className="text-(--clr-primary-title)/40 text-sm text-center">
						Intenta con otros términos de búsqueda como el nombre del programa o género.
					</p>
				</div>
			)}

			<ProgramGrid
				programs={programs}
				isLoading={isLoading}
				isError={isError}
				loadingText="Buscando..."
				errorText="Error al buscar contenidos"
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
