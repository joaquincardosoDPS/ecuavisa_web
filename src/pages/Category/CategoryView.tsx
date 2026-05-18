import { useState } from "react";
import { useParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { catalogService } from "@/services/catalogService";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import ProgramGrid from "@/components/ProgramCard/ProgramGrid";
import Button from "@/components/ui/Button";

function CategoryView() {
  const { slug } = useParams<{ slug: string }>();
  const [categoryTitle, setCategoryTitle] = useState("");
  useDocumentTitle(categoryTitle || slug);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["category-programs", slug],
    queryFn: async ({ pageParam }) => {
      const response = await catalogService.searchPrograms({
        category: slug!,
        page: pageParam,
      });

      console.log(response.data)

      // Extraer nombre de categoría del primer programa si no lo tenemos
      if (!categoryTitle && response.data?.length > 0) {
        setCategoryTitle(response.data[0].name_category || slug!);
      }

      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPageParam < lastPage.last_page) {
        return lastPageParam + 1;
      }
      return undefined;
    },
    enabled: !!slug,
  });

  const allPrograms = data?.pages.flatMap((page) => page.data) || [];
  const totalRecords = data?.pages[0]?.total_records || 0;

  return (
    <div className="px-25 my-10 min-h-[calc(100vh-84px)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{categoryTitle || slug}</h1>
        {totalRecords > 0 && (
          <p className="text-white/50 text-sm mt-2">
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
      ) : allPrograms.length === 0 ? (
        <p className="text-white/60 text-center py-20 text-lg">
          No hay programas en esta categoría.
        </p>
      ) : (
        <>
          <ProgramGrid programs={allPrograms} />

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
