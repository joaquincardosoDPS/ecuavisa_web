import type { Program } from "@/interfaces/catalog.interface";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";

interface BannerInfoProps {
	program: Program;
}

export function BannerInfo({ program }: BannerInfoProps) {
	const navigate = useNavigate();
	if (!program) return null;

	return (
		<div className="space-y-6 animate-in fade-in slide-in-from-left-10 duration-1000 flex flex-col justify-end">
			<div className="h-46 flex items-center | xs:max-sm:h-7.5">
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
				<Button variant="primary" showArrow onClick={() => navigate(`/programas/${program.key}`)}>
					Play
				</Button>
			</div>

			<p className="text-lg font-text line-clamp-3 drop-shadow-md leading-8 h-[150px] max-w-4xl | xs:max-md:h-auto xs:max-md:leading-8 2xl:text-2xl">
				{program.description_short}
			</p>
		</div>
	);
}
