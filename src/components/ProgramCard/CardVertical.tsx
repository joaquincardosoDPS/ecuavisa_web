import type { Program, Event } from "@/interfaces/catalog.interface";
import { useNavigate } from "react-router-dom";
import RankingIcon from "@/assets/img/icons/iconos-ranking.svg";
import { getEventStatus } from "@/utils/eventStatus";

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
    ? eventData?.image_port?.small
    : programData?.image_port?.small;

  const eventStatus = isEvent && eventData ? getEventStatus(eventData) : null;
  const showDate = eventStatus !== null && eventStatus.label === "Próximamente";

  const handleClick = () => {
    if (isEvent && eventData) {
      if (eventData.skip_view && eventData.program_associated?.key) {
        navigate(`/programas/${eventData.program_associated.key}`);
      } else {
        navigate(`/eventos/${eventData.key}`);
      }
    } else {
      navigate(`/programas/${program.key}`);
    }
  };

  return (
    <div className="flex flex-col">
      <div
        tabIndex={0}
        className="group relative shrink-0 overflow-hidden cursor-pointer transition-all duration-300 hover:z-10 hover:ring-2 hover:ring-(--foc-primary) hover:shadow-[0_0_20px_rgba(255,19,118,0.3)] focus:outline-none focus:z-10 focus:ring-2 focus:ring-(--foc-primary) focus:shadow-[0_0_20px_rgba(255,19,118,0.3)] bg-[#0a0a0a] embla_slide aspect-9/16 rounded-xl"
        style={{ width: "var(--card-w-vertical)" }}
        onClick={handleClick}
      >
        {/* Ranking badge */}
        {isRanking && index != null && (
          <div className="absolute top-2 left-0 z-10 w-15 h-15 flex items-center justify-center">
            <img
              src={RankingIcon}
              alt=""
              className="absolute inset-0 w-full h-full"
            />
            <span className="relative text-white font-bold text-lg text-center -mt-3.5">
              {index + 1}
            </span>
          </div>
        )}

        {/* Event status badge */}
        {eventStatus && (
          <span
            className="absolute top-0 left-0 z-10 px-2 py-0.5 rounded text-[0.7rem] uppercase tracking-wide text-black"
            style={{ backgroundColor: `var(${eventStatus.colorVar})` }}
          >
            {eventStatus.label}
          </span>
        )}

        {showDate && (
          <div className="absolute bottom-0 left-0 right-0 z-10 py-1 px-3 bg-(--foc-primary) backdrop-blur-sm text-[10px] font-semibold uppercase tracking-wide text-(--clr-primary-title) text-center">
            {(() => {
              const d = new Date(
                eventData!.gmt0_unlocked.replace(" ", "T") + "Z",
              );
              const date = d.toLocaleDateString("es-CL", {
                weekday: "short",
                day: "numeric",
                month: "long",
              });
              const time = d.toLocaleTimeString("es-CL", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });
              return `${date}, ${time} hrs`;
            })()}
          </div>
        )}

        {imageSrc ? (
          <img
            src={imageSrc}
            alt={program.title}
            className="w-full h-full object-cover transition-transform duration-300 select-none embla__slide__number scale-110 group-hover:scale-100 group-focus:scale-100"
            draggable={false}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center p-4 text-center transition-transform duration-300 scale-110 group-hover:scale-100 group-focus:scale-100">
            <span className="text-white text-sm md:text-base font-medium">
              {program.title}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CardVertical;
