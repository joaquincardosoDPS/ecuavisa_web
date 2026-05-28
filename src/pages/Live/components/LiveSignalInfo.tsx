import { useMemo } from "react";
import type { EPGChannel, LiveSignal } from "@/interfaces/catalog.interface";

interface LiveSignalInfoProps {
	signal: LiveSignal | null;
	epg?: EPGChannel[];
}

function LiveSignalInfo({ signal, epg }: LiveSignalInfoProps) {

	// Buscar el programa actual en emisión desde el EPG
	const currentEvent = useMemo(() => {
		if (!signal || !epg) return null;
		const channel = epg.find(
			(ch) => ch.key_live === signal.key_live,
		);
		if (!channel) return null;

		const now = new Date();
		return (
			channel.events.find((ev) => {
				const begin = new Date(ev.beginTime);
				const end = new Date(ev.endTime);
				return begin <= now && end > now;
			}) ?? null
		);
	}, [signal, epg]);

	if (!signal) {
		return (
			<div className="w-full h-full flex items-center justify-center">
				<span className="text-white/30">Sin información</span>
			</div>
		);
	}

	// Imagen: preferir EPG, luego active_item_data, luego background_image
	const image =
		currentEvent?.pictures?.cover ||
		currentEvent?.pictures?.background ||
		currentEvent?.pictures?.photo ||
		signal.active_item_data?.image ||
		signal.background_image ||
		signal.logo ||
		null;

	const title = currentEvent?.title || signal.active_item_data?.title || signal.name_live || null;


	return (
		<div className="w-full h-full flex pt-8 flex-col items-center justify-between gap-5 px-6 overflow-hidden | xs:max-md:pl-0 text-center">
			{/* Imagen del programa */}
			<div className="self-start w-fit bg-[#FAE24B] text-(--clr-primary) px-2 py-1.5 rounded uppercase leading-none text-[10px] font-bold">
				En vivo ahora
			</div>
			<div className="flex-1 min-h-0 flex flex-col gap-5 items-center">
				{image && (
					<div className="flex-1 min-h-0 flex items-center justify-center">
						<img
							src={image}
							alt={title || "Programa actual"}
							className="h-37.5 w-auto object-contain rounded-lg "
						/>
					</div>
				)}
				{/* Título */}
				{title && (
					<h2 className="text-(--clr-primary-title) text-lg font-bold leading-tight  2xl:text-3xl">
						{title}
					</h2>
				)}

			</div>

		</div>
	);
}

export default LiveSignalInfo;
