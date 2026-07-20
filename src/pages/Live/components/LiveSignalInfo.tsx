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
				<span className="text-(--clr-primary-title)/30">Sin información</span>
			</div>
		);
	}

	// // Imagen: preferir EPG, luego active_item_data, luego background_image
	// const image =
	// 	currentEvent?.pictures?.cover ||
	// 	currentEvent?.pictures?.background ||
	// 	currentEvent?.pictures?.photo ||
	// 	signal.active_item_data?.image ||
	// 	signal.background_image ||
	// 	signal.logo ||
	// 	null;

	const title = currentEvent?.title || signal.active_item_data?.title || signal.name_live || null;


	return (
		<div className="w-full h-full flex flex-col items-start justify-start gap-5 px-6 overflow-hidden | xs:max-md:pl-0">
			{/* Imagen del programa */}
			<div className="w-fit bg-(--foc-primary) text-(--clr-primary-title) px-2 py-1.5 rounded uppercase leading-none text-base font-bold flex items-center gap-1.5">
				<span className="w-3 h-3 bg-(--clr-primary-title) rounded-full shrink-0" />
				En vivo
			</div>
			<div className="flex-1 min-h-0 flex flex-col gap-4 items-start">
				{/* Título del programa */}
				{signal.name_live && (
					<p className="text-(--clr-primary-title) text-6xl font-bold leading-tight 2xl:text-5xl uppercase items-start">
						{signal.name_live}
					</p>
				)}

				<div>
					{title && (
						<h1 className="text-(--clr-primary-title) text-3xl font-bold leading-tight">
							{title}
						</h1>
					)}
					{/* Canal y horario */}

					{currentEvent && (
						<p className="text-(--clr-primary-title) text-2xl leading-tight font-normal">
							{new Date(currentEvent.beginTime).toLocaleDateString('es', { weekday: 'long' }).replace(/^./, c => c.toUpperCase())} | {new Date(currentEvent.beginTime).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })} a {new Date(currentEvent.endTime).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
						</p>
					)}

				</div>

			</div>

		</div>
	);
}

export default LiveSignalInfo;
