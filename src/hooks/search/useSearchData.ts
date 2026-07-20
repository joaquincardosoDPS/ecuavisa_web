import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/shared/useDebounce";
import { catalogService } from "@/services/catalogService";
import type { Program } from "@/interfaces/catalog.interface";

const SEARCH_LIMIT = 12;

interface UseSearchDataReturn {
  query: string;
  setQuery: (value: string) => void;
  programs: Program[];
  isLoading: boolean;
  isError: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function useSearchData(): UseSearchDataReturn {
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

  return {
    query,
    setQuery,
    programs,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
