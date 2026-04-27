import type { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useNavigate } from "react-router-dom";
import type { HistoryItem } from "@/interfaces/history.interface";

interface ContinueWatchingCarouselProps {
	items: HistoryItem[];
}

function formatDuration(duration: string): string {
	const parts = duration.split(":");
	if (parts.length === 3) {
		const [h, m, s] = parts.map(Number);
		if (h > 0) return `${h}h ${m}m`;
		return `${m}m ${s}s`;
	}
	return duration;
}

function formatProgress(time: number): string {
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;
	if (minutes > 0) return `${minutes}m ${seconds}s`;
	return `${seconds}s`;
}

function ContinueWatchingCarousel({ items }: ContinueWatchingCarouselProps) {
	const navigate = useNavigate();
	const [emblaRef] = useEmblaCarousel({
		align: "start",
		dragFree: true,
		containScroll: "trimSnaps",
	} as EmblaOptionsType);

	if (items.length === 0) return null;

	return (
		<div
			className="px-20 flex flex-col gap-5 mt-5 mb-5 | xs:max-md:px-7.5"
			style={{ fontFamily: "var(--font-family-category)" }}
		>
			<h2 className="text-2xl font-bold text-white">Seguir Viendo</h2>
			<div
				ref={emblaRef}
				className="overflow-hidden cursor-grab active:cursor-grabbing py-1 -ml-1 pl-1"
			>
				<div className="flex gap-5 items-stretch transform-gpu will-change-transform">
					{items.map((item) => {
						const imgSrc =
							item.image_land?.medium || item.image_land?.default || item.image;
						return (
							<div
								key={item.slug}
								tabIndex={0}
								onClick={() =>
									navigate(
										`/play/${item.key_segment}/${item.season}/${item.chapter}`,
										{ state: { resumeTime: item.time } },
									)
								}
								className="group relative shrink-0 overflow-hidden cursor-pointer transition-all duration-300 hover:z-10 hover:ring-2 hover:ring-(--foc-primary) hover:shadow-[0_0_20px_rgba(255,19,118,0.3)] focus:outline-none focus:z-10 focus:ring-2 focus:ring-(--foc-primary) bg-[#0a0a0a] w-72 rounded-lg"
							>
								{/* Imagen */}
								<div className="aspect-video overflow-hidden">
									{imgSrc ? (
										<img
											src={imgSrc}
											alt={item.title}
											className="w-full h-full object-cover transition-transform duration-300 scale-110 group-hover:scale-100 group-focus:scale-100"
											draggable={false}
										/>
									) : (
										<div className="w-full h-full bg-gray-800 flex items-center justify-center">
											<span className="text-white text-sm font-medium">
												{item.title}
											</span>
										</div>
									)}
								</div>

								{/* Barra de progreso */}
								<div className="h-1 bg-white/20">
									<div
										className="h-full bg-(--foc-primary) transition-all duration-300"
										style={{
											width: `${Math.min(100, (item.time / parseDuration(item.duration)) * 100)}%`,
										}}
									/>
								</div>
							</div>
						);
					})}
					<div className="flex-none w-16" />
				</div>
			</div>
		</div>
	);
}

/** Convierte "HH:MM:SS" a segundos */
function parseDuration(duration: string): number {
	const parts = duration.split(":").map(Number);
	if (parts.length === 3) {
		return parts[0] * 3600 + parts[1] * 60 + parts[2];
	}
	return 1; // fallback para evitar div/0
}

export default ContinueWatchingCarousel;
