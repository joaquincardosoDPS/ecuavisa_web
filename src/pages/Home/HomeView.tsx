import { useEffect, useRef } from "react";
import CardCarrousel from "@/components/ProgramCard/CardCarrousel";
import CarrouselContainerHome from "@/pages/Home/components/CarrouselContainerHome";
import ContinueWatchingCarousel from "@/pages/Home/components/ContinueWatchingCarousel";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import { useHomeData } from "@/hooks/home/useHomeData";
import { useDocumentTitle } from "@/hooks/shared/useDocumentTitle";
import Banner from "./components/Banner";
import { useAppInitialization } from "@/hooks/shared/useAppInitilization";
import HomeLiveGrid from "./components/HomeLiveGrid";

function HomeView() {
	useDocumentTitle('Inicio', {
		description: 'Mira tus programas favoritos en vivo y on demand en Ecuavisa. Series, reality shows, noticias y entretenimiento, todo gratis y sin suscripción.',
		canonical: 'https://www.ecuavisa.com/',
	});

	const {
		slider,
		categories,
		recommended,
		continueWatching,
		isLoading,
		isError,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useHomeData();

	const { data } = useAppInitialization()

	// Infinite scroll sentinel
	const sentinelRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const el = sentinelRef.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ rootMargin: '400px' }
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	if (isLoading) {
		return <FullScreenSpinner />;
	}

	if (isError || !slider) {
		return (
			<div className="flex items-center justify-center min-h-[50vh] text-(--clr-primary-title)">
				<p className="text-red-500 font-title text-xl">
					Error al cargar el catálogo.
				</p>
			</div>
		);
	}
	return (
		<div className="relative min-h-screen overflow-x-hidden">
			<Banner slider={slider} />

			<div className="relative z-20 flex flex-col pb-20 gap-5 | xs:max-md:pb-10 xs:max-md:gap-2.5">
				{/* Recomendados */}
				{/* {slider.length > 1 && (
					<div
						className="pl-48 flex flex-col gap-5 mt-5 mb-5 | xs:max-md:px-7.5"
						style={{ fontFamily: "var(--font-family-category)" }}
					>
						<h2 className="text-2xl font-bold text-(--clr-primary-title) line-height-7">
							{data?.data?.nombre_slider || "Destacados"}
						</h2>
						<CardCarrousel programs={slider.slice(1)} />
					</div>
				)} */}
				<HomeLiveGrid />
				{/* Seguir Viendo */}
				{continueWatching.length > 0 && (
					<ContinueWatchingCarousel items={continueWatching} />
				)}
				{/* Recomendados */}
				{recommended.length > 0 && (
					<div
						className="pl-48 flex flex-col gap-5 mt-5 mb-5 | xs:max-md:px-7.5"
						style={{ fontFamily: "var(--font-family-category)" }}
					>
						<h2 className="text-2xl font-bold text-(--clr-primary-title) line-height-7">
							{data?.data?.nombre_recomendados || "Recomendados para ti"}
						</h2>
						<CardCarrousel programs={recommended} />
					</div>
				)}

				{/* Listado de categorías */}
				{categories.map(
					(category) =>
						category.programs.length > 0 && (
							<CarrouselContainerHome key={category.key} category={category} />
						),
				)}

				{/* Sentinel para infinite scroll */}
				<div ref={sentinelRef} className="h-1" />
				{isFetchingNextPage && (
					<div className="flex justify-center py-8">
						<div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
					</div>
				)}
			</div>
		</div>
	);
}

export default HomeView;
