import { eventService } from "@/services/eventService";
import { useQuery } from "@tanstack/react-query";

export const useEvent = (slug?: string) => {
    const eventsQuery = useQuery({
        queryKey: ['events'],
        queryFn: () => eventService.getAll(),
        staleTime: 1000 * 60 * 5,
    });

    const eventQuery = useQuery({
        queryKey: ['event', slug],
        queryFn: () => eventService.getEvent(slug!),
        staleTime: 1000 * 60 * 5,
        enabled: !!slug,
    });

    return {
        events: eventsQuery.data?.data ?? [],
        event: eventQuery.data?.data ?? null,
        isLoadingEvents: eventsQuery.isLoading,
        isLoadingEvent: eventQuery.isLoading,
        isErrorEvents: eventsQuery.isError,
        isErrorEvent: eventQuery.isError,
    };
};