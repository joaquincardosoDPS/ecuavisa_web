import { useNavigate } from 'react-router-dom';
import type { Event } from "@/interfaces/catalog.interface";

interface CardProps {
    event: Event;
    index: number;
}

function EventCard({ event, index }: CardProps) {
    const navigate = useNavigate();
    const imageSrc = event.image_landscape.default;

    const handleClick = () => {
        navigate(`/eventos/${event.key}`);
    };

    return (
        <div className="flex flex-col gap-3" onClick={handleClick}>

            <div
                className='group relative shrink-0 overflow-hidden cursor-pointer transition-all duration-300 hover:z-10 hover:ring-2 hover:ring-(--foc-primary) hover:shadow-[0_0_20px_rgba(255,19,118,0.3)] focus:outline-none focus:z-10 focus:ring-2 focus:ring-(--foc-primary) focus:shadow-[0_0_20px_rgba(255,19,118,0.3)] bg-[#0a0a0a] embla_slide aspect-video rounded-lg'
            >
                <img
                    src={imageSrc}
                    alt={event.title}
                    className='w-full h-full object-cover rounded-[inherit]'
                    loading='lazy'
                />
            </div>
        </div>
    )
}

export default EventCard