import type { Event } from "@/interfaces/catalog.interface";
import { formatDate } from "@/utils/formatDate";

function DetailEvent({ event }: { event: Event }) {
  const associatedName = event.live_associated?.name || event.program_associated?.name;

  return (
    <div className="min-h-[calc(100vh-210px)]">
      <h3 className="text-(--clr-primary-title) text-xl font-bold uppercase tracking-wider mb-3">
        Sinopsis
      </h3>
      <div className="animate-in fade-in duration-500 flex flex-row gap-20">
        <div className="w-1/2">
          <p className="text-(--clr-primary-title)/60 text-xl leading-relaxed font-medium">
            {event.description || event.description_short}
          </p>
        </div>
        <div className="flex flex-col gap-6 text-(--clr-primary-title)/60 text-xl tracking-wider font-medium">
          <div>
            <h3 className="text-(--clr-primary-title) font-bold uppercase tracking-wider mb-1">
              Clasificación
            </h3>
            <p>{event.classification}</p>
          </div>
          <div>
            <h3 className="text-(--clr-primary-title) font-bold uppercase tracking-wider mb-1">
              Fecha
            </h3>
            <p>{formatDate(event.gmt0_unlocked, { utc: true, includeTime: true })}</p>
          </div>
          {associatedName && (
            <div>
              <h3 className="text-(--clr-primary-title) font-bold uppercase tracking-wider mb-1">
                {event.type === "live" ? "Señal" : "Programa"}
              </h3>
              <p>{associatedName}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailEvent;
