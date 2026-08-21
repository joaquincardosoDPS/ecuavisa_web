import Button from "@/components/ui/Button";
import type { Chapter, Program } from "@/interfaces/catalog.interface";
import { useFavorite } from "@/hooks/mylist/useFavorite";
// import FavoriteButton from "@/components/ui/FavoriteButton";
import ProgressBar from "@/components/ui/ProgressBar";
import { useContinueWatching } from "@/hooks/program/useContinueWatching";
import { useNavigate } from "react-router-dom";
import { BackButton } from "@/components/ui/BackButton";
// import StarIcon from "@/components/icons/StarIcon";
import HeartIcon from "@/components/icons/HeartIcon";

interface InfoBannerProps {
  program: Program;
  firstChapter?: Chapter | null;
}

function InfoBanner({ program, firstChapter }: InfoBannerProps) {
  const navigate = useNavigate();
  const { isFavorited, isEnabled, toggleFavorite, isToggling } = useFavorite(
    program.key,
  );
  const { item: continueWatchingItem } = useContinueWatching(program.key);

  const firstSegment = program.segments?.[0];

  const handlePlay = () => {
    if (continueWatchingItem) {
      navigate(
        `/play/${program.key}/${continueWatchingItem.key_segment}/${continueWatchingItem.season}/${continueWatchingItem.chapter}`,
        { state: { resumeTime: continueWatchingItem.time } },
      );
    } else if (firstSegment && firstChapter) {
      navigate(`/play/${program.key}/${firstSegment.key}/${firstChapter.season}/${firstChapter.chapter}`);
    }
  };

  const logoImg = program?.image_logo?.big;
  // const maxSeasons = program.segments?.[0]?.max_temp || 0;
  console.log(program)
  const genderNames = program.genders?.map((gender) => gender.name).join(", ");

  return (
    <div className="animate-in fade-in slide-in-from-left-10 duration-1000 mt-25 ml-25 flex flex-col justify-between h-[65vh]">
      <BackButton to="/programas" />
      <div>
        <div className="h-20 2xl:h-30 flex items-end">
          {logoImg ? (
            <img
              src={logoImg}
              alt={program.title}
              className="w-auto max-w-60 h-full object-contain mb-3"
            />)
            : <h2 className="text-3xl font-title font-bold text-(--clr-primary-title) drop-shadow-2xl">
              {program.title}
            </h2>
          }
        </div>

        {genderNames && <span>{genderNames}</span>}
        <div className="text-lg font-medium flex items-center gap-2 my-3">
          <span className="px-2 bg-(--clr-secondary) py-1 rounded-md">
            {program.classification}
          </span>
          {program.anio_production && (
            <span>
              {program.anio_production}
            </span>
          )}


        </div>

        <p className="text-lg font-text font-medium drop-shadow-md leading-8 max-w-4xl ">
          {program.description_short}
        </p>

        {/* Botones de acción */}
        <div className="flex flex-row items-center gap-4 mt-6">
          <Button variant="primary" showArrow onClick={handlePlay} className="uppercase">
            {continueWatchingItem ? "Reanudar" : "Ver ahora"}
          </Button>
          {isEnabled && (
            <Button variant="primary" showArrow={false} onClick={toggleFavorite} disabled={isToggling} className={`w-14 h-14 p-0 flex items-center justify-center rounded-full text-3xl font-light ${isFavorited ? " text-white bg-(--foc-secondary)" : "bg-black border-white"}`}>
              {isToggling ? (
                <div className="w-6 h-6 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : isFavorited ? (
                <HeartIcon filled size={24} />
              ) : (
                "+"
              )}
            </Button>
          )}
        </div>

        {/* Barra de progreso "Seguir viendo" */}
        {continueWatchingItem && (
          <ProgressBar
            duration={continueWatchingItem.duration}
            time={continueWatchingItem.time}
          />
        )}
      </div>
    </div>
  );
}

export default InfoBanner;
