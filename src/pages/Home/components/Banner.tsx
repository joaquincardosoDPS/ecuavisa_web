import { useEffect, useState } from "react";
import CardCarrousel from "@/components/ProgramCard/CardCarrousel";
import type { Program } from "@/interfaces/catalog.interface";
import { BannerInfo } from "./BannerInfo";

interface BannerProps {
	slider: Program[];
}

function Banner({ slider }: BannerProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		if (!slider || slider.length <= 1) return;

		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % slider.length);
		}, 5000);

		return () => clearInterval(interval);
	}, [slider]);

	if (!slider || slider.length === 0) return null;

	return (
		<>
			<section className="absolute top-0 left-0 w-full h-screen overflow-hidden bg-(--clr-primary) -z-10">
				{/* Capa de Imágenes (Fondo) */}
				<div className="absolute inset-0 z-0">
					{slider.map((item, index) => (
						<div
							key={item.id}
							className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
								index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
							}`}
						>
							<img
								src={item.image_slider.big || item.image_land.default}
								alt={item.title}
								className="w-full h-full object-cover"
							/>

							{/* Overlays para legibilidad dinámicos */}
							<div className="absolute inset-0 bg-linear-to-b from-(--clr-primary)/95 via-(--clr-primary)/40 to-transparent" />
							<div className="absolute inset-0 bg-linear-to-t from-(--clr-primary)/95 via-transparent to-transparent" />
						</div>
					))}
				</div>
			</section>
			<div className="relative z-10 pt-[20vh] px-20 flex flex-col gap-6 justify-start | xs:max-md:px-7.5">
				<BannerInfo program={slider[currentIndex]} />
				{slider.length > 1 && (
					<CardCarrousel programs={slider} orientation="vertical" />
				)}
			</div>
		</>
	);
}

export default Banner;
