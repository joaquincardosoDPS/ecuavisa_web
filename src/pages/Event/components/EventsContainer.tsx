import type { Event } from "@/interfaces/catalog.interface";
import EventCard from "./EventCard";

interface Props {
  events: Event[];
}

function EventsContainer({ events }: Props) {
  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500 min-h-[calc(100vh-210px)]">
      {events && events.length > 0 ? (
        <div className="grid grid-cols-5 gap-x-6 gap-y-15">
          {events.map((event, index) => (
            <EventCard
              key={`${event.key}-${index}`}
              event={event}
            />
          ))}
        </div>
      ) : (
        <p className="text-(--clr-primary-title)">
          No hay eventos relacionados disponibles.
        </p>
      )}
    </div>
  );
}

export default EventsContainer;
