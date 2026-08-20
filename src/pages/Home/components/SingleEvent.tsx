import type { Category, Event } from "@/interfaces/catalog.interface";
import { getEventStatus } from "@/utils/eventStatus";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

interface SingleEventProps {
    category: Category;
}

function SingleEvent({ category }: SingleEventProps) {
    const navigate = useNavigate();
    const event = (category.programs?.[0] as Event) || null;
    const eventStatus = event ? getEventStatus(event) : null;

    const bgImageUrl = category.image_background_category?.default || event?.image_background?.default || "";

    const handleClick = () => {
        if (event) {
            if (event.skip_view && event.program_associated?.key) {
                navigate(`/programas/${event.program_associated.key}`);
            } else {
                navigate(`/eventos/${event.key}`);
            }
        }
    };
    console.log(event)

    return (
        <div
            className=" h-[50vh] w-full overflow-hidden bg-no-repeat bg-center bg-size-[100%_auto] relative flex items-center pl-25 | xs:max-md:pl-7.5 xs:max-md:pr-7.5"
            style={{ backgroundImage: `url(${bgImageUrl})` }}
        >
            <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-transparent z-0" />

            <div className="relative z-10 flex flex-col items-start gap-4 max-w-2xl">
                {event?.image_logo?.big && (
                    <img
                        src={event.image_logo.big}
                        alt={event?.title || category.title}
                        className="w-60 max-h-45 object-contain drop-shadow-xl"
                    />
                )}

                {/* Event status badge */}
                {eventStatus && (
                    <span
                        className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide"
                        style={{
                            backgroundColor: eventStatus.bgColor,
                            color: eventStatus.textColor,
                        }}
                    >
                        {eventStatus.label}
                    </span>
                )}

                <h2 className="text-4xl md:text-5xl font-bold text-(--clr-primary-title) leading-tight drop-shadow-md">
                    {event?.title || category.title}
                </h2>

                {(event?.description_short || event?.description) && (
                    <p className="text-base md:text-lg text-(--clr-primary-title)/85 line-clamp-3 leading-relaxed">
                        {event.description_short || event.description}
                    </p>
                )}
                <Button
                    variant="primary"
                    onClick={handleClick}
                    className="mt-2"
                >
                    Ver detalles
                </Button>
            </div>
        </div>
    );
}

export default SingleEvent;