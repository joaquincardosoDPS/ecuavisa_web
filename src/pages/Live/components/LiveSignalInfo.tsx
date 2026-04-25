import { useMemo } from "react";
import type { LiveSignal, EPGChannel } from "@/interfaces/catalog.interface";

interface LiveSignalInfoProps {
  signal: LiveSignal | null;
  epg?: EPGChannel[];
}

function LiveSignalInfo({ signal, epg }: LiveSignalInfoProps) {
  // Buscar el programa actual en emisión desde el EPG
  const currentEvent = useMemo(() => {
    if (!signal || !epg) return null;
    const channel = epg.find(
      (ch) => ch.key_live === signal.key_live || ch.channelCode === signal.key,
    );
    if (!channel) return null;

    const now = new Date();
    return channel.events.find((ev) => {
      const begin = new Date(ev.beginTime);
      const end = new Date(ev.endTime);
      return begin <= now && end > now;
    }) ?? null;
  }, [signal, epg]);

  if (!signal) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-white/30">Sin información</span>
      </div>
    );
  }

  // Imagen: preferir EPG, luego active_item_data, luego background_image
  const image =
    currentEvent?.pictures?.cover ||
    currentEvent?.pictures?.background ||
    currentEvent?.pictures?.photo ||
    signal.active_item_data?.image ||
    signal.background_image ||
    null;

  const title = currentEvent?.title || signal.active_item_data?.title || null;
  const subtitle = currentEvent?.episodeTitle || null;
  const synopsis = currentEvent?.synopsis || signal.active_item_data?.description || null;
  const genre = currentEvent?.genre?.join(", ") || null;

  // Calcular horario
  const timeRange = useMemo(() => {
    if (!currentEvent) return signal.active_item_data?.time_playing || null;
    const begin = new Date(currentEvent.beginTime);
    const end = new Date(currentEvent.endTime);
    const fmt = (d: Date) =>
      d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
    return `${fmt(begin)} – ${fmt(end)}`;
  }, [currentEvent, signal]);

  return (
    <div className="w-full h-full flex flex-col gap-3 px-6 overflow-hidden">
      {/* Imagen del programa */}
      {image && (
        <img
          src={image}
          alt={title || "Programa actual"}
          className="w-full aspect-video object-cover rounded-lg shrink-0"
        />
      )}

      {/* Logo + Canal */}
      <div className="flex items-center gap-3">
        {signal.logo && (
          <img
            src={signal.logo}
            alt={signal.name_live}
            className="w-8 h-8 object-contain"
          />
        )}
        <span className="text-[var(--clr-primary-subtitle)] text-xs font-medium uppercase tracking-wider">
          {signal.name_live}
        </span>
      </div>

      {/* Título */}
      {title && (
        <h2 className="text-[var(--clr-primary-title)] text-lg font-bold leading-tight">
          {title}
        </h2>
      )}

      {/* Subtítulo (episodio) */}
      {subtitle && (
        <p className="text-[var(--clr-primary-subtitle)] text-sm leading-tight">
          {subtitle}
        </p>
      )}

      {/* Horario + badge en vivo */}
      {timeRange && (
        <div className="flex items-center gap-2 text-[var(--clr-primary-subtitle)] text-xs">
          <span
            className="w-2 h-2 rounded-full bg-(--foc-primary) shrink-0"
            style={{ animation: "livePulse 1.5s ease-in-out infinite" }}
          />
          <span>{timeRange}</span>
          {genre && <span className="opacity-60">· {genre}</span>}
        </div>
      )}

      {/* Sinopsis */}
      {synopsis && (
        <p className="text-[var(--clr-primary-text)] text-xs leading-relaxed line-clamp-3 opacity-80">
          {synopsis}
        </p>
      )}
    </div>
  );
}

export default LiveSignalInfo;
