import { useEffect, useState, useMemo } from "react";
import CarrouselContainer from "@/components/ProgramCard/CarrouselContainer";
import { useProgramsStore } from "@/features/programs/programsStore";
import type { Program } from "@/interfaces/catalog.interface";
import { useProgramsData } from "@/hooks/useProgramsData";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";

function ProgramsView() {
	const { categories, isLoading } = useProgramsData();
	const activeProgram = useProgramsStore((state) => state.activeProgram);
	const setActiveProgram = useProgramsStore((state) => state.setActiveProgram);

	// Carga el primer programa como seleccionado por defecto al cargar la vista
	useEffect(() => {
		if (!activeProgram && categories && categories.length > 0) {
			const firstCategory = categories.find(
				(c) => c.format === "default" && c.programs && c.programs.length > 0,
			);
			if (firstCategory) {
				setActiveProgram(firstCategory.programs[0] as Program);
			}
		}
	}, [categories, activeProgram, setActiveProgram]);

	// Carga la imagen de fondo
	const currentBgImage =
		activeProgram?.image_slider?.big || activeProgram?.image_background?.big || "";
	const [images, setImages] = useState<{ src: string; loaded: boolean }[]>(
		currentBgImage ? [{ src: currentBgImage, loaded: true }] : [],
	);

	const logo = activeProgram?.image_logo?.normal || activeProgram?.image_logo?.default;

	// Preload initial above-the-fold images before revealing the view
	const criticalImages = useMemo(() => {
		if (!categories || categories.length === 0) return [];
		const urls: string[] = [];
		const firstCategory = categories.find(
			(c) => c.format === "default" && c.programs && c.programs.length > 0,
		);
		if (firstCategory) {
			const firstProg = firstCategory.programs[0] as Program;
			const bg = firstProg.image_slider?.big || firstProg.image_land?.big;
			if (bg) urls.push(bg);
			const progLogo = firstProg.image_logo?.normal || firstProg.image_logo?.default;
			if (progLogo) urls.push(progLogo);
		}
		return urls;
	}, [categories]);

	const imagesReady = useImagePreloader(criticalImages, !isLoading && categories.length > 0);

	// Actualiza la imagen de fondo cuando cambia el programa seleccionado
	useEffect(() => {
		if (!currentBgImage) return;

		setImages((prev) => {
			const lastImage = prev[prev.length - 1];
			if (lastImage && lastImage.src === currentBgImage) {
				return prev;
			}

			const lastLoaded = prev.filter((img) => img.loaded).slice(-1);
			const isAlreadyCached = prev.some(
				(img) => img.src === currentBgImage && img.loaded,
			);

			return [...lastLoaded, { src: currentBgImage, loaded: isAlreadyCached }];
		});
	}, [currentBgImage]);

	if (isLoading || !imagesReady) return <FullScreenSpinner />;

	return (
		<div className="relative min-h-screen | xs:max-md:pt-5">
			<div className="fixed top-0 left-0 w-full h-[50vh] z-20 bg-(--clr-primary) overflow-hidden">
				<div className="absolute inset-0 w-full h-full">
					{/* Imagen de fondo  */}
					<div className="relative w-full h-full">
						{images.map((img) => (
							<img
								key={img.src}
								src={img.src}
								alt=""
								onLoad={() => {
									setImages((prev) =>
										prev.map((i) =>
											i.src === img.src ? { ...i, loaded: true } : i,
										),
									);
								}}
								className={`absolute inset-0 w-full h-full object-cover transition-all duration-200 ease-in-out ${img.loaded ? "opacity-100" : "opacity-0"}`}
								style={{ backgroundColor: "var(--clr-primary)" }}
							/>
						))}
						<div className="absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-(--clr-primary) via-(--clr-primary)/40 to-transparent pointer-events-none"></div>
						<div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-(--clr-primary) via-(--clr-primary)/40 to-transparent pointer-events-none"></div>

						{/* Información del Programa  */}
						<div className="absolute inset-0 px-12 py-7 2xl:py-12 flex flex-col justify-end gap-5 z-10 pointer-events-none">
							{logo ? (
								<img
									src={logo}
									alt={activeProgram.title}
									className="h-30 w-auto mb-4 object-contain drop-shadow-2xl self-start"
								/>
							) : (
								<h1 className="text-2xl 2xl:text-5xl font-bold text-white mb-2 2xl:mb-4 drop-shadow-lg">
									{activeProgram?.title}
								</h1>
							)}

							{activeProgram?.description_short && (
								<p className="text-white/90 text-lg 2xl:text-2xl max-w-4xl drop-shadow-md mb-2 2xl:mb-5">
									{activeProgram.description_short}
								</p>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="relative z-10 mt-[50vh] pb-20 | xs:max-md:pb-5">
				{categories
					?.filter((category) => category.format === "default")
					.map((category) => (
						<div key={category.key}>
							<CarrouselContainer category={category} />
						</div>
					))}
			</div>
		</div>
	);
}

export default ProgramsView;
