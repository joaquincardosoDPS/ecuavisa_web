import type { Program, Event } from "@/interfaces/catalog.interface";
import { useNavigate } from "react-router-dom";

interface CardVerticalProps {
  program: Program | Event;
  format?: string;
}

function CardVertical({ program, format }: CardVerticalProps) {
  const navigate = useNavigate();

  const isEvent = format === "event";
  const eventData = isEvent ? (program as Event) : null;
  const programData = !isEvent ? (program as Program) : null;

  const imageSrc = isEvent
    ? eventData?.image_portrait?.small
    : programData?.image_port?.small;

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
      className="group relative shrink-0 overflow-hidden cursor-pointer transition-all duration-300 hover:z-10 hover:ring-2 hover:ring-(--foc-primary) hover:shadow-[0_0_20px_rgba(255,19,118,0.3)] focus:outline-none focus:z-10 focus:ring-2 focus:ring-(--foc-primary) focus:shadow-[0_0_20px_rgba(255,19,118,0.3)] bg-[#0a0a0a] embla_slide w-[20vh] aspect-2/3 rounded-xl"
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

export default CardVertical;
