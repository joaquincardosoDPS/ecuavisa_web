import CardCarrousel from "@/components/ProgramCard/CardCarrousel";
import type { Program } from "@/interfaces/catalog.interface";
import { BannerInfo } from "./BannerInfo";

interface BannerProps {
	slider: Program[];
}

function Banner({ slider }: BannerProps) {
	if (!slider || slider.length === 0) return null;

	const mainProgram = slider[0];
	const hasMultiple = slider.length > 1;
	const featuredPrograms = hasMultiple ? slider.slice(1) : [];

	return (
		<>
			{/* Fondo: siempre el primer programa, sin rotación */}
			<section className="absolute top-0 left-0 w-full h-screen overflow-hidden bg-(--clr-primary) -z-10">
				<div className="absolute inset-0 z-0">
					<img
						src={mainProgram.image_slider.big || mainProgram.image_land.default}
						alt={mainProgram.title}
						className="w-full h-full object-cover"
					/>
					{/* Overlays para legibilidad */}
					<div className="absolute inset-0 bg-linear-to-b from-(--clr-primary)/95 via-(--clr-primary)/40 to-transparent" />
					<div className="absolute inset-0 bg-linear-to-t from-(--clr-primary)/95 via-transparent to-transparent" />
				</div>
			</section>

			<div className="relative z-10 pt-[20vh] px-20 flex flex-col gap-6 justify-start | xs:max-md:px-7.5">
				<BannerInfo program={mainProgram} />

				{/* Carrusel de destacados (resto del slider) */}
				{hasMultiple && (
					<div className="flex flex-col gap-4">
						<h2 className="text-2xl font-bold text-white">Destacados</h2>
						<CardCarrousel programs={featuredPrograms} orientation="horizontal" />
					</div>
				)}
			</div>
		</>
	);
}

export default Banner;
