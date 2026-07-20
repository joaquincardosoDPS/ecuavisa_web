import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import { useDocumentTitle } from "@/hooks/shared/useDocumentTitle";
import { useCategoryPrograms } from "@/hooks/category/useCategoryPrograms";
import ProgramGrid from "@/components/ProgramCard/ProgramGrid";
import Button from "@/components/ui/Button";

function CategoryView() {
  const {
    slug,
    categoryTitle,
    programs,
    totalRecords,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCategoryPrograms();

  useDocumentTitle(categoryTitle || slug);

  return (
    <div className="px-25 my-10 min-h-[calc(100vh-84px)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{categoryTitle || slug}</h1>
        {totalRecords > 0 && (
          <p className="text-(--clr-primary-title)/50 text-sm mt-2">
            {totalRecords} programa{totalRecords !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {isLoading ? (
        <FullScreenSpinner />
      ) : isError ? (
        <p className="text-red-500 text-center py-20">
          Error al cargar los programas de esta categoría.
        </p>
      ) : programs.length === 0 ? (
        <p className="text-(--clr-primary-title)/60 text-center py-20 text-lg">
          No hay programas en esta categoría.
        </p>
      ) : (
        <>
          <ProgramGrid programs={programs} />

          {hasNextPage && (
            <div className="flex justify-center py-10">
              <Button
                variant="secondary"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Cargando..." : "Cargar más"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CategoryView;
