import type { Program } from "@/interfaces/catalog.interface";
import PlusIcon from "@/assets/img/icons/plus.svg";
import CheckIcon from "@/assets/img/icons/check.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorite } from "@/hooks/useFavorite";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import ProgressBar from "@/components/ui/ProgressBar";

function Banner({ program }: { program: Program }) {
  const navigate = useNavigate();
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const { isFavorited, isToggling, isEnabled, toggleFavorite } = useFavorite(
    program.key,
  );
  const { item: continueWatchingItem } = useContinueWatching(program.key);

  const handlePlay = () => {
    if (continueWatchingItem) {
      // Reanudar: ir al episodio guardado con el tiempo
      navigate(
        `/play/${continueWatchingItem.key_segment}/${continueWatchingItem.season}/${continueWatchingItem.chapter}`,
        { state: { resumeTime: continueWatchingItem.time } },
      );
    } else {
      // Play normal: ir al primer episodio del programa
      const firstSegment = program.segments?.[0];
      if (firstSegment) {
        const firstSeason = firstSegment.all_temp?.[0] ?? 1;
        navigate(`/play/${firstSegment.key}/${firstSeason}/1`);
      }
    }
  };

  // Efecto de sombreado dinámico al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const scroll = window.scrollY;
      const threshold = 500;
      const opacity = Math.min(scroll / threshold, 1);
      setScrollOpacity(opacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const bgImg =
    program?.image_slider?.big ||
    program?.image_background?.big ||
    program.image_land.big;
  const logoImg = program?.image_logo?.big;
  const maxSeasons = program.segments[0].max_temp;
  const genderNames = program.genders?.map((gender) => gender.name).join(", ");
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-(--clr-primary)">
        {/* Imagen */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${bgImg})`,
            backgroundSize: "cover",
            backgroundPosition: "top right",
            backgroundRepeat: "no-repeat",
          }}
        />

        <div className="absolute inset-y-0 left-0 w-2/3 bg-linear-to-r from-(--clr-primary) via-(--clr-primary)/40 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-(--clr-primary) via-(--clr-primary)/40 to-transparent"></div>

        {/* Capa de sombreado dinámico (Scroll) */}
        <div
          className="absolute inset-0 bg-(--clr-primary) transition-opacity duration-75"
          style={{ opacity: scrollOpacity * 0.9 }}
        />
      </div>
      {/* Info del programa */}
      <div className="animate-in fade-in slide-in-from-left-10 duration-1000 mt-25 ml-25">
        <div className="h-40 2xl:h-55 flex items-end">
          {logoImg ? (
            <img
              src={logoImg}
              alt={program.title}
              className="w-auto max-w-60 h-full object-contain"
            />
          ) : (
            <h2 className="text-2xl mb-3 font-title font-bold text-white drop-shadow-2xl">
              {program.title}
            </h2>
          )}
        </div>
        <div className="text-lg font-medium flex items-center gap-2 mb-3">
          <span className="px-2 bg-[#31343C] py-1 rounded-md">
            {program.classification}
          </span>
          {program.anio_production && (
            <span>
              {program.anio_production} {"-"}
            </span>
          )}
          {maxSeasons > 1 ? (
            <span>
              {maxSeasons + " Temporadas"} {"-"}
            </span>
          ) : (
            <span>
              {"1 Temporada"} {"-"}
            </span>
          )}
          {genderNames && <span>{genderNames}</span>}
        </div>

        <div className="flex flex-row items-center gap-4 pt-4 mb-3">
          <button
            onClick={handlePlay}
            className="bg-(--clr-primary-button) text-(--clr-text-primary-button) px-8 py-3 rounded-md hover:bg-white hover:text-black transition-all flex items-center gap-3 group shadow-lg cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 27 28" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-110">
              <path d="M25.8227 12.0936C27.2626 12.8396 27.2626 14.8991 25.8227 15.6452L2.9201 27.5118C1.58881 28.2016 -1.3492e-06 27.2354 -1.28366e-06 25.736L-2.46241e-07 2.00273C-1.80702e-07 0.503353 1.58881 -0.462842 2.9201 0.226944L25.8227 12.0936Z" />
            </svg>
            {continueWatchingItem ? "Reanudar" : "Play"}
          </button>
          {!isEnabled && (
            <button
              onClick={toggleFavorite}
              disabled={isToggling}
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all shadow-lg cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed ${isFavorited
                ? "bg-white border-white text-black hover:bg-white/80"
                : "bg-black/40 border-white text-white hover:bg-(--foc-primary) hover:text-black hover:border-white"
                }`}
            >
              <img
                src={isFavorited ? CheckIcon : PlusIcon}
                alt={isFavorited ? "Quitar de Mi Lista" : "Agregar a Mi Lista"}
                className="w-6 h-6"
              />
            </button>

          )}
        </div>

        {/* Barra de progreso "Seguir viendo" */}
        {continueWatchingItem && (
          <ProgressBar
            duration={continueWatchingItem.duration}
            time={continueWatchingItem.time}
          />
        )}

        <p className="text-lg font-text font-medium drop-shadow-md leading-8 h-[100px] max-w-4xl ">
          {program.description_short}
        </p>
      </div>
    </>
  );
}

export default Banner;
