import type { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useNavigate } from "react-router-dom";
import type { HistoryItem } from "@/interfaces/history.interface";

import { useState, useEffect, useCallback } from 'react';

/** Formatea duration_seg a "Duración X h Y min" */
function formatDuration(seconds: number): string {
    if (!seconds || seconds <= 0) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0 && m > 0) return `Duración ${h} h ${m} min`;
    if (h > 0) return `Duración ${h} h`;
    return `Duración ${m} min`;
}

interface ContinueWatchingCarouselProps {
    items: HistoryItem[];
}

function ContinueWatchingCarousel({ items }: ContinueWatchingCarouselProps) {
    const navigate = useNavigate();
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        dragFree: true,
        containScroll: "trimSnaps",
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
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);

    if (items.length === 0) return null;

    return (
        <div
            className="pl-25 flex flex-col gap-5 mt-5 mb-5 | xs:max-md:px-7.5"
            style={{ fontFamily: "var(--font-family-category)" }}
        >
            <h2 className="text-2xl font-bold text-(--clr-primary-title)">Seguir Viendo</h2>
            <div className="group/carousel relative">
                {/* Flecha izquierda */}
                <button
                    onClick={() => emblaApi?.scrollPrev()}
                    disabled={!canScrollPrev}
                    className={`absolute left-0 -translate-y-1/2 -translate-x-1/2 z-20 w-12 h-12 rounded-full bg-(--clr-primary)/60 backdrop-blur-sm border border-(--clr-primary-title)/20 text-(--clr-primary-title) flex items-center justify-center transition-opacity duration-300 ${canScrollPrev ? "opacity-0 group-hover/carousel:opacity-100 hover:bg-(--foc-primary) hover:border-(--foc-primary) cursor-pointer" : "opacity-0 group-hover/carousel:opacity-30 cursor-default"}`}
                    style={{ top: 'calc(15vw * 9 / 32)' }}
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
                    style={{ top: 'calc(15vw * 9 / 32)' }}
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
                        {items.map((item) => {
                            const imgSrc =
                                item.image_land?.medium || item.image_land?.default || item.image;
                            const progress = item.duration_seg > 0
                                ? Math.min(100, (item.time / item.duration_seg) * 100)
                                : 0;

                            return (
                                <div
                                    key={item.slug}
                                    tabIndex={0}
                                    onClick={() =>
                                        navigate(
                                            `/play/${item.key_program}/${item.key_segment}/${item.season}/${item.chapter}`,
                                            { state: { resumeTime: item.time } },
                                        )
                                    }
                                    className="shrink-0 w-[15vw] cursor-pointer group"
                                >
                                    {/* Card imagen */}
                                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-(--clr-secondary,#054668) transition-all duration-200 group-hover:ring-2 group-hover:ring-(--foc-primary,#ff1376) group-hover:scale-[1.02]">
                                        {imgSrc ? (
                                            <img
                                                src={imgSrc}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                                draggable={false}
                                                decoding="async"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="text-(--clr-primary-title)/40 text-sm">{item.title}</span>
                                            </div>
                                        )}

                                        {/* Barra de progreso */}
                                        <div className="absolute bottom-0 left-0 right-0 h-[5px] bg-white/20">
                                            <div
                                                className="h-full bg-(--foc-primary) transition-all duration-300"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Info debajo del card */}
                                    <div className="mt-2 px-0.5">
                                        <p className="text-(--clr-primary-title) text-sm font-semibold tracking-wider">
                                            {item.name_program}
                                        </p>
                                        <p className="text-(--clr-primary-title) text-base uppercase font-bold line-clamp-1 mt-0.5">
                                            {item.title}
                                        </p>
                                        <p className="text-(--clr-primary-title) text-base mt-0.5">
                                            {formatDuration(item.duration_seg)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="flex-none w-16" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContinueWatchingCarousel;
