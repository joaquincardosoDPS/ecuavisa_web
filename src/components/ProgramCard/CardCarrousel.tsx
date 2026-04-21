import useEmblaCarousel from 'embla-carousel-react'
import type { Program } from '@/interfaces/catalog.interface'
import type { EmblaOptionsType } from 'embla-carousel'
import Card from './Card'

interface CardCarrouselProps {
    programs: Program[];
    orientation?: 'horizontal' | 'vertical';
    hasIconImage?: boolean;
}

function CardCarrousel({ programs, orientation = 'horizontal', hasIconImage = false }: CardCarrouselProps) {
    const [emblaRef] = useEmblaCarousel({
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
    } as EmblaOptionsType);

    return (
        <div
            ref={emblaRef}
            className="overflow-hidden cursor-grab active:cursor-grabbing py-1 -ml-1 pl-1"
        >
            <div className='flex gap-5 items-stretch transform-gpu will-change-transform'>
                {programs.map(program => (
                    <Card key={program.id} program={program} orientation={orientation} />
                ))}
                {programs.length === 10 && (
                    <div className={`flex items-center justify-center shrink-0 overflow-hidden cursor-pointer group transition-all duration-300 hover:z-10 hover:ring-2 hover:ring-(--foc-primary) hover:shadow-[0_0_20px_rgba(255,19,118,0.3)] ${orientation === 'vertical' ? 'w-48 md:w-64 aspect-2/3 rounded-xl' : 'w-[350px] aspect-video rounded-lg'}`}
                        style={{ backgroundColor: 'var(--clr-secondary)' }}
                    >
                        <span className="text-2xl font-medium text-white">Ver Más </span>
                    </div>
                )}

                <div className={`flex-none ${hasIconImage ? 'w-125' : 'w-16'}`} />
            </div>
        </div>
    )
}

export default CardCarrousel