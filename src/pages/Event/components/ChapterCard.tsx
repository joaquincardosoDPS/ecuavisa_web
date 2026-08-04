import { useNavigate } from 'react-router-dom';
import type { Chapter } from "@/interfaces/catalog.interface";

interface ChapterCardProps {
    chapter: Chapter;
    index: number;
    programKey: string;
    showChapter?: boolean;
    /** Tiempo de reproducción en segundos (0 = sin progreso) */
    playbackTime?: number;
    /** Si el capítulo fue marcado como finalizado */
    isFinished?: boolean;
}

function formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs} hrs ${mins} min` : `${mins} min`;
}

function getProgress(playbackTime: number, durationSeg: number): number {
    if (durationSeg <= 0 || playbackTime <= 0) return 0;
    return Math.min(100, (playbackTime / durationSeg) * 100);
}

function ChapterCard({ chapter, programKey, showChapter = true, playbackTime = 0, isFinished = false }: ChapterCardProps) {
    const navigate = useNavigate();
    const imageSrc = chapter.image_land.small;

    const handleClick = () => {
        navigate(
            `/play/${programKey}/${chapter.key_segment}/${chapter.season}/${chapter.chapter}`,
            playbackTime > 0 && !isFinished ? { state: { resumeTime: playbackTime } } : undefined,
        );
    };

    const progress = isFinished ? 100 : getProgress(playbackTime, chapter.duration_seg);
    const hasProgress = progress > 0;

    return (
        <div className="flex flex-col gap-3" onClick={handleClick}>

            <div
                className='group relative shrink-0 overflow-hidden cursor-pointer transition-all duration-300 hover:z-10 hover:ring-2 hover:ring-(--foc-primary) hover:shadow-[0_0_20px_rgba(255,19,118,0.3)] focus:outline-none focus:z-10 focus:ring-2 focus:ring-(--foc-primary) focus:shadow-[0_0_20px_rgba(255,19,118,0.3)] bg-(--clr-primary) embla_slide aspect-video rounded-lg'
            >
                <img
                    src={imageSrc}
                    alt={chapter.title}
                    className='w-full h-full object-cover rounded-[inherit]'
                    loading='lazy'
                />

                {/* Barra de progreso */}
                {hasProgress && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.25 bg-white/20">
                        <div
                            className="h-full bg-(--foc-primary,#FF0069) transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>
            <div className="text-lg text-(--clr-primary-title)">
                {showChapter ?
                    <>
                        <h1 className="">Capítulo {chapter.chapter}</h1>
                        <h2 className="text-(--clr-primary-text) line-clamp-2 2xl:line-clamp-3 text-sm 2xl:text-base">{chapter.title}</h2>
                    </>
                    :
                    <div className="flex flex-col gap-2">
                        <p className="self-stretch text-(--clr-primary-title) font-bold text-base leading-5">{formatDuration(chapter.duration_seg)}</p>
                        <h4 className="text-xl font-bold leading-6">{chapter.title}</h4>
                        <p className="text-(--clr-primary-title) text-base leading-6 line-clamp-2">{chapter.description}</p>
                    </div>
                }
            </div>
        </div>
    )
}

export default ChapterCard