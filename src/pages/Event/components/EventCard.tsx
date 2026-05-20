import { useNavigate } from 'react-router-dom';
import type { Event } from "@/interfaces/catalog.interface";
import { getEventStatus } from '@/utils/eventStatus';

interface CardProps {
    event: Event;
}

function EventCard({ event }: CardProps) {
    const navigate = useNavigate();
    const imageSrc = event.image_land.small;
    const eventStatus = getEventStatus(event);

    const handleClick = () => {
        navigate(`/eventos/${event.key}`);
    };

    const showDate = eventStatus !== null && eventStatus.label === 'Próximamente';

    return (
        <div className="flex flex-col gap-3" onClick={handleClick}>

            <div
                className='group relative shrink-0 overflow-hidden cursor-pointer transition-all duration-300 hover:z-10 hover:ring-2 hover:ring-(--foc-primary) hover:shadow-[0_0_20px_rgba(255,19,118,0.3)] focus:outline-none focus:z-10 focus:ring-2 focus:ring-(--foc-primary) focus:shadow-[0_0_20px_rgba(255,19,118,0.3)] bg-[#0a0a0a] embla_slide aspect-video rounded-lg'
            >
                {eventStatus && (
                    <span
                        className="absolute top-0 left-0 z-10 px-3 py-1 rounded text-xs font-semibold uppercase tracking-[0.05em] text-black"
                        style={{ backgroundColor: `var(${eventStatus.colorVar})` }}
                    >
                        {eventStatus.label}
                    </span>
                )}
                {imageSrc && (
                    <img
                        src={imageSrc}
                        alt={event.title}
                        className='w-full h-full object-cover rounded-[inherit]'
                        loading='lazy'
                    />
                )}
            </div>
            {showDate && (
                <div className='flex flex-col'>
                    <span className="text-lg font-semibold uppercase tracking-[0.03em] text-(--clr-secondary-text)">
                        {(() => {
                            const d = new Date(event.gmt0_unlocked.replace(' ', 'T') + 'Z');
                            const date = d.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'long' });
                            const time = d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false });
                            return `${date}, ${time} hrs`;
                        })()}
                    </span>
                    <span className="text-base font-medium text-(--clr-secondary-text) mt-[0.15rem]">{event.title}</span>
                </div>
            )}
        </div>
    )
}

export default EventCard