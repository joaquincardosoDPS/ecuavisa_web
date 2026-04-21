import CarrouselContainer from '@/components/ProgramCard/CarrouselContainer';
import { useProgramsData } from '@/hooks/useProgramsData';
import { useProgramsStore } from '@/features/programs/programsStore';
import { useState, useEffect } from 'react';

function ProgramsView() {
    const { categories } = useProgramsData();
    const activeProgram = useProgramsStore((state) => state.activeProgram);
    const setActiveProgram = useProgramsStore((state) => state.setActiveProgram);

    // Carga el primer programa como seleccionado por defecto al cargar la vista
    useEffect(() => {
        if (!activeProgram && categories.data && categories.data.length > 0) {
            const firstCategory = categories.data.find(c => c.format === 'default' && c.programs && c.programs.length > 0);
            if (firstCategory) {
                setActiveProgram(firstCategory.programs[0]);
            }
        }
    }, [categories.data, activeProgram, setActiveProgram]);

    // Carga la imagen de fondo
    const currentBgImage = activeProgram?.image_slider?.big || activeProgram?.image_land?.big || '';
    const [images, setImages] = useState<{ src: string, loaded: boolean }[]>(
        currentBgImage ? [{ src: currentBgImage, loaded: true }] : []
    );

    // Actualiza la imagen de fondo cuando cambia el programa seleccionado
    useEffect(() => {
        if (!currentBgImage) return;

        setImages((prev) => {
            const lastImage = prev[prev.length - 1];
            if (lastImage && lastImage.src === currentBgImage) {
                return prev;
            }

            const lastLoaded = prev.filter(img => img.loaded).slice(-1);
            const isAlreadyCached = prev.some(img => img.src === currentBgImage && img.loaded);

            return [...lastLoaded, { src: currentBgImage, loaded: isAlreadyCached }];
        });
    }, [currentBgImage]);
    console.log(categories)
    return (
        <div className="relative min-h-screen">
            <div className="fixed top-0 left-0 w-full h-[60vh] z-20 bg-(--clr-primary) overflow-hidden">
                <div className='absolute inset-0 w-full h-full px-20 pt-30'>
                    {/* Imagen de fondo  */}
                    <div className="relative w-full h-full">
                        {images.map((img) => (
                            <img
                                key={img.src}
                                src={img.src}
                                alt=""
                                onLoad={() => {
                                    setImages(prev => prev.map(i => i.src === img.src ? { ...i, loaded: true } : i))
                                }}
                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-200 ease-in-out rounded-t-2xl ${img.loaded ? 'opacity-100' : 'opacity-0'}`}
                                style={{ backgroundColor: 'var(--clr-primary)' }}
                            />
                        ))}
                        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-(--clr-primary) to-transparent pointer-events-none"></div>

                        {/* Información del Programa  */}
                        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end gap-5 z-10 pointer-events-none">
                            {activeProgram?.image_logo?.normal || activeProgram?.image_logo?.default ? (
                                <img
                                    src={activeProgram.image_logo.normal || activeProgram.image_logo.default}
                                    alt={activeProgram.title}
                                    className="w-48 mb-4 object-contain drop-shadow-2xl"
                                />
                            ) : (
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                                    {activeProgram?.title}
                                </h1>
                            )}

                            {activeProgram?.description_short && (
                                <p className="text-white/90 text-3xl max-w-4xl drop-shadow-md mb-15">
                                    {activeProgram.description_short}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 mt-[50vh] pb-20 pt-10">
                {categories.data
                    ?.filter((category) => category.format === 'default')
                    .map((category) => (
                        <div key={category.key}>
                            <CarrouselContainer category={category} />
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default ProgramsView