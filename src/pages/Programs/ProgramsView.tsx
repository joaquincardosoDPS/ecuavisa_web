import { useEffect, useMemo } from "react";
import CarrouselContainer from "@/components/ProgramCard/CarrouselContainer";
import ProgramsBanner from "./components/ProgramsBanner";
import { useProgramsStore } from "@/features/programs/programsStore";
import type { Program } from "@/interfaces/catalog.interface";
import { useProgramsData } from "@/hooks/program/useProgramsData";
import { useImagePreloader } from "@/hooks/shared/useImagePreloader";
import { useDocumentTitle } from "@/hooks/shared/useDocumentTitle";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";


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
			const progLogo = firstProg.image_logo?.default || firstProg.image_logo?.default;
			if (progLogo) urls.push(progLogo);
		}
		return urls;
	}, [categories]);

	const imagesReady = useImagePreloader(criticalImages, !isLoading && categories.length > 0);



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
			<ProgramsBanner activeProgram={activeProgram} />

			<div className="relative z-10 py-25 | xs:max-md:pb-5">
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
