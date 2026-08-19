import { useState, useEffect } from "react";
import type { Program } from "@/interfaces/catalog.interface";

interface ProgramsBannerProps {
	activeProgram: Program | null;
}

interface BgImage {
	src: string;
	loaded: boolean;
	/** true cuando la imagen fue revelada tras cargarse (aplica fade-in animado) */
	animate: boolean;
}

export default function ProgramsBanner({ activeProgram }: ProgramsBannerProps) {
	// Carga la imagen de fondo
	const currentBgImage =
		activeProgram?.image_slider?.big || activeProgram?.image_background?.big || activeProgram?.image_land?.big || "";

	// const logo = activeProgram?.image_logo?.default || activeProgram?.image_logo?.default;

	const [images, setImages] = useState<BgImage[]>(
		currentBgImage ? [{ src: currentBgImage, loaded: true, animate: false }] : [],
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

			return [...lastLoaded, { src: currentBgImage, loaded: false, animate: false }];
		});
	}, [currentBgImage]);

	// Carga y decodifica la nueva imagen ANTES de revelarla, para que el
	// fade no "salte" cuando el fondo aún no está en caché.
	useEffect(() => {
		const pending = images.find((img) => !img.loaded);
		if (!pending) return;

		const loader = new Image();
		let cancelled = false;

		const reveal = () => {
			if (cancelled) return;
			setImages((prev) =>
				prev.map((i) =>
					i.src === pending.src ? { ...i, loaded: true, animate: true } : i,
				),
			);
		};

		loader.onload = () => {
			// decode() garantiza que el navegador puede pintar la imagen
			// de inmediato; sin esto el fade empieza con el fondo vacío
			// y la imagen aparece de golpe al final.
			if (typeof loader.decode === "function") {
				loader.decode().then(reveal).catch(reveal);
			} else {
				reveal();
			}
		};
		loader.onerror = reveal;

		loader.src = pending.src;

		return () => {
			cancelled = true;
		};
	}, [images]);

	if (!activeProgram) return null;

	return (
		<>
			{images.map((img) => (
				<div
					key={img.src}
					className={`fixed inset-0 -z-20 w-full h-full origin-center will-change-[opacity,transform] ${img.loaded
						? img.animate
							? "banner-bg-animate"
							: "opacity-100"
						: "opacity-0"}`}
					style={{
						backgroundImage: img.loaded ? `url(${img.src})` : undefined,
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
				/>
			))}
			<div className="fixed inset-x-0 top-0 h-screen bg-linear-to-b from-(--clr-primary)/80 via-(--clr-primary)/40 to-transparent pointer-events-none -z-10"></div>
			<div className="fixed inset-y-0 left-0 w-1/2 bg-linear-to-r from-(--clr-primary)/80 via-(--clr-primary)/40 to-transparent pointer-events-none -z-10"></div>
			<div className="fixed inset-x-0 bottom-0 h-screen bg-linear-to-t from-(--clr-primary) via-(--clr-primary)/60 to-transparent pointer-events-none -z-10"></div>
		</>
	);
}
