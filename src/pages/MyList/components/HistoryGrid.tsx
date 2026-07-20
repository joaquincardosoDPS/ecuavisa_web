import { useNavigate } from "react-router-dom";
import type { HistoryItem } from "@/interfaces/history.interface";
import Button from "@/components/ui/Button";
import { useInfiniteScroll } from "@/hooks/shared/useInfiniteScroll";

/** Formatea duration_seg a "X h Y min" */
function formatDuration(seconds: number): string {
	if (!seconds || seconds <= 0) return "";
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	if (h > 0 && m > 0) return `${h} h ${m} min`;
	if (h > 0) return `${h} h`;
	return `${m} min`;
}

function getProgress(item: HistoryItem): number {
	if (item.duration_seg <= 0) return 0;
	return Math.min(100, (item.time / item.duration_seg) * 100);
}

function getImage(item: HistoryItem): string {
	return item.image_land?.medium || item.image_land?.default || item.image || "";
}

interface HistoryGridProps {
	items: HistoryItem[];
	fetchNextPage: () => void;
	hasNextPage: boolean;
	isFetchingNextPage: boolean;
}

export function HistoryGrid({ items, fetchNextPage, hasNextPage, isFetchingNextPage }: HistoryGridProps) {
	const navigate = useNavigate();
	const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage && !isFetchingNextPage);

	if (!items || items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-20 gap-4">
				<p className="text-(--clr-primary-title)/60 text-lg text-center">
					No tienes episodios pendientes por ver.
				</p>
				<Button variant="secondary" onClick={() => navigate("/")}>
					Explorar contenido
				</Button>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-5 gap-5">
				{items.map((item) => {
					const imgSrc = getImage(item);
					const progress = getProgress(item);
					const remaining = item.duration_seg - item.time;
					const remainingText =
						remaining > 0 ? `${formatDuration(remaining)} restantes` : "";

					return (
						<div
							key={item.slug}
							tabIndex={0}
							onClick={() =>
								navigate(
									`/play/${item.key_program}/${item.key_segment}/${item.season}/${item.chapter}`,
									{ state: { resumeTime: item.time } }
								)
							}
							className="cursor-pointer group"
						>
							<div className="relative w-full aspect-video rounded-xl overflow-hidden bg-(--clr-secondary,#054668) transition-all duration-300 group-hover:ring-2 group-hover:ring-(--foc-primary,#ff1376) group-hover:shadow-[0_0_20px_rgba(255,19,118,0.3)]">
								{imgSrc ? (
									<img
										src={imgSrc}
										alt={item.title}
										className="w-full h-full object-cover transition-transform duration-300 scale-110 group-hover:scale-100"
										draggable={false}
										decoding="async"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<span className="text-(--clr-primary-title)/40 text-sm">{item.title}</span>
									</div>
								)}

								{/* Icono play overlay */}
								<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
									<div className="w-12 h-12 rounded-full bg-(--clr-primary)/60 backdrop-blur-sm flex items-center justify-center">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="white">
											<polygon points="6,3 20,12 6,21" />
										</svg>
									</div>
								</div>

								{/* Barra de progreso */}
								<div className="absolute bottom-0 left-0 right-0 h-[5px] bg-white/20">
									<div
										className="h-full bg-(--foc-primary,#FF0069) transition-all duration-300"
										style={{ width: `${progress}%` }}
									/>
								</div>
							</div>

							{/* Info debajo */}
							<div className="mt-2 px-0.5">
								<p className="text-(--clr-primary-title) text-sm font-semibold tracking-wider line-clamp-1">
									{item.name_program}
								</p>
								<p className="text-(--clr-primary-title) text-base uppercase font-bold line-clamp-1 mt-0.5">
									{item.title}
								</p>
								{remainingText && (
									<p className="text-(--clr-primary-title)/50 text-sm mt-0.5">
										{remainingText}
									</p>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{/* Sentinel + loading indicator */}
			<div ref={sentinelRef} className="flex justify-center py-8">
				{isFetchingNextPage && (
					<div className="w-8 h-8 border-3 border-(--clr-primary-title)/20 border-t-white rounded-full animate-spin" />
				)}
			</div>
		</>
	);
}
