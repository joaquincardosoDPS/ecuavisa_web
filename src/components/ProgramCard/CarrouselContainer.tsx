import type { Category } from '@/interfaces/catalog.interface';
import CardCarrousel from './CardCarrousel';

interface CarrouselContainerProps {
    category: Category;
}

function CarrouselContainer({ category }: CarrouselContainerProps) {
    if (!category.programs.length) return null;

    return (
        <div
            className={`px-20 relative flex flex-col gap-5 mt-5 mb-5`}
            style={{ fontFamily: 'var(--font-family-category)' }}
        >
            <h2 className="relative z-10 text-2xl font-bold text-white line-height-7">{category.title}</h2>

            <div className="relative z-10 flex flex-row items-center gap-8">
                <div className="flex-1 min-w-0">
                    <CardCarrousel programs={category.programs} />
                </div>
            </div>
        </div>
    )
}

export default CarrouselContainer