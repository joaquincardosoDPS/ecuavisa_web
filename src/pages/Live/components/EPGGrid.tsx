import { useMemo, useRef, useCallback } from "react";
import type { EPGChannel, EPGEvent } from "@/interfaces/catalog.interface";
import type { LiveSignal } from "@/interfaces/catalog.interface";

interface EPGGridProps {
  epg: EPGChannel[];
  signals: LiveSignal[];
  selectedKeyLive?: string;
  onSelectSignal?: (keyLive: string) => void;
}

/** Horas visibles sin hacer scroll */
const VISIBLE_HOURS = 4;

/**
 * Filtra los eventos que caen dentro de la ventana de tiempo.
 * Recorta inicio/fin de los que se salen de la ventana.
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

  // Calcular el fin de la ventana según el último evento del EPG
  const windowEnd = useMemo(() => {
    let maxEnd = now.getTime() + VISIBLE_HOURS * 3600000; // mínimo VISIBLE_HOURS
    epg.forEach((ch) => {
      ch.events.forEach((ev) => {
        const end = new Date(ev.endTime).getTime();
        if (end > maxEnd) maxEnd = end;
      });
    });
    return new Date(maxEnd);
  }, [epg, now]);

  // Ratio: cuánto más ancha es la barra interna respecto al contenedor visible
  const totalHours = (windowEnd.getTime() - windowStart.getTime()) / 3600000;
  const scrollRatio = Math.max(1, totalHours / VISIBLE_HOURS);

  const timeMarks = useMemo(
    () => getTimeMarks(windowStart, windowEnd),
    [windowStart, windowEnd],
  );

  const epgMap = useMemo(() => {
    const map = new Map<string, EPGChannel>();
    epg.forEach((ch) => map.set(ch.key_live, ch));
    return map;
  }, [epg]);

  // Ref para sincronizar scroll entre todas las filas y el header
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const isSyncing = useRef(false);

  // Drag-to-scroll
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const wasDragged = useRef(false);

  const handleScroll = useCallback((sourceIdx: number) => {
    if (isSyncing.current) return;
    isSyncing.current = true;

    const source = sourceIdx === -1 ? headerRef.current : scrollRefs.current[sourceIdx];
    if (!source) { isSyncing.current = false; return; }

    const scrollLeft = source.scrollLeft;

    // Sincronizar header
    if (sourceIdx !== -1 && headerRef.current) {
      headerRef.current.scrollLeft = scrollLeft;
    }

    // Sincronizar filas
    scrollRefs.current.forEach((ref, i) => {
      if (ref && i !== sourceIdx) {
        ref.scrollLeft = scrollLeft;
      }
    });

    isSyncing.current = false;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    wasDragged.current = false;
    dragStartX.current = e.clientX;
    dragStartScroll.current = headerRef.current?.scrollLeft ?? 0;

    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;

    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 3) wasDragged.current = true;

    const newScroll = dragStartScroll.current - dx;

    // Aplicar a todas las filas y header sincronizadamente
    if (headerRef.current) headerRef.current.scrollLeft = newScroll;
    scrollRefs.current.forEach((ref) => {
      if (ref) ref.scrollLeft = newScroll;
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const handleRowClick = useCallback((keyLive: string) => {
    // No seleccionar señal si fue un drag
    if (wasDragged.current) return;
    onSelectSignal?.(keyLive);
  }, [onSelectSignal]);

  // Ancho interno en % del contenedor visible (ej. 300% para 6h/2h)
  const innerWidthPct = `${scrollRatio * 100}%`;

  return (
    <div
      className="flex flex-col gap-0 w-full cursor-grab select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Header con marcas de tiempo — sticky + scrollable sincronizado */}
      <div
        ref={headerRef}
        className="pl-[116px] relative h-8 mb-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sticky top-0 z-10 bg-(--clr-primary)"
        onScroll={() => handleScroll(-1)}
      >
        <div className="relative h-full" style={{ width: innerWidthPct }}>
          {timeMarks.map((mark) => (
            <div
              key={mark.label}
              className="absolute text-xs text-white/50 -translate-x-1/2 bottom-0"
              style={{ left: `${mark.pct}%` }}
            >
              {mark.label}
            </div>
          ))}
        </div>
      </div>

      {/* Filas por canal */}
      {signals.map((signal, rowIdx) => {
        const channel = epgMap.get(signal.key_live) || epgMap.get(signal.key);
        const events = channel
          ? getEventsInWindow(channel.events, windowStart, windowEnd)
          : [];

        const hasEpg = events.length > 0;
        const isSelected = selectedKeyLive === signal.key_live;

        return (
          <div
            key={signal.key_live}
            className={`flex items-stretch gap-3 mb-3 cursor-pointer rounded-lg transition-all ${
              isSelected ? "" : "opacity-70 hover:opacity-100"
            }`}
            onClick={() => handleRowClick(signal.key_live)}
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
            {hasEpg ? (
              <div
                ref={(el) => { scrollRefs.current[rowIdx] = el; }}
                className="flex-1 relative h-26 rounded-lg overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                onScroll={() => handleScroll(rowIdx)}
              >
                <div
                  className="flex h-full gap-1.5"
                  style={{ width: innerWidthPct }}
                >
                  {events.map(({ event, widthPct }) => {
                    const begin = new Date(event.beginTime);
                    const end = new Date(event.endTime);
                    const isNow = begin <= now && end > now;
                    const useHighlight = isSelected && isNow;

                    return (
                      <div
                        key={event.id}
                        className={`h-full rounded-lg px-3 py-2 flex flex-col justify-center overflow-hidden transition-all duration-300 shrink-0 ${
                          useHighlight
                            ? "bg-(--foc-primary)"
                            : isNow
                              ? "bg-(--clr-secondary) brightness-125"
                              : "bg-(--clr-secondary)/60"
                        }`}
                        style={{ flex: `${widthPct} 0 0` }}
                        title={`${event.title} — ${formatTime(begin)} – ${formatTime(end)}`}
                      >
                        <p className="text-sm font-medium text-white truncate leading-tight">
                          {event.title}
                        </p>
                        {widthPct > 3 && (
                          <p className="text-xs text-white/60 truncate">
                            {formatTime(begin)} – {formatTime(end)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex-1 relative h-26 rounded-lg overflow-hidden">
                <div
                  className={`absolute top-0 h-full rounded-lg px-3 py-2 flex items-center ${
                    isSelected
                      ? "bg-(--foc-primary)"
                      : "bg-(--clr-secondary) brightness-125"
                  }`}
                  style={{ left: "2px", width: "calc(100% - 4px)" }}
                >
                  <p className="text-sm font-medium text-white truncate leading-tight">
                    {signal.name_live}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default EPGGrid;
