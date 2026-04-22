import type { Program } from '@/interfaces/catalog.interface'
import PlayIcon from "@/assets/img/icons/play.svg";
import { useEffect, useState } from 'react';

function Banner({ program }: { program: Program }) {
    const [scrollOpacity, setScrollOpacity] = useState(0);

    // Efecto de sombreado dinámico al hacer scroll
    useEffect(() => {
        const handleScroll = () => {
            const scroll = window.scrollY;
            const threshold = 500;
            const opacity = Math.min(scroll / threshold, 1);
            setScrollOpacity(opacity);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const bgImg = program?.image_slider?.big || program?.image_background?.big || program.image_land.big;
    const logoImg = program?.image_logo?.big;
    const maxSeasons = program.segments[0].max_temp;
    const genderNames = program.genders.map((gender) => gender.name).join(", ");
    return (
        <>
            <div className="fixed inset-0 -z-10 bg-(--clr-primary)">
                {/* Imagen */}
                <div className="absolute inset-0" style={{
                    backgroundImage: `url(${bgImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top right',
                    backgroundRepeat: 'no-repeat',
                }} />

                <div className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-(--clr-primary) via-(--clr-primary)/40 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-(--clr-primary) via-(--clr-primary)/40 to-transparent"></div>

                {/* Capa de sombreado dinámico (Scroll) */}
                <div
                    className="absolute inset-0 bg-(--clr-primary) transition-opacity duration-75"
                    style={{ opacity: scrollOpacity * 0.9 }}
                />
            </div>
            {/* Info del programa */}
            <div className="space-y-6 animate-in fade-in slide-in-from-left-10 duration-1000 mt-35 ml-25">
                <div className="h-60 flex items-end">
                    {logoImg ? (
                        <img
                            src={logoImg}
                            alt={program.title}
                            className="w-auto max-w-60 h-full object-contain"
                        />
                    ) : (
                        <h2 className="text-4xl font-title font-bold text-white drop-shadow-2xl">
                            {program.title}
                        </h2>
                    )}

                </div>
                <div className='text-xl font-medium flex items-center gap-2'>
                    <span className='px-2 bg-[#31343C] py-1 rounded-md'>{program.classification}</span>
                    {program.anio_production && <span>{program.anio_production} {'-'}</span>}
                    {maxSeasons > 1 ? (
                        <span>{maxSeasons + ' Temporadas'} {'-'}</span>
                    ) : (
                        <span>{'1 Temporada'} {'-'}</span>
                    )}
                    {genderNames && <span>{genderNames}</span>}

                </div>

                <div className="flex flex-row items-center gap-4 pt-4">
                    <button className="bg-white text-black px-10 py-5 rounded-md font-bold hover:bg-white/90 transition-all flex items-center gap-3 group shadow-lg">
                        <img
                            src={PlayIcon}
                            alt="Play"
                            className="w-6 h-6 transition-transform group-hover:scale-110"
                        />
                        Play
                    </button>
                    <button className="w-14 h-14 flex items-center justify-center rounded-full bg-black/40 border-2 border-white text-white hover:bg-white hover:text-black hover:border-white transition-all shadow-lg cursor-pointer group">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                <p className="text-2xl font-text font-medium drop-shadow-md leading-11 h-[150px] max-w-4xl ">
                    {program.description_short}
                </p>
            </div>
        </>
    )
}

export default Banner