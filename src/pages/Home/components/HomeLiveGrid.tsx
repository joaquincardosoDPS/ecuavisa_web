import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType } from 'embla-carousel';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import type { EPGChannel, EPGEvent } from '@/interfaces/catalog.interface';
import logoSvg from '@/assets/img/logo.svg';

const EPG_URL = 'https://assets.rudo.video/assets/ecuavisa/playlists/global_epg.json';

/* ── Helpers ── */

/** Devuelve el primer evento que esté en emisión ahora, o el primer evento futuro */
function getCurrentEvent(events: EPGEvent[]): EPGEvent | null {
    const now = Date.now();
    const onAir = events.find((e) => {
        const begin = new Date(e.beginTime).getTime();
        const end = new Date(e.endTime).getTime();
        return now >= begin && now < end;
    });
    if (onAir) return onAir;
    return events[0] ?? null;
}

/** Porcentaje de progreso del evento actual (0-100) */
function getProgress(event: EPGEvent): number {
    const now = Date.now();
    const begin = new Date(event.beginTime).getTime();
    const end = new Date(event.endTime).getTime();
    if (now <= begin) return 0;
    if (now >= end) return 100;
    return ((now - begin) / (end - begin)) * 100;
}

/** Formatea horario: "Lunes | 08:00 a 09:00" */
// function formatSchedule(event: EPGEvent): string {
//     const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
//     const begin = new Date(event.beginTime);
//     const end = new Date(event.endTime);
//     const day = days[begin.getDay()];
//     const fmt = (d: Date) => d.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', hour12: false });
//     return `${day} | ${fmt(begin)} a ${fmt(end)}`;
// }

/* ── Card individual de canal EPG ── */
interface EPGCardProps {
    channel: EPGChannel;
    event: EPGEvent;
    onPress?: () => void;
}

function EPGCard({ channel, event, onPress }: EPGCardProps) {
    const progress = getProgress(event);
    const coverImage = event.pictures?.poster || event.pictures?.photo || event.pictures?.cover || event.pictures?.background || '';

    return (
        <div
            className="shrink-0 w-[15vw] cursor-pointer group"
            onClick={onPress}
        >
            {/* Card imagen */}
            <div className="relative w-full aspect-9/16 rounded-xl overflow-hidden bg-(--clr-secondary,#054668) transition-all duration-300 group-hover:ring-2 group-hover:ring-(--foc-primary,#ff1376) group-hover:shadow-[0_0_20px_rgba(255,19,118,0.3)]">
                {coverImage ? (
                    <img
                        src={coverImage}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-300 scale-110 group-hover:scale-100"
                        draggable={false}
                        decoding="async"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-(--clr-primary-title)/40 text-sm">{event.title}</span>
                    </div>
                )}

                {/* Logo esquina superior izquierda */}
                <img
                    src={logoSvg}
                    alt="Logo"
                    className="absolute top-3 left-3 h-5 w-auto z-10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
                    draggable={false}
                />

                {/* Badge En Vivo */}
                {progress > 0 && progress < 100 && (
                    <span className="absolute bottom-4 left-2 bg-(--foc-primary) text-(--clr-primary-title) text-[0.65rem] font-bold px-2 py-0.5 rounded tracking-wider uppercase flex items-center" style={{ columnGap: '0.25rem' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-(--clr-primary-title) animate-pulse" />
                        En Vivo
                    </span>
                )}

                {/* Barra de progreso */}
                <div className="absolute bottom-0 left-0 right-0 h-1.25 bg-white/20">
                    <div
                        className="h-full bg-(--foc-primary) transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Info debajo del card */}
            <div className="mt-2 px-0.5">
                <p className="text-(--clr-primary-title) text-sm font-semibold tracking-wider">
                    {channel.channel}
                </p>
                <p className="text-(--clr-primary-title) text-base uppercase font-bold line-clamp-1 mt-0.5">
                    {event.title}
                </p>
                {/* <p className="text-(--clr-primary-title) text-base mt-0.5">
                    {formatSchedule(event)}
                </p> */}
            </div>
        </div>
    );
}

/* ── Grid principal ── */
function HomeLiveGrid() {
    const navigate = useNavigate();
    const { data: channels, isLoading } = useQuery<EPGChannel[]>({
        queryKey: ['global-epg'],
        queryFn: async () => {
            const { data } = await axios.get<EPGChannel[]>(EPG_URL);
            return data;
        },
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60,
    });

    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
    } as EmblaOptionsType);

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        queueMicrotask(onSelect);
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
            emblaApi.off('reInit', onSelect);
        };
    }, [emblaApi, onSelect]);

    if (isLoading || !channels || channels.length === 0) return null;

    return (
        <div className="pl-25" data-section="live-epg">
            <h2 className="text-[1.5rem] font-bold text-(--clr-primary-title) capitalize mb-4">Noticias</h2>
            <div className="group/carousel relative">
                {/* Flecha izquierda */}
                <button
                    onClick={() => emblaApi?.scrollPrev()}
                    disabled={!canScrollPrev}
                    className={`absolute left-0 -translate-y-1/2 -translate-x-1/2 z-20 w-12 h-12 rounded-full bg-(--clr-primary)/60 backdrop-blur-sm border border-(--clr-primary-title)/20 text-(--clr-primary-title) flex items-center justify-center transition-opacity duration-300 ${canScrollPrev ? "opacity-0 group-hover/carousel:opacity-100 hover:bg-(--foc-primary) hover:border-(--foc-primary) cursor-pointer" : "opacity-0 group-hover/carousel:opacity-30 cursor-default"}`}
                    style={{ top: 'calc(15vw * 8 / 9)' }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>

                {/* Flecha derecha */}
                <button
                    onClick={() => emblaApi?.scrollNext()}
                    disabled={!canScrollNext}
                    className={`absolute right-12 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-(--clr-primary)/60 backdrop-blur-sm border border-(--clr-primary-title)/20 text-(--clr-primary-title) flex items-center justify-center transition-opacity duration-300 ${canScrollNext ? "opacity-0 group-hover/carousel:opacity-100 hover:bg-(--foc-primary) hover:border-(--foc-primary) cursor-pointer" : "opacity-0 group-hover/carousel:opacity-30 cursor-default"}`}
                    style={{ top: 'calc(15vw * 8 / 9)' }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 6 15 12 9 18" />
                    </svg>
                </button>

                {/* Carrusel */}
                <div
                    ref={emblaRef}
                    className="overflow-hidden cursor-grab active:cursor-grabbing py-1 -ml-1 pl-1"
                >
                    <div className="flex items-stretch transform-gpu will-change-transform" style={{ columnGap: '1.25rem' }}>
                        {channels.map((ch) => {
                            const event = getCurrentEvent(ch.events);
                            if (!event) return null;
                            return (
                                <EPGCard
                                    key={ch.key_live}
                                    channel={ch}
                                    event={event}
                                    onPress={() => navigate(`/live?signal=${ch.key_live}`)}
                                />
                            );
                        })}
                        <div className="flex-none w-16" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeLiveGrid;

