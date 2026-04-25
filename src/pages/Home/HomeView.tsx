
import { useHomeData } from "@/hooks/useHomeData";
import Banner from "./components/Banner";
import CarrouselContainerHome from "@/components/ProgramCard/CarrouselContainerHome";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import CardCarrousel from '@/components/ProgramCard/CardCarrousel';
import ContinueWatchingCarousel from "@/components/ProgramCard/ContinueWatchingCarousel";

function HomeView() {
    const { slider, categories, recommended, continueWatching, isLoading, isError } = useHomeData();
    if (isLoading) {
        return <FullScreenSpinner message="Cargando Portada..." />;
    }

    if (isError || !slider) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-white">
                <p className="text-red-500 font-title text-xl">Error al cargar el catálogo.</p>
            </div>
        );
    }
    return (
        <div className="relative min-h-screen overflow-x-hidden">
            <Banner
                slider={slider}
            />

            <div className="flex flex-col pb-20 gap-5">
                {/* Seguir Viendo */}
                {continueWatching.length > 0 && (
                    <ContinueWatchingCarousel items={continueWatching} />
                )}

                {/* Listado de categorías */}

                {categories.map(category => (
                    category.programs.length > 0 && <CarrouselContainerHome key={category.key} category={category} />
                ))}

                {/* Recomendados */}
                <div className='px-20 flex flex-col gap-5 mt-5 mb-5' style={{ fontFamily: 'var(--font-family-category)' }}>
                    <h2 className="text-2xl font-bold text-white line-height-7">Recomendados para ti</h2>
                    <CardCarrousel programs={recommended} orientation='vertical' />
                </div>

            </div>
        </div>
    );
}

export default HomeView;