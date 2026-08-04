import { useState, useEffect } from "react";
import type { Program } from "@/interfaces/catalog.interface";

interface ProgramsBannerProps {
	activeProgram: Program | null;
}

export default function ProgramsBanner({ activeProgram }: ProgramsBannerProps) {
	// Carga la imagen de fondo
	const currentBgImage =
		activeProgram?.image_slider?.big || activeProgram?.image_background?.big || activeProgram?.image_land?.big || "";

	// const logo = activeProgram?.image_logo?.default || activeProgram?.image_logo?.default;

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
		<>
			{images.map((img) => (
				<div
					key={img.src}
					className={`fixed inset-0 -z-20 w-full h-full origin-center transition-all duration-1000 ease-in-out ${img.loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
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
			<div className="fixed inset-x-0 top-0 h-screen bg-linear-to-b from-(--clr-primary)/80 via-(--clr-primary)/40 to-transparent pointer-events-none -z-10"></div>
			<div className="fixed inset-y-0 left-0 w-1/2 bg-linear-to-r from-(--clr-primary)/80 via-(--clr-primary)/40 to-transparent pointer-events-none -z-10"></div>
			<div className="fixed inset-x-0 bottom-0 h-screen bg-linear-to-t from-(--clr-primary) via-(--clr-primary)/60 to-transparent pointer-events-none -z-10"></div>
		</>
	);
}
