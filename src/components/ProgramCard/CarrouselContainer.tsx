import type { Category } from '@/interfaces/catalog.interface';
import CardCarrousel from './CardCarrousel';

interface CarrouselContainerProps {
    category: Category;
    orientation?: 'horizontal' | 'vertical' | '';
}

function CarrouselContainer({ category, orientation }: CarrouselContainerProps) {
    if (!category.programs.length) return null;

    const bgImage = category.image_background_category?.default;
    const IconImage = category.image_logo_category?.medium;
    const hasBgImage = Boolean(bgImage && bgImage !== "");
    const hasIconImage = Boolean(IconImage && IconImage !== "");

    const finalOrientation = (orientation === 'horizontal' || orientation === 'vertical')
        ? orientation
        : (hasBgImage ? 'vertical' : 'horizontal');

    return (
        <div
            className={`px-20 relative flex flex-col gap-5 mt-5 mb-5 ${hasBgImage ? 'py-8 px-8 rounded-2xl' : ''}`}
            style={{
                fontFamily: 'var(--font-family-category)',
                ...(hasBgImage ? {
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%), url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                } : {})
            }}
        >
            {!hasIconImage && <h2 className="relative z-10 text-2xl font-bold text-white line-height-7">{category.title}</h2>}

            <div className="relative z-10 flex flex-row items-center gap-8">
                {hasIconImage && (
                    <div className="shrink-0 flex items-center justify-center mx-20 gap-5">
                        <img
                            src={category.image_logo_category.medium}
                            alt={`${category.title} logo`}
                            className="w-full h-auto max-h-40 object-contain drop-shadow-xl"
                        />
                        <h2 className="relative z-10 text-2xl font-bold text-white line-height-7">{category.title}</h2>
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <CardCarrousel programs={category.programs} orientation={finalOrientation} />
                </div>
            </div>
        </div>
    )
}

export default CarrouselContainer