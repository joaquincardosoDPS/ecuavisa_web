import { useContinueWatching } from '@/hooks/useContinueWatching';
import { useFavorite } from '@/hooks/useFavorite';
import type { Chapter, Program } from '@/interfaces/catalog.interface';
import FavoriteButton from '@/components/ui/FavoriteButton';
import { useNavigate } from 'react-router-dom';
import { formatDuration } from '@/utils/formatDuration';
import ProgressBar from '@/components/ui/ProgressBar';

function InfoBannerSingle({ program, chapter }: {
    program: Program,
    chapter?: Chapter
}) {
    const navigate = useNavigate();
    const { isFavorited, isToggling, isEnabled, toggleFavorite } = useFavorite(
        program.key,
    );


    const { item: continueWatchingItem } = useContinueWatching(program.key);
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
    }

    const handleClicFavorite = () => {
        if (isEnabled) {
            toggleFavorite();
        } else {
            navigate('/auth/login')
        }
    }

    const logoImg = program?.image_logo?.big;
    // const maxSeasons = program.segments[0].max_temp;
    const genderNames = program.genders?.map((gender) => gender.name).join(", ");

    return (
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

                <span>
                    {chapter?.duration ? formatDuration(chapter.duration) : ''}
                </span>

            </div>
            {genderNames && <span>{genderNames}</span>}
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

                <FavoriteButton
                    isFavorited={isFavorited}
                    isToggling={isToggling}
                    onClick={handleClicFavorite}
                />
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

export default InfoBannerSingle