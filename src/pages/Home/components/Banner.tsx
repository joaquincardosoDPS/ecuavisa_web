import type { Program, Event } from "@/interfaces/catalog.interface";
import { BannerInfo } from "./BannerInfo";
import { useState } from "react";

interface BannerProps {
	slider: (Program | Event)[];
}

function Banner({ slider }: BannerProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	const total = slider?.length ?? 0;

	if (!slider || slider.length === 0) return null;

	return (
		<div className="relative w-full h-[75vh] mb-30 gpu-layer">
			{slider.map((program, i) => (
				<div
					key={program.id}
					className="absolute top-0 left-0 w-full h-screen transition-opacity duration-700 ease-in-out bg-cover bg-center bg-no-repeat"
					style={{
						backgroundImage: `url(${program.image_slider?.big || program.image_land?.default})`,
						opacity: i === currentIndex ? 1 : 0,
						zIndex: i === currentIndex ? 1 : 0,
					}}
				>
					<div className="absolute top-0 left-0 w-full h-screen banner-overlay" />
				</div>
			))}

			<div className="absolute inset-0 z-10 flex items-end">
				<button
					onClick={() => setCurrentIndex((i) => (i - 1 + total) % total)}
					className="shrink-0 ml-5 text-(--clr-primary-title)/80 hover:text-(--clr-primary-title) cursor-pointer transition-all duration-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-40"
				>
					<svg width="30" height="50" viewBox="8 5 8 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
						<polyline points="15 18 9 12 15 6" />
					</svg>
				</button>

				<div className="relative flex-1 px-12.5">
					{slider.map((program, i) => (
						<div
							key={program.id}
							className="absolute bottom-0 left-0 right-0 px-12.5 transition-all duration-500 ease-in-out"
							style={{
								opacity: i === currentIndex ? 1 : 0,
								transform: i === currentIndex ? 'translateY(0)' : 'translateY(20px)',
								pointerEvents: i === currentIndex ? 'auto' : 'none',
							}}
						>
							<BannerInfo program={program} />
						</div>
					))}
				</div>

				{/* Flecha derecha */}
				<button
					onClick={() => setCurrentIndex((i) => (i + 1) % total)}
					className="shrink-0 mr-5 text-(--clr-primary-title)/80 hover:text-(--clr-primary-title) cursor-pointer transition-all duration-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]  mb-40"
				>
					<svg width="30" height="50" viewBox="8 5 8 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
						<polyline points="9 18 15 12 9 6" />
					</svg>
				</button>
			</div>
		</div>
	);
}

export default Banner;
