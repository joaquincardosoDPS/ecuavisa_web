import type { Category } from "@/interfaces/catalog.interface";
import CardCarrousel from "../../../components/ProgramCard/CardCarrousel";

interface CarrouselContainerProps {
	category: Category;
}

function CarrouselContainer({ category }: CarrouselContainerProps) {

	const bgImage = category.image_background_category?.default;
	const IconImage = category.image_logo_category?.medium;
	const hasBgImage = Boolean(bgImage && bgImage !== "");
	const hasIconImage = Boolean(IconImage && IconImage !== "");
	const format = category.format;

	const finalOrientation = format === "ranking"
		? "vertical"
		: (format === "event" && hasBgImage)
			? "horizontal"
			: category.image_orientation === "portrait"
				? "vertical"
				: "horizontal";

	if (category.programs.length === 0) return null;

	return (
		<div
			className={`pl-25 relative flex flex-col gap-5 mt-5 mb-5 | xs:max-md:pl-7.5 xs:max-md:pr-0 ${hasBgImage ? "py-8 px-8" : ""}`}
			style={{
				fontFamily: "var(--font-family-category)",
				...(bgImage
					? {
						backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%), url(${bgImage})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}
					: {}),
			}}
		>
			{(!hasIconImage || finalOrientation === "horizontal") && (
				<h2 className="relative z-10 text-2xl font-bold text-(--clr-primary-title) line-height-7">
					{category.title}
				</h2>
			)}

			{(hasIconImage && finalOrientation === "vertical") ? (
				<div className="relative z-10 flex flex-row items-center gap-8">
					<div className="shrink-0 flex items-center justify-center mx-20 gap-5 w-80">
						<img
							src={category.image_logo_category.medium}
							alt={`${category.title} logo`}
							className="w-6/10 h-auto object-contain drop-shadow-xl"
						/>
						<h2 className="w-4/10 relative z-10 text-2xl font-bold text-(--clr-primary-title) line-height-7">{category.title}</h2>
					</div>
					<div className="flex-1 min-w-0">
						<CardCarrousel
							programs={category.programs}
							orientation={finalOrientation}
							hasIconImage={hasIconImage}
							categorySlug={category.key}
							format={format}
						/>
					</div>
				</div>
			) : (
				<CardCarrousel
					programs={category.programs}
					orientation={finalOrientation}
					hasIconImage={hasIconImage}
					categorySlug={category.key}
					format={format}
				/>
			)}
		</div>
	)
}

export default CarrouselContainer;
