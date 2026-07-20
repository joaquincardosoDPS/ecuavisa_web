import { useState, useEffect } from "react";
import type { Program } from "@/interfaces/catalog.interface";

interface ProgramsBannerProps {
	activeProgram: Program | null;
}

export default function ProgramsBanner({ activeProgram }: ProgramsBannerProps) {
	// Carga la imagen de fondo
	const currentBgImage =
		activeProgram?.image_slider?.big || activeProgram?.image_background?.big || activeProgram?.image_land?.big || "";

	const logo = activeProgram?.image_logo?.default || activeProgram?.image_logo?.default;

	const [images, setImages] = useState<{ src: string; loaded: boolean }[]>(
		currentBgImage ? [{ src: currentBgImage, loaded: true }] : [],
	);

	// Actualiza la imagen de fondo cuando cambia el programa seleccionado
	useEffect(() => {
		if (!currentBgImage) return;

		 
		setImages((prev) => {
			const lastImage = prev[prev.length - 1];
			if (lastImage && lastImage.src === currentBgImage) {
				return prev;
			}
			const lastLoaded = prev.filter((img) => img.loaded).slice(-1);

			return [...lastLoaded, { src: currentBgImage, loaded: false }];
		});
	}, [currentBgImage]);

	if (!activeProgram) return null;

	return (
		<div className="sticky top-0 h-[60vh] bg-(--clr-primary) z-20">
			<div className="relative w-full h-full">
				{images.map((img) => (
					<div
						key={img.src}
						className={`absolute inset-0 -z-10 w-full h-full transition-opacity duration-500 ease-in-out ${img.loaded ? "opacity-100" : "opacity-0"}`}
						style={{
							backgroundImage: `url(${img.src})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
							backgroundColor: "var(--clr-primary)",
							backgroundRepeat: "no-repeat",
						}}
						ref={(el) => {
							if (el && !img.loaded) {
								const preload = new Image();
								preload.onload = () => {
									setImages((prev) =>
										prev.map((i) =>
											i.src === img.src ? { ...i, loaded: true } : i,
										),
									);
								};
								preload.src = img.src;
							}
						}}
					/>
				))}
				<div className="absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-(--clr-primary) via-(--clr-primary)/40 to-transparent pointer-events-none"></div>
				<div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-(--clr-primary) via-(--clr-primary)/40 to-transparent pointer-events-none"></div>
				<div className="relative h-full px-20 py-7 2xl:py-12 flex flex-col justify-end gap-5 z-10 pointer-events-none">
					<div className="h-46 flex items-center | xs:max-sm:h-7.5">
						{logo ? (
							<img
								src={logo}
								alt={activeProgram.title}
								className="w-auto h-full object-contain"
							/>
						) : (
							<h1 className="text-4xl font-title font-bold text-(--clr-primary-title) drop-shadow-2xl">
								{activeProgram.title}
							</h1>
						)}
					</div>

					{activeProgram.description_short && (
						<p className="text-lg font-text line-clamp-3 drop-shadow-md leading-8 h-[150px] max-w-4xl | xs:max-md:h-auto xs:max-md:leading-8 2xl:text-2xl">
							{activeProgram.description_short}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
