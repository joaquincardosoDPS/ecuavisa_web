import type { Program, Event } from "@/interfaces/catalog.interface";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import { getEventStatus } from "@/utils/eventStatus";
import { PlayButton } from "@/components/icons/play-button";
import { InfoCircle } from "@/components/icons/info-circle";

interface BannerInfoProps {
	program: Program | Event;
}

export function BannerInfo({ program }: BannerInfoProps) {
	const navigate = useNavigate();
	if (!program) return null;

	const isEvent = 'type' in program;
	const eventData = isEvent ? (program as Event) : null;
	const eventStatus = isEvent && eventData ? getEventStatus(eventData) : null;

	const handleClick = () => {
		if (isEvent && eventData) {
			if (eventData.skip_view && eventData.program_associated?.key) {
				navigate(`/programas/${eventData.program_associated.key}`);
			} else {
				navigate(`/eventos/${eventData.key}`);
			}
		} else {
			navigate(`/programas/${program.key}`);
		}
	};

	return (
		<>
			{/* Badge de estado */}
			{eventStatus && (
				<span
					className="inline-block mb-4 px-3 py-1 rounded-md text-sm font-bold uppercase tracking-wide"
					style={{
						backgroundColor: eventStatus.bgColor,
						color: eventStatus.textColor,
					}}
				>
					{eventStatus.label}
				</span>
			)}

			{/* Descripción + Metadata */}
			<div className="max-w-[50vw] z-2 flex flex-row justify-start mb-8">
				{/* Logo del programa */}
				{program.image_logo?.medium ? (
					<div className="max-h-[15vw] max-w-[20vw] w-fit z-2 pr-4">
						<img
							src={program.image_logo.default}
							alt={program.title}
							className="h-full object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
						/>
					</div>
				) : (
					null
				)}
				<div>
					<h2 className="text-[4rem] font-black leading-20 mb-4">
						{program.title}
					</h2>
					<p className="text-[1.5rem] leading-10 line-clamp-4">
						{program.description_short}
					</p>
				</div>
			</div>

			{/* Botones */}
			<div className='flex flex-row uppercase' style={{ columnGap: '1rem' }}>
				<Button
					variant="primary"
					onClick={handleClick}
				>
					<PlayButton className="mr-2 shrink-0" width={24} height={24} />
					Ver ahora
				</Button>
				<Button
					variant="primary"
					onClick={handleClick}
				>
					<InfoCircle className="mr-2 shrink-0" width={24} height={24} />
					Información
				</Button>
			</div>
			<div></div>
		</>
	);
}
