import { eventService } from "@/services/eventService";
import { useQuery } from "@tanstack/react-query";

export const useEvent = (slug?: string) => {
    const eventQuery = useQuery({
        queryKey: ['event', slug],
        queryFn: () => eventService.getEvent(slug!),
        staleTime: 1000 * 60 * 5,
        enabled: !!slug,
    });

    const category = eventQuery.data?.data?.category?.slug;
    console.log(category)

    const eventsQuery = useQuery({
        queryKey: ['events', slug, category],
        queryFn: () => eventService.getAll({ slug_exclude: slug || '', category: category }),
        staleTime: 1000 * 60 * 5,
        enabled: !!category,
    });

    return {
        events: eventsQuery.data?.data ?? [],
        event: eventQuery.data?.data ?? null,
        isLoading: eventsQuery.isLoading || eventQuery.isLoading,
        isError: eventsQuery.isError || eventQuery.isError,
    };
};
