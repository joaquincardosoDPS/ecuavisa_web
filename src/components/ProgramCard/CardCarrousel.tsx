import useEmblaCarousel from "embla-carousel-react";
import type { Program, Event } from "@/interfaces/catalog.interface";
import type { EmblaOptionsType } from "embla-carousel";
import { useNavigate } from "react-router-dom";
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
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  } as EmblaOptionsType);

  const isVertical = orientation === "vertical";

  return (
    <div
      ref={emblaRef}
      className="overflow-hidden cursor-grab active:cursor-grabbing py-1 -ml-1 pl-1"
    >
      <div className="flex gap-5 items-stretch transform-gpu will-change-transform">
        {programs.map((program) =>
          isVertical ? (
            <CardVertical key={program.id} program={program} format={format} />
          ) : (
            <CardHorizontal key={program.id} program={program} format={format} />
          )
        )}
        {programs.length === 10 && categorySlug && (
          <div
            onClick={() => navigate(`/categoria/${categorySlug}`)}
            className={`flex items-center justify-center shrink-0 overflow-hidden cursor-pointer group transition-all duration-300 hover:z-10 hover:ring-2 hover:ring-(--foc-primary) hover:shadow-[0_0_20px_rgba(255,19,118,0.3)] ${isVertical ? "w-64 aspect-2/3 rounded-xl" : "w-72 aspect-video rounded-lg"}`}
            style={{ backgroundColor: "var(--clr-secondary)" }}
          >
            <span className="text-2xl font-medium text-white">Ver Más </span>
          </div>
        )}

        <div className={`flex-none ${hasIconImage ? "w-125" : "w-16"}`} />
      </div>
    </div>
  );
}

export default CardCarrousel;
