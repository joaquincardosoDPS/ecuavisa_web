import PlayIcon from "@/assets/img/icons/play.svg";
import type { Program } from "@/interfaces/catalog.interface";

interface BannerInfoProps {
	program: Program;
}

export function BannerInfo({ program }: BannerInfoProps) {
	if (!program) return null;

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-left-10 duration-1000">
			<div className="h-34 flex items-center | xs:max-sm:h-7.5">
				{program.image_logo.medium ? (
					<img
						src={program.image_logo.medium}
						alt={program.title}
						className="w-auto h-full object-contain"
					/>
				) : (
					<h2 className="text-4xl  font-title font-bold text-white drop-shadow-2xl">
						{program.title}
					</h2>
				)}
			</div>

			<div className="flex items-center gap-4 pt-4">
				<button className="bg-white text-black px-10 py-4 rounded-md font-bold hover:bg-white/90 transition-all flex items-center gap-3 group shadow-lg | xs:max-md:px-5 xs:max-md:py-3">
					<img
						src={PlayIcon}
						alt="Play"
						className="w-6 h-6 transition-transform group-hover:scale-110"
					/>
					Play
				</button>
			</div>

			<p className="text-lg font-text line-clamp-3 drop-shadow-md leading-11 h-[150px] max-w-4xl | xs:max-md:h-auto xs:max-md:leading-8">
				{program.description_short}
			</p>
		</div>
	);
}
