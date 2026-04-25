import { useMemo } from "react";
import type { EPGChannel, EPGEvent } from "@/interfaces/catalog.interface";
import type { LiveSignal } from "@/interfaces/catalog.interface";

interface EPGGridProps {
  epg: EPGChannel[];
  signals: LiveSignal[];
  selectedKeyLive?: string;
  onSelectSignal?: (keyLive: string) => void;
}

/** Ventana de tiempo a mostrar en horas */
const WINDOW_HOURS = 2;

/**
 * Filtra los eventos que caen dentro de la ventana de tiempo (ahora + WINDOW_HOURS).
 * Recorta el inicio/fin de los eventos que se salen de la ventana.
 */
function getEventsInWindow(
  events: EPGEvent[],
  windowStart: Date,
  windowEnd: Date,
): { event: EPGEvent; startPct: number; widthPct: number }[] {
  const windowMs = windowEnd.getTime() - windowStart.getTime();

  return events
    .map((event) => {
      const begin = new Date(event.beginTime);
      const end = new Date(event.endTime);

      // Recortar al rango visible
      const clampedStart = begin < windowStart ? windowStart : begin;
      const clampedEnd = end > windowEnd ? windowEnd : end;

      if (clampedStart >= clampedEnd) return null;

      const startPct =
        ((clampedStart.getTime() - windowStart.getTime()) / windowMs) * 100;
      const widthPct =
        ((clampedEnd.getTime() - clampedStart.getTime()) / windowMs) * 100;

      return { event, startPct, widthPct };
    })
    .filter(Boolean) as {
    event: EPGEvent;
    startPct: number;
    widthPct: number;
  }[];
}

/** Formatea hora en HH:MM */
function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** Genera las marcas de hora para el header */
function getTimeMarks(
  windowStart: Date,
  windowEnd: Date,
): { label: string; pct: number }[] {
  const marks: { label: string; pct: number }[] = [];
  const windowMs = windowEnd.getTime() - windowStart.getTime();

  // Marca cada hora completa dentro de la ventana
  const firstHour = new Date(windowStart);
  firstHour.setMinutes(0, 0, 0);
  if (firstHour < windowStart) firstHour.setHours(firstHour.getHours() + 1);

  for (let t = firstHour; t <= windowEnd; t = new Date(t.getTime() + 3600000)) {
    const pct = ((t.getTime() - windowStart.getTime()) / windowMs) * 100;
    if (pct >= 0 && pct <= 100) {
      marks.push({ label: formatTime(t), pct });
    }
  }

  return marks;
}

function EPGGrid({
  epg,
  signals,
  selectedKeyLive,
  onSelectSignal,
}: EPGGridProps) {
  const now = useMemo(() => new Date(), [epg]);
  const windowStart = now;
  const windowEnd = useMemo(
    () => new Date(now.getTime() + WINDOW_HOURS * 3600000),
    [now],
  );

  const timeMarks = useMemo(
    () => getTimeMarks(windowStart, windowEnd),
    [windowStart, windowEnd],
  );

  // Crear mapa de EPG por key_live para buscar programación
  const epgMap = useMemo(() => {
    const map = new Map<string, EPGChannel>();
    epg.forEach((ch) => map.set(ch.key_live, ch));
    return map;
  }, [epg]);

  return (
    <div className="flex flex-col gap-0 w-full">
      {/* Header con marcas de tiempo */}
      <div className="flex items-end ml-16 relative h-8 mb-2">
        {timeMarks.map((mark) => (
          <div
            key={mark.label}
            className="absolute text-xs text-white/50 -translate-x-1/2"
            style={{ left: `${mark.pct}%` }}
          >
            {mark.label}
          </div>
        ))}
      </div>

      {/* Filas por canal */}
      {signals.map((signal) => {
        const channel = epgMap.get(signal.key_live) || epgMap.get(signal.key);
        const events = channel
          ? getEventsInWindow(channel.events, windowStart, windowEnd)
          : [];

        const isSelected = selectedKeyLive === signal.key_live;

        return (
          <div
            key={signal.key_live}
            className={`flex items-stretch gap-3 mb-3 cursor-pointer rounded-lg transition-all ${
              isSelected ? "" : "opacity-70 hover:opacity-100"
            }`}
            onClick={() => onSelectSignal?.(signal.key_live)}
          >
            {/* Logo del canal */}
            <div className="w-26 h-26 shrink-0 self-center flex items-center justify-center bg-(--clr-secondary) rounded-lg">
              {signal.logo ? (
                <img
                  src={signal.logo}
                  alt={signal.name_live}
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <span className="text-xs text-white/50 text-center leading-tight">
                  {signal.name_live}
                </span>
              )}
            </div>

            {/* Barra de eventos */}
            <div className="flex-1 relative h-26 rounded-lg overflow-hidden">
              {events.length > 0 ? (
                events.map(({ event, startPct, widthPct }, idx) => {
                  const begin = new Date(event.beginTime);
                  const end = new Date(event.endTime);
                  const isNow = begin <= now && end > now;
                  const isFirst = idx === 0;

                  // Primer bloque de la señal seleccionada usa --foc-primary
                  const useHighlight = isSelected && (isNow || isFirst);

                  return (
                    <div
                      key={event.id}
                      className={`absolute top-0 h-full rounded-lg px-3 py-2 flex flex-col justify-center overflow-hidden transition-all duration-300 ${
                        useHighlight
                          ? "bg-(--foc-primary)"
                          : isNow
                            ? "bg-(--clr-secondary) brightness-125"
                            : "bg-(--clr-secondary)/60"
                      }`}
                      style={{
                        left: `calc(${startPct}% + 6px)`,
                        width: `calc(${widthPct}% - 12px)`,
                      }}
                      title={`${event.title} — ${event.episodeTitle}`}
                    >
                      <p className="text-sm font-medium text-white truncate leading-tight">
                        {event.title}
                      </p>
                      <p className="text-xs text-white/60 truncate">
                        {formatTime(begin)} – {formatTime(end)}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div
                  className={`absolute top-0 h-full rounded-lg px-3 py-2 flex items-center ${
                    isSelected
                      ? "bg-(--foc-primary)"
                      : "bg-(--clr-secondary) brightness-125"
                  }`}
                  style={{ left: "6px", width: "calc(100% - 12px)" }}
                >
                  <p className="text-sm font-medium text-white truncate leading-tight">
                    {signal.name_live}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default EPGGrid;
