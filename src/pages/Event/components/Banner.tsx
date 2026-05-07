
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Event } from "@/interfaces/catalog.interface";
import Button from "@/components/ui/Button";

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
        event?.image_land.big;

    const logoCat = event?.category?.image_logo?.default;
    const logoEvent = event?.image_logo?.default;

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
        ? `Próximamente · ${eventDate.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" })}, ${eventDate.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", hour12: false })}`
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
                            className="max-w-80 max-h-30 2xl:max-w-100 2xl:max-h-40 object-contain drop-shadow-xl"
                        />
                    )}
                    <div className="flex flex-row gap-5">
                        {classification && (
                            <span className="px-3 py-1 rounded-md text-sm  uppercase tracking-wide bg-[#31343C] text-white">
                                {classification}
                            </span>
                        )}
                    </div>
                    <Button variant="primary" showArrow onClick={handlePlay}>
                        Play
                    </Button>
                    <div className="h-30 flex flex-row items-center gap-5">
                        {logoCat && (
                            <img src={logoCat} alt="" className="w-auto h-20 object-contain" />
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
