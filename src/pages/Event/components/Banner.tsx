
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Event } from "@/interfaces/catalog.interface";

function Banner({ event }: { event: Event | null }) {
    if (!event) return null;
    const navigate = useNavigate();
    const [scrollOpacity, setScrollOpacity] = useState(0);

    const handlePlay = () => {
        if (event.live_associated?.key) {
            navigate("/en-vivo", { state: { signal: event.live_associated.key } });
        } else if (event.program_associated?.key) {
            navigate(`/programas/${event.program_associated.key}`);
        }
    };


    // Efecto de sombreado dinámico al hacer scroll
    useEffect(() => {
        const handleScroll = () => {
            const scroll = window.scrollY;
            const threshold = 500;
            const opacity = Math.min(scroll / threshold, 1);
            setScrollOpacity(opacity);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);



    const bgImg =
        event?.image_background?.big ||
        event?.image_landscape.big;

    const logoCat = event?.category?.image_logo?.small;
    const logoEvent = event?.image_logo?.small;
    console.log('logoEvent', event?.category?.image_logo?.small)
    const isLive = event?.live_associated?.key ? true : false;
    const classification = event?.classification;
    let categoryName = '';

    if (Array.isArray(event.category)) {
        categoryName = event.category[0].name;
    } else {
        categoryName = event.category?.name || '';
    }

    const eventDate = new Date(event?.gmt0_unlocked?.replace(" ", "T") + "Z");
    const now = new Date();
    const eventStatus = now < eventDate
        ? "Próximamente"
        : isLive
            ? "En vivo ahora"
            : null;
    return (
        <>
            <div className="fixed inset-0 -z-10 bg-(--clr-primary)">
                {/* Imagen */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url(${bgImg})`,
                        backgroundSize: "100% auto",
                        backgroundPosition: "top center",
                        backgroundRepeat: "no-repeat",
                    }}
                />

                <div
                    className="absolute inset-y-0 left-0 w-1/3"
                    style={{
                        background: "linear-gradient(to right, var(--clr-primary), color-mix(in srgb, var(--clr-primary) 40%, transparent), transparent)",
                    }}
                />
                <div
                    className="absolute inset-x-0 bottom-0 h-2/3"
                    style={{
                        background: "linear-gradient(to top, var(--clr-primary) 0%, color-mix(in srgb, var(--clr-primary) 80%, transparent) 40%, transparent 100%)",
                    }}
                />

                <div
                    className="absolute inset-0 bg-(--clr-primary) transition-opacity duration-75"
                    style={{ opacity: scrollOpacity * 0.9 }}
                />
            </div>
            {/* Info del programa */}
            <div className="animate-in fade-in slide-in-from-left-10 duration-1000 mt-25 ml-10 xl:ml-25 min-h-[calc(100vh-650px)]">
                <div className="flex flex-col gap-5 items-start">
                    {eventStatus && (
                        <span className="px-3 py-1 rounded-md text-sm  uppercase tracking-wide bg-(--foc-tertiary) text-(--clr-secondary-subtitle)">
                            {eventStatus}
                        </span>
                    )}
                    {logoEvent && (
                        <img
                            src={logoEvent}
                            alt={event.title}
                            className="max-w-80 max-h-30 2xl:max-w-100 2xl:max-h-40 object-contain drop-shadow-xl border border-red-500"
                        />
                    )}
                    <div className="flex flex-row gap-5">
                        {classification && (
                            <span className="px-3 py-1 rounded-md text-sm  uppercase tracking-wide bg-[#31343C] text-white">
                                {classification}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handlePlay}
                        className="bg-(--clr-primary-button) text-(--clr-text-primary-button) px-8 py-3 rounded-md hover:bg-white hover:text-black  transition-all flex items-center gap-3 group shadow-lg cursor-pointer"
                    >
                        <svg width="20" height="20" viewBox="0 0 27 28" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-110">
                            <path d="M25.8227 12.0936C27.2626 12.8396 27.2626 14.8991 25.8227 15.6452L2.9201 27.5118C1.58881 28.2016 -1.3492e-06 27.2354 -1.28366e-06 25.736L-2.46241e-07 2.00273C-1.80702e-07 0.503353 1.58881 -0.462842 2.9201 0.226944L25.8227 12.0936Z" />
                        </svg>
                        {"Play"}
                    </button>
                    <div className="h-30 flex flex-row items-center gap-5">
                        {logoCat && (
                            <img src={logoCat} alt="" className="w-auto h-30 object-contain" />
                        )}
                        <span className="text-lg 2xl:text-2xl font-medium">{categoryName}</span>
                    </div>
                    <h1 className="text-xl 2xl:text-4xl font-title font-bold">{event.title}</h1>
                    <p className="text-base 2xl:text-xl font-medium max-w-2xl">{event.description_short}</p>

                </div>
            </div>
        </>
    );
}

export default Banner;
