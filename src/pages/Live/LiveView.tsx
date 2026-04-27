import { useState } from "react";
import { useLiveData } from "@/hooks/useLiveData";
import EPGGrid from "./components/EPGGrid";
import LivePlayerSection from "./components/LivePlayerSection";
import LiveSignalInfo from "./components/LiveSignalInfo";

function LiveView() {
	const { epg, playlistPremium } = useLiveData();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isExpanded, setIsExpanded] = useState(false);

	const selectedSignal = playlistPremium[selectedIndex] ?? null;

	return (
		<div className="px-25 py-5 gap-5 flex flex-col h-[calc(100vh-84px)] | xs:max-md:px-7.5 xs:max-md:h-auto xs:max-md:gap-2.5">
			{/* Player + Info */}
			<div
				className={`flex gap-5 transition-all duration-500 ease-in-out | xs:max-md:flex-col ${
					isExpanded ? "h-full" : "h-1/2"
				} xs:max-md:h-auto`}
			>
				{/* Player - 60% */}
				<div className="w-[60%] flex items-center justify-center | xs:max-md:w-full xs:max-md:h-auto">
					<LivePlayerSection
						signal={selectedSignal}
						isExpanded={isExpanded}
						onToggleExpand={() => setIsExpanded(!isExpanded)}
					/>
				</div>

				{/* Info de la señal - 40% (se oculta al expandir) */}
				{!isExpanded && (
					<div className="w-[40%]">
						<LiveSignalInfo signal={selectedSignal} epg={epg} />
					</div>
				)}
			</div>

			{/* EPG - se oculta al expandir */}
			<div
				className={`overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden transition-all duration-500 ease-in-out ${
					isExpanded ? "h-0 opacity-0 overflow-hidden" : "h-1/2 opacity-100"
				}`}
			>
				<EPGGrid
					epg={epg}
					signals={playlistPremium}
					selectedKeyLive={selectedSignal?.key_live}
					onSelectSignal={(keyLive) => {
						const idx = playlistPremium.findIndex(
							(s) => s.key_live === keyLive,
						);
						if (idx >= 0) setSelectedIndex(idx);
					}}
				/>
			</div>
		</div>
	);
}

export default LiveView;
