import Button from '@/components/ui/Button';
import type { Program } from '@/interfaces/catalog.interface';
import { useFavorite } from '@/hooks/useFavorite';
import FavoriteButton from '@/components/ui/FavoriteButton';
import ProgressBar from '@/components/ui/ProgressBar';
import { useContinueWatching } from '@/hooks/useContinueWatching';
import { useNavigate } from 'react-router-dom';

interface InfoBannerProps {
    program: Program
}

function InfoBanner({ program }: InfoBannerProps) {
    const navigate = useNavigate();
    const { isFavorited, isToggling, isEnabled, toggleFavorite } = useFavorite(
        program.key,
    );
    const { item: continueWatchingItem } = useContinueWatching(program.key);

    console.log(program)
    const handlePlay = () => {
        if (continueWatchingItem) {
            navigate(
                `/play/${program.key}/${continueWatchingItem.key_segment}/${continueWatchingItem.season}/${continueWatchingItem.chapter}`,
                { state: { resumeTime: continueWatchingItem.time } },
            );
        } else {
            const firstSegment = program.segments?.[0];
            if (firstSegment) {
                const firstSeason = firstSegment.all_temp?.[0] ?? 1;
                navigate(`/play/${program.key}/${firstSegment.key}/${firstSeason}/1`);
            }
        }
    };

    const logoImg = program?.image_logo?.big;
    const maxSeasons = program.segments?.[0]?.max_temp || 0;
    const genderNames = program.genders?.map((gender) => gender.name).join(", ");
    return (
        <div className="animate-in fade-in slide-in-from-left-10 duration-1000 mt-25 ml-25 h-[calc(100vh-55vh)]">
            <div className="h-40 2xl:h-55 flex items-end">
                {logoImg ? (
                    <img
                        src={logoImg}
                        alt={program.title}
                        className="w-auto h-full object-contain"
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
                <Button variant="primary" showArrow onClick={handlePlay}>
                    {continueWatchingItem ? "Reanudar" : "Play"}
                </Button>
                {isEnabled && (
                    <FavoriteButton
                        isFavorited={isFavorited}
                        isToggling={isToggling}
                        onClick={toggleFavorite}
                    />
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
    )
}

export default InfoBanner