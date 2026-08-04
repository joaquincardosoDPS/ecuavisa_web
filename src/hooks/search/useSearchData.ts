import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { catalogService } from "@/services/catalogService";
import type { Program } from "@/interfaces/catalog.interface";

const SEARCH_LIMIT = 12;

interface UseSearchDataReturn {
  query: string;
  setQuery: (value: string) => void;
  programs: Program[];
  totalRecords: number;
  isLoading: boolean;
  isError: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function useSearchData(): UseSearchDataReturn {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const setQuery = (newQuery: string) => {
    const trimmed = newQuery.trim();
    if (trimmed) {
      setSearchParams({ q: trimmed }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["search", query],
    queryFn: ({ pageParam = 1 }) =>
      catalogService.searchPrograms({
        search: query,
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
    enabled: true,
  });

  const programs = data?.pages.flatMap((page) => page.data) ?? [];
  const firstPage = data?.pages[0];
  const totalRecords = firstPage?.total_records ?? firstPage?.total_display_records ?? programs.length;

  return {
    query,
    setQuery,
    programs,
    totalRecords,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
