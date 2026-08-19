import { useEffect, useMemo, useRef } from "react";
import CarrouselContainer from "@/components/ProgramCard/CarrouselContainer";
import ProgramsBanner from "./components/ProgramsBanner";
import { useProgramsStore } from "@/features/programs/programsStore";
import type { Program } from "@/interfaces/catalog.interface";
import { useProgramsData } from "@/hooks/program/useProgramsData";
import { useImagePreloader } from "@/hooks/shared/useImagePreloader";
import { useDocumentTitle } from "@/hooks/shared/useDocumentTitle";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";

// Misma cadena de fallback que usa el banner para el fondo de un programa
function getBannerBg(program: Program): string {
	return program.image_slider?.big || program.image_background?.big || program.image_land?.big || "";
}

// Calienta la caché del navegador en segundo plano sin bloquear el render
function preloadImages(urls: string[]): void {
	urls.forEach((src) => {
		if (!src) return;
		const img = new Image();
		img.src = src;
	});
}


function ProgramsView() {
	useDocumentTitle('Programas');

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


	// Misma cadena de fallback que usa el banner para el fondo de un programa
	const criticalImages = useMemo(() => {
		if (!categories || categories.length === 0) return [];
		const urls: string[] = [];
		const firstCategory = categories.find(
			(c) => c.format === "default" && c.programs && c.programs.length > 0,
		);
		if (firstCategory) {
			const firstProg = firstCategory.programs[0] as Program;
			const bg = getBannerBg(firstProg);
			if (bg) urls.push(bg);
			const progLogo = firstProg.image_logo?.default;
			if (progLogo) urls.push(progLogo);
		}
		return urls;
	}, [categories]);

	const imagesReady = useImagePreloader(criticalImages, !isLoading && categories.length > 0);

	const sectionRef = useRef<HTMLDivElement | null>(null);
	const preloadedCarousels = useRef<Set<string>>(new Set());

	// Precarga los fondos de cada carrusel cuando se acerca al viewport,
	// para que el fade del banner arranque desde una imagen ya cacheada.
	// No bloquea el render: solo calienta la caché del navegador.
	useEffect(() => {
		if (isLoading) return;
		const section = sectionRef.current;
		if (!section) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					const key = entry.target.getAttribute("data-carousel-key");
					if (!key || preloadedCarousels.current.has(key)) return;
					preloadedCarousels.current.add(key);

					const category = categories.find((c) => c.key === key);
					if (!category) return;
					preloadImages((category.programs as Program[]).map(getBannerBg));
				});
			},
			{ rootMargin: "0px 0px 800px 0px" },
		);

		section
			.querySelectorAll("[data-carousel-key]")
			.forEach((el) => observer.observe(el));

		return () => observer.disconnect();
	}, [categories, isLoading]);
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
			<ProgramsBanner activeProgram={activeProgram} />

			<div ref={sectionRef} className="relative z-10 py-25 | xs:max-md:pb-5">
				{categories
					?.filter((category) => category.format === "default")
					.map((category) => (
						<div key={category.key} data-carousel-key={category.key}>
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
