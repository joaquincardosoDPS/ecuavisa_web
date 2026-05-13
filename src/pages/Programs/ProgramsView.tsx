import { useEffect, useState, useMemo } from "react";
import CarrouselContainer from "@/components/ProgramCard/CarrouselContainer";
import { useProgramsStore } from "@/features/programs/programsStore";
import type { Program } from "@/interfaces/catalog.interface";
import { useProgramsData } from "@/hooks/useProgramsData";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";


function ProgramsView() {
	const {
		categories,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useProgramsData();
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
		activeProgram?.image_slider?.medium || activeProgram?.image_background?.medium || activeProgram?.image_land?.medium || "";
	const [images, setImages] = useState<{ src: string; loaded: boolean }[]>(
		currentBgImage ? [{ src: currentBgImage, loaded: true }] : [],
	);

	const logo = activeProgram?.image_logo?.default || activeProgram?.image_logo?.default;

	// Preload initial above-the-fold images before revealing the view
	const criticalImages = useMemo(() => {
		if (!categories || categories.length === 0) return [];
		const urls: string[] = [];
		const firstCategory = categories.find(
			(c) => c.format === "default" && c.programs && c.programs.length > 0,
		);
		if (firstCategory) {
			const firstProg = firstCategory.programs[0] as Program;
			const bg = firstProg.image_slider?.medium || firstProg.image_land?.medium;
			if (bg) urls.push(bg);
			const progLogo = firstProg.image_logo?.default || firstProg.image_logo?.default;
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

			return [...lastLoaded, { src: currentBgImage, loaded: false }];
		});
	}, [currentBgImage]);

	// Infinite scroll observer (Scroll Listener version)
	useEffect(() => {
		const handleScroll = () => {
			if (isLoading || !hasNextPage || isFetchingNextPage) return;

			// Calculamos cuánto falta para el final
			const scrollHeight = document.documentElement.scrollHeight;
			const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			const clientHeight = document.documentElement.clientHeight;

			// Si faltan menos de 600px para el final, cargamos la siguiente página
			if (scrollTop + clientHeight >= scrollHeight - 600) {
				fetchNextPage();
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);

	if (isLoading || !imagesReady) return <FullScreenSpinner />;

	return (
		<>
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
								<h1 className="text-4xl  font-title font-bold text-white drop-shadow-2xl">
									{activeProgram?.title}
								</h1>
							)}
						</div>

						{activeProgram?.description_short && (
							<p className="text-lg font-text line-clamp-3 drop-shadow-md leading-8 h-[150px] max-w-4xl | xs:max-md:h-auto xs:max-md:leading-8 2xl:text-2xl">
								{activeProgram.description_short}
							</p>
						)}
					</div>
				</div>
			</div>

			<div className="relative z-10 pb-20 | xs:max-md:pb-5">
				{categories
					?.filter((category) => category.format === "default")
					.map((category) => (
						<div key={category.key}>
							<CarrouselContainer category={category} />
						</div>
					))}

				{/* Sentry for infinite scroll */}
				<div className="h-20 w-full flex items-center justify-center">
					{isFetchingNextPage && (
						<div className="w-8 h-8 border-4 border-(--foc-primary) border-t-transparent rounded-full animate-spin"></div>
					)}
				</div>
			</div>
		</>
	);
}

export default ProgramsView;
