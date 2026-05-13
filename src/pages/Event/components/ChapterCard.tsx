import { useNavigate } from 'react-router-dom';
import type { Chapter } from "@/interfaces/catalog.interface";

interface ChapterCardProps {
    chapter: Chapter;
    index: number;
    programKey: string;
    showChapter?: boolean
}

function ChapterCard({ chapter, programKey, showChapter = true }: ChapterCardProps) {
    const navigate = useNavigate();
    const imageSrc = chapter.image_land.small;

    const handleClick = () => {
        navigate(`/play/${programKey}/${chapter.key_segment}/${chapter.season}/${chapter.chapter}`);
    };

    return (
        <div className="flex flex-col gap-3" onClick={handleClick}>

            <div
                className='group relative shrink-0 overflow-hidden cursor-pointer transition-all duration-300 hover:z-10 hover:ring-2 hover:ring-(--foc-primary) hover:shadow-[0_0_20px_rgba(255,19,118,0.3)] focus:outline-none focus:z-10 focus:ring-2 focus:ring-(--foc-primary) focus:shadow-[0_0_20px_rgba(255,19,118,0.3)] bg-[#0a0a0a] embla_slide aspect-video rounded-lg'
            >
                <img
                    src={imageSrc}
                    alt={chapter.title}
                    className='w-full h-full object-cover rounded-[inherit]'
                    loading='lazy'
                />
            </div>
            <div className="text-lg text-white">
                {showChapter ?
                    <>
                        <h1 className="">Capítulo {chapter.chapter}</h1>
                        <h2 className="text-(--clr-text-primary-button) line-clamp-2 2xl:line-clamp-3 text-sm 2xl:text-base">{chapter.title}</h2>
                    </>
                    : <h1 className="">{chapter.title}</h1>}
            </div>
        </div>
    )
}

export default ChapterCard