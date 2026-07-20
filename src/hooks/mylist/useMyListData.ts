import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/authStore";
import { favoritesService } from "@/services/favoritesService";
import type { FavoriteItem } from "@/interfaces/favorites.interface";

const PAGE_LIMIT = 20;

export interface UseMyListDataReturn {
  favorites: FavoriteItem[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function useMyListData(): UseMyListDataReturn {
  const token = useAuthStore((s) => s.token);
  const activeProfile = useAuthStore((s) => s.activeProfile);
  const isAuthenticated = !!token && !!activeProfile;

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["favorites", token, activeProfile?.id],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await favoritesService.getAll(token!, activeProfile!.id, pageParam, PAGE_LIMIT);
      if (response.status === "error") {
        throw new Error(response.msj || "Error al cargar favoritos.");
      }
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const lastPageNum = lastPage.last_page ?? 1;
      return lastPageParam < lastPageNum ? lastPageParam + 1 : undefined;
    },
    enabled: isAuthenticated,
  });

  const favorites = data?.pages.flatMap((page) => page.data || []) ?? [];

  return {
    favorites,
    isLoading,
    isError,
    error: error as Error | null,
    isAuthenticated,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  };
}
