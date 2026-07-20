import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/authStore";
import { historyService } from "@/services/historyService";
import type { HistoryItem } from "@/interfaces/history.interface";

const PAGE_LIMIT = 20;

export interface UseHistoryDataReturn {
  historyItems: HistoryItem[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

/**
 * Hook de datos para Seguir Viendo con scroll infinito.
 * Obtiene los episodios no finalizados (end: 0) del perfil activo.
 */
export function useHistoryData(): UseHistoryDataReturn {
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
    queryKey: ["history", "continue-watching", token, activeProfile?.id],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await historyService.getAll({
        token: token!,
        profile: activeProfile!.id,
        end: 0,
        page: pageParam,
        limit: PAGE_LIMIT,
      });
      if (response.status === "error") {
        throw new Error(response.msj || "Error al cargar historial.");
      }
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const lastPageNum = lastPage.last_page ?? 1;
      return lastPageParam < lastPageNum ? lastPageParam + 1 : undefined;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2,
  });

  const historyItems = data?.pages.flatMap((page) => page.data || []) ?? [];

  return {
    historyItems,
    isLoading,
    isError,
    error: error as Error | null,
    isAuthenticated,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  };
}
