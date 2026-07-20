import { useState } from "react";
import { useParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { catalogService } from "@/services/catalogService";
import type { Program } from "@/interfaces/catalog.interface";

interface UseCategoryProgramsReturn {
  slug: string | undefined;
  categoryTitle: string;
  programs: Program[];
  totalRecords: number;
  isLoading: boolean;
  isError: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function useCategoryPrograms(): UseCategoryProgramsReturn {
  const { slug } = useParams<{ slug: string }>();
  const [categoryTitle, setCategoryTitle] = useState("");

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
        limit: 12,
      });

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

  const programs = data?.pages.flatMap((page) => page.data) || [];
  const totalRecords = data?.pages[0]?.total_records || 0;

  return {
    slug,
    categoryTitle,
    programs,
    totalRecords,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
