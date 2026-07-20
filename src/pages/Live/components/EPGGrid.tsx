import { useMemo, useRef, useCallback, useState, useEffect } from "react";
import type { EPGChannel, EPGEvent } from "@/interfaces/catalog.interface";
import type { LiveSignal } from "@/interfaces/catalog.interface";

interface EPGGridProps {
  epg: EPGChannel[];
  signals: LiveSignal[];
  selectedKeyLive?: string;
  onSelectSignal?: (keyLive: string) => void;
}

const VISIBLE_HOURS = 4;
const REFRESH_INTERVAL_MS = 60_000;
const LOGO_COL_WIDTH = "17vw";

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

  // Empezar desde la hora actual (floor), no la siguiente
  const firstHour = new Date(windowStart);
  firstHour.setMinutes(0, 0, 0);

  for (let t = firstHour; t <= windowEnd; t = new Date(t.getTime() + 3600000)) {
    const pct = ((t.getTime() - windowStart.getTime()) / windowMs) * 100;
    // Permitir pct negativo para la hora actual (el slot se mostrará parcialmente)
    if (pct <= 100) {
      marks.push({ label: formatTime(t), pct: Math.max(0, pct) });
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

  // Reloj que se actualiza periódicamente para re-renderizar posiciones
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);
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
      className="flex flex-col gap-0 w-full h-full cursor-grab select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="relative -mx-42 px-42 mt-2 mb-5 border-y border-(--clr-primary-title)/10 | xs:max-md:-mx-7.5 xs:max-md:px-7.5">
        <div className="absolute inset-0 opacity-50" style={{ background: 'var(--epg-grad-bg)' }} />
        <div className="relative flex z-10 py-2" style={{ background: 'var(--epg-bar-bg)' }}>
          <div className="shrink-0 relative z-20" style={{ width: LOGO_COL_WIDTH }} />
          <div
            ref={headerRef}
            className="flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onScroll={() => handleScroll(-1)}
          >
            <div className="flex h-full gap-1" style={{ width: innerWidthPct }}>
              {timeMarks.map((mark, idx) => {
                const markTime = new Date(windowStart.getTime() + (mark.pct / 100) * (windowEnd.getTime() - windowStart.getTime()));
                const nextMark = timeMarks[idx + 1];
                const nextTime = nextMark
                  ? new Date(windowStart.getTime() + (nextMark.pct / 100) * (windowEnd.getTime() - windowStart.getTime()))
                  : windowEnd;
                const isCurrentHour = markTime <= now && now < nextTime;

                const spanPct = nextMark ? nextMark.pct - mark.pct : 100 - mark.pct;

                return (
                  <div
                    key={`${mark.label}-${idx}`}
                    className={`@container h-8 rounded-xl flex items-center px-4 text-xs font-medium tracking-wide transition-all duration-300 shrink-0 text-(--clr-primary-title)`}
                    style={{
                      flex: `${spanPct} 0 0`,
                      background: isCurrentHour
                        ? 'linear-gradient(0deg, rgba(0, 198, 255, 0.64) 0%, rgba(0, 198, 255, 0.64) 100%), rgba(255, 255, 255, 0.10)'
                        : 'rgba(255, 255, 255, 0.10)',
                    }}
                    title={mark.label}
                  >
                    <span className="@max-[60px]:hidden">
                      {mark.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Filas por canal — zona scrolleable */}
      <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
              className={`flex items-stretch gap-3 mb-6 cursor-pointer rounded-lg transition-all opacity-100`}
              onClick={() => handleRowClick(signal.key_live)}
            >
              {/* Logo del canal */}
              <div
                className={`shrink-0 flex items-center justify-start rounded-lg  ${isSelected ? "border-2 border-(--clr-primary-title)" : ""}`}
                style={{
                  width: `calc(${LOGO_COL_WIDTH} - 12px)`,
                  background: isSelected
                    ? 'linear-gradient(90deg, #0D4B94 0%, #04172E 100%)'
                    : 'linear-gradient(90deg, #8E9198 0%, #676D73 50%, #04172E 100%)',
                }}
              >
                {/* {signal.logo ? (
                  <img
                    src={signal.logo}
                    alt={signal.name_live}
                    className="w-12 h-12 object-contain mx-4"
                  />
                ) : null
                } */}
                <div className="text-bold">
                  <h2 className="ml-4 text-base text-(--clr-primary-title) text-start leading-tight">
                    Canal
                  </h2>
                  <h1 className="ml-4 font-bold text-3xl">
                    {signal.name_live}
                  </h1>

                </div>
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
                          className={`h-full rounded-lg px-3 py-2 flex flex-col justify-center overflow-hidden transition-all duration-300 shrink-0 border border-(--epg-accent)/40 ${!useHighlight && !isSelected
                            ? "bg-(--clr-primary-title)/20"
                            : ""
                            }`}
                          style={{
                            flex: `${widthPct} 0 0`,
                            ...(useHighlight && { background: 'var(--epg-accent)' }),
                            ...(isSelected && !isNow && { background: '#16309A66' }),
                          }}
                          title={`${event.title} — ${formatTime(begin)} – ${formatTime(end)}`}
                        >
                          <p className="text-xl font-bold text-(--clr-primary-title) truncate leading-tight">
                            {event.title}
                          </p>
                          {widthPct > 3 && (
                            <p className="text-base font-bold text-(--clr-primary-title) truncate">
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
                    className="absolute top-0 h-full rounded-lg px-3 py-2 flex items-center border border-(--epg-accent)/40"
                    style={{
                      left: "2px",
                      width: "calc(100% - 4px)",
                      background: isSelected ? '#00C6FF' : '#FFFFFF33',
                    }}
                  >
                    <p className="text-xl font-bold text-(--clr-primary-title) truncate leading-tight">
                      {signal.name_live}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EPGGrid;
