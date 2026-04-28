import type { Program, Event } from "@/interfaces/catalog.interface";
import { useNavigate } from "react-router-dom";
import RankingIcon from "@/assets/img/icons/iconos-ranking.svg"

interface CardVerticalProps {
  program: Program | Event;
  format?: string;
  index?: number;
}

function CardVertical({ program, format, index }: CardVerticalProps) {
  const navigate = useNavigate();

  const isEvent = format === "event";
  const isRanking = format === "ranking";
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
      {/* Ranking badge */}
      {isRanking && index != null && (
        <div className="absolute top-2 left-0 z-10 w-15 h-15 flex items-center justify-center">
          <img src={RankingIcon} alt="" className="absolute inset-0 w-full h-full" />
          <span className="relative text-white font-bold text-lg text-center -mt-3.5">{index + 1}</span>
        </div>
      )}

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
