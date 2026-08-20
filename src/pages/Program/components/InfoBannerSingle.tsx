import { useContinueWatching } from '@/hooks/program/useContinueWatching';
import Button from '@/components/ui/Button';
import { useFavorite } from '@/hooks/mylist/useFavorite';
import type { Chapter, Program } from '@/interfaces/catalog.interface';
import FavoriteButton from '@/components/ui/FavoriteButton';
import { useNavigate } from 'react-router-dom';
import { formatDuration } from '@/utils/formatDuration';
import ProgressBar from '@/components/ui/ProgressBar';
import { BackButton } from '@/components/ui/BackButton';

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
        } else if (chapter) {
            navigate(`/play/${program.key}/${chapter.key_segment}/${chapter.season}/${chapter.chapter}`);
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
            <BackButton to="/programas" />
            <div className="h-40 2xl:h-55 flex items-end mt-4">
                {logoImg ? (
                    <img
                        src={logoImg}
                        alt={program.title}
                        className="w-auto max-w-60 h-full object-contain"
                    />
                ) : (
                    <h2 className="text-2xl mb-3 font-title font-bold text-(--clr-primary-title) drop-shadow-2xl">
                        {program.title}
                    </h2>
                )}
            </div>
            <div className="text-lg font-medium flex items-center gap-2 mb-3">
                <span className="px-2 bg-(--clr-secondary) py-1 rounded-md">
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
                <Button variant="primary" showArrow onClick={handlePlay}>
                    {continueWatchingItem ? "Reanudar" : "Ver ahora"}
                </Button>

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

            <p className="text-lg font-text font-medium drop-shadow-md leading-8 h-25 max-w-4xl ">
                {program.description_short}
            </p>
        </div>
    )
}

export default InfoBannerSingle