import type { Program } from "@/interfaces/catalog.interface";
import { useNavigate } from "react-router-dom";

interface BannerInfoProps {
	program: Program;
}

export function BannerInfo({ program }: BannerInfoProps) {
	const navigate = useNavigate();
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
				<button
					onClick={() => navigate(`/programas/${program.key}`)}
					className="bg-(--clr-primary-button) text-(--clr-text-primary-button)  px-10 py-4 rounded-md font-bold hover:bg-white hover:text-black transition-all flex items-center gap-3 group shadow-lg | xs:max-md:px-5 xs:max-md:py-3 cursor-pointer"
				>
					<svg width="24" height="24" viewBox="0 0 27 28" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-110">
						<path d="M25.8227 12.0936C27.2626 12.8396 27.2626 14.8991 25.8227 15.6452L2.9201 27.5118C1.58881 28.2016 -1.3492e-06 27.2354 -1.28366e-06 25.736L-2.46241e-07 2.00273C-1.80702e-07 0.503353 1.58881 -0.462842 2.9201 0.226944L25.8227 12.0936Z" />
					</svg>
					Play
				</button>
			</div>

			<p className="text-lg font-text line-clamp-3 drop-shadow-md leading-11 h-[150px] max-w-4xl | xs:max-md:h-auto xs:max-md:leading-8 2xl:text-2xl">
				{program.description_short}
			</p>
		</div>
	);
}
