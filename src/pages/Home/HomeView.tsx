import CardCarrousel from "@/components/ProgramCard/CardCarrousel";
import CarrouselContainerHome from "@/pages/Home/components/CarrouselContainerHome";
import ContinueWatchingCarousel from "@/pages/Home/components/ContinueWatchingCarousel";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import { useHomeData } from "@/hooks/useHomeData";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import Banner from "./components/Banner";
import { useMemo } from "react";
import { useAppInitialization } from "@/hooks/useAppInitilization";

function HomeView() {
	const {
		slider,
		categories,
		recommended,
		continueWatching,
		isLoading,
		isError,
	} = useHomeData();

	const { data } = useAppInitialization()

	// Extract critical above-the-fold image URLs for preloading
	const criticalImages = useMemo(() => {
		if (!slider || slider.length === 0) return [];
		const urls: string[] = [];
		// Banner background (most important)
		const main = slider[0];
		const bannerSrc = main.image_slider.big || main.image_land.default;
		if (bannerSrc) urls.push(bannerSrc);
		// Banner logo
		if (main.image_logo?.medium) urls.push(main.image_logo.medium);
		// Featured cards (rest of slider)
		slider.slice(1, 5).forEach((p) => {
			const src = p.image_land?.medium || p.image_land?.default;
			if (src) urls.push(src);
		});
		return urls;
	}, [slider]);

	const imagesReady = useImagePreloader(criticalImages, !isLoading && slider.length > 0);

	if (isLoading || !imagesReady) {
		return <FullScreenSpinner />;
	}

	if (isError || !slider) {
		return (
			<div className="flex items-center justify-center min-h-[50vh] text-white">
				<p className="text-red-500 font-title text-xl">
					Error al cargar el catálogo.
				</p>
			</div>
		);
	}
	return (
		<div className="relative min-h-screen overflow-x-hidden">
			<Banner slider={slider} />

			<div className="flex flex-col pb-20 pt-10 gap-5 | xs:max-md:pb-10 xs:max-md:gap-2.5">
				{/* Recomendados */}
				{recommended.length > 0 && (
					<div
						className="px-20 flex flex-col gap-5 mt-5 mb-5 | xs:max-md:px-7.5"
						style={{ fontFamily: "var(--font-family-category)" }}
					>
						<h2 className="text-2xl font-bold text-white line-height-7">
							{data?.data?.nombre_recomendados || "Recomendados para ti"}
						</h2>
						<CardCarrousel programs={recommended} />
					</div>
				)}
				{/* Seguir Viendo */}
				{continueWatching.length > 0 && (
					<ContinueWatchingCarousel items={continueWatching} />
				)}

				{/* Listado de categorías */}

				{categories.map(
					(category) =>
						category.programs.length > 0 && (
							<CarrouselContainerHome key={category.key} category={category} />
						),
				)}

			</div>
		</div>
	);
}

export default HomeView;
