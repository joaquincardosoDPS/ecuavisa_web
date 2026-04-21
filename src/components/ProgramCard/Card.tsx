import type { Program } from '@/interfaces/catalog.interface'

interface CardProps {
    program: Program;
    orientation?: 'horizontal' | 'vertical';
}

function Card({ program, orientation = 'horizontal' }: CardProps) {
    const isVertical = orientation === 'vertical';
    const imageSrc = isVertical ? program.image_port?.medium : program.image_land?.default;
    if (!imageSrc) {
        console.log("ERROR", program);
    }
    return (
        <div className={`relative shrink-0 overflow-hidden cursor-pointer transition-all duration-300 hover:z-10 hover:ring-2 hover:ring-(--foc-primary) hover:shadow-[0_0_20px_rgba(255,19,118,0.3)] embla_slide ${isVertical ? 'w-48 md:w-64 aspect-2/3 rounded-xl' : 'max-w-[350px] aspect-video rounded-lg'}`}>
            {imageSrc ? (
                <img
                    src={imageSrc}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-300 select-none embla__slide__number"
                    draggable={false}
                />
            ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center p-4 text-center">
                    <span className="text-white text-sm md:text-base font-medium">{program.title}</span>
                </div>
            )}
        </div>
    )
}

export default Card