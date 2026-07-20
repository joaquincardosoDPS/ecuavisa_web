import ProgramGrid from "@/components/ProgramCard/ProgramGrid";
import { useDocumentTitle } from "@/hooks/shared/useDocumentTitle";
import { useSearchData } from "@/hooks/search/useSearchData";
import Button from "@/components/ui/Button";

function SearchView() {
	useDocumentTitle('Buscador');

	const {
		programs,
		isLoading,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useSearchData();

	return (
		<div className="px-25 pt-25 | xs:max-md:px-7.5 xs:max-md:pt-10">

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
