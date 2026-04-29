import useEmblaCarousel from "embla-carousel-react";
import type { Program, Event } from "@/interfaces/catalog.interface";
import type { EmblaOptionsType } from "embla-carousel";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import CardHorizontal from "./CardHorizontal";
import CardVertical from "./CardVertical";

interface CardCarrouselProps {
  programs: (Program | Event)[];
  orientation?: "horizontal" | "vertical";
  hasIconImage?: boolean;
  categorySlug?: string;
  format?: string;
}

function CardCarrousel({
  programs,
  orientation = "horizontal",
  hasIconImage = false,
  categorySlug,
  format,
}: CardCarrouselProps) {
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
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const isVertical = orientation === "vertical";

  return (
    <div className="group/carousel relative">
      {/* Flecha izquierda */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canScrollPrev}
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-opacity duration-300 ${canScrollPrev ? "opacity-0 group-hover/carousel:opacity-100 hover:bg-(--foc-primary) hover:border-(--foc-primary) cursor-pointer" : "opacity-0 group-hover/carousel:opacity-30 cursor-default"}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Flecha derecha */}
      <button
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canScrollNext}
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center transition-opacity duration-300 ${canScrollNext ? "opacity-0 group-hover/carousel:opacity-100 hover:bg-(--foc-primary) hover:border-(--foc-primary) cursor-pointer" : "opacity-0 group-hover/carousel:opacity-30 cursor-default"}`}
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
        <div className="flex gap-5 items-stretch transform-gpu will-change-transform">
          {programs.map((program, index) =>
            isVertical ? (
              <CardVertical key={program.id} program={program} format={format} index={index} />
            ) : (
              <CardHorizontal key={program.id} program={program} format={format} />
            )
          )}
          {programs.length === 10 && categorySlug && (
            <div
              onClick={() => navigate(`/categoria/${categorySlug}`)}
              className={`flex items-center justify-center shrink-0 overflow-hidden cursor-pointer group transition-all duration-300 hover:z-10 hover:ring-2 hover:ring-(--foc-primary) hover:shadow-[0_0_20px_rgba(255,19,118,0.3)] ${isVertical ? "w-[20vh] aspect-2/3 rounded-xl" : "w-[32vh] aspect-video rounded-lg"}`}
              style={{ backgroundColor: "var(--clr-secondary)" }}
            >
              <span className="text-2xl font-medium text-white">Ver Más </span>
            </div>
          )}

          <div className={`flex-none ${hasIconImage ? "w-125" : "w-16"}`} />
        </div>
      </div>
    </div>
  );
}

export default CardCarrousel;
