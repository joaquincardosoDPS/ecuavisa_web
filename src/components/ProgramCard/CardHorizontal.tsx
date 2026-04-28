import type { Program, Event } from "@/interfaces/catalog.interface";
import { useProgramsStore } from "@/features/programs/programsStore";
import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface CardHorizontalProps {
  program: Program | Event;
  format?: string;
}

function CardHorizontal({ program, format }: CardHorizontalProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isProgramsView = pathname === "/programas";

  const isEvent = format === "event";
  const eventData = isEvent ? (program as Event) : null;
  const programData = !isEvent ? (program as Program) : null;

  const imageSrc = isEvent
    ? eventData?.image_landscape?.medium
    : programData?.image_land?.medium;

  const setActiveProgram = useProgramsStore((state) => state.setActiveProgram);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const FOCUS_DELAY_MS = 200;

  const handleFocusEnter = () => {
    if (!isProgramsView || isEvent) return;
    hoverTimeout.current = setTimeout(() => {
      setActiveProgram(program as Program);
    }, FOCUS_DELAY_MS);
  };

  const handleFocusLeave = () => {
    if (!isProgramsView) return;
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
  };

  const handleClick = () => {
    if (isEvent && eventData) {
      if (eventData.key) navigate(`/eventos/${eventData.key}`);
    } else {
      navigate(`/programas/${program.key}`);
    }
  };

  return (
    <div
      tabIndex={0}
      className="group relative shrink-0 overflow-hidden cursor-pointer transition-all duration-300 hover:z-10 hover:ring-2 hover:ring-(--foc-primary) hover:shadow-[0_0_20px_rgba(255,19,118,0.3)] focus:outline-none focus:z-10 focus:ring-2 focus:ring-(--foc-primary) focus:shadow-[0_0_20px_rgba(255,19,118,0.3)] bg-[#0a0a0a] embla_slide w-[32vh] aspect-video rounded-lg"
      onMouseEnter={handleFocusEnter}
      onMouseLeave={handleFocusLeave}
      onFocus={handleFocusEnter}
      onBlur={handleFocusLeave}
      onClick={handleClick}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={program.title}
          className="w-full h-full object-cover transition-transform duration-300 select-none embla__slide__number scale-110 group-hover:scale-100 group-focus:scale-100"
          draggable={false}
        />
      ) : (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center p-4 text-center transition-transform duration-300 scale-110 group-hover:scale-100 group-focus:scale-100">
          <span className="text-white text-sm md:text-base font-medium">
            {program.title}
          </span>
        </div>
      )}
    </div>
  );
}

export default CardHorizontal;
