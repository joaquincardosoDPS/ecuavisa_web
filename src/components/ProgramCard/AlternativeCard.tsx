
import type { Program } from '@/interfaces/catalog.interface';
import { useNavigate } from 'react-router-dom';

function AlternativeCard({ program }: { program: Program }) {
    const navigate = useNavigate();

    const imageSrc = program?.image_land.normal;

    const handleClick = () => {
        navigate(`/programas/${program.key}`);
    };

    return (
        <div
            tabIndex={0}
            className="group relative shrink-0 overflow-hidden cursor-pointer transition-all duration-300 hover:z-10 hover:ring-2 hover:ring-(--foc-primary) hover:shadow-[0_0_20px_rgba(255,19,118,0.3)] focus:outline-none focus:z-10 focus:ring-2 focus:ring-(--foc-primary) focus:shadow-[0_0_20px_rgba(255,19,118,0.3)] bg-[#0a0a0a] embla_slide w-full aspect-video rounded-lg"
            onClick={handleClick}
        >
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
    );
}

export default AlternativeCard