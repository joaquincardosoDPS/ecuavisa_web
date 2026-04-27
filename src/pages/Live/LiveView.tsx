import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLiveData } from "@/hooks/useLiveData";
import LivePlayerSection from "./components/LivePlayerSection";
import LiveSignalInfo from "./components/LiveSignalInfo";
import EPGGrid from "./components/EPGGrid";

function LiveView() {
  const { epg, playlistPremium } = useLiveData();
  const [searchParams, setSearchParams] = useSearchParams();

  // Leer ?signal= del URL
  const signalParam = searchParams.get("signal");

  // Buscar índice por key_live; si no hay coincidencia, usar la primera señal
  const selectedIndex =
    signalParam && playlistPremium.length > 0
      ? Math.max(
          0,
          playlistPremium.findIndex(
            (s) => s.key_live === signalParam || s.key === signalParam,
          ),
        )
      : 0;

  const selectedSignal = playlistPremium[selectedIndex] ?? null;

  // Si no hay param en la URL pero hay señales, setear la primera
  useEffect(() => {
    if (playlistPremium.length > 0 && !signalParam) {
      const firstKey = playlistPremium[0].key_live || playlistPremium[0].key;
      setSearchParams({ signal: firstKey }, { replace: true });
    }
  }, [playlistPremium, signalParam, setSearchParams]);

  // Cuando se selecciona una señal, actualizar el param
  const handleSelectSignal = (keyLive: string) => {
    setSearchParams({ signal: keyLive }, { replace: true });
  };

  // Expand state (no depende de URL)
  const expanded = searchParams.get("expanded") === "true";
  const toggleExpand = () => {
    const params = new URLSearchParams(searchParams);
    if (expanded) {
      params.delete("expanded");
    } else {
      params.set("expanded", "true");
    }
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="px-25 py-5 gap-5 flex flex-col h-[calc(100vh-84px)]">
      {/* Player + Info */}
      <div
        className={`flex gap-5 transition-all duration-500 ease-in-out ${
          expanded ? "h-full" : "h-1/2"
        }`}
      >
        {/* Player - 60% */}
        <div className="w-[60%] flex items-center justify-center">
          <LivePlayerSection
            signal={selectedSignal}
            isExpanded={expanded}
            onToggleExpand={toggleExpand}
          />
        </div>

        {/* Info de la señal - 40% (se oculta al expandir) */}
        {!expanded && (
          <div className="w-[40%]">
            <LiveSignalInfo signal={selectedSignal} epg={epg} />
          </div>
        )}
      </div>

      {/* EPG - se oculta al expandir */}
      <div
        className={`overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden transition-all duration-500 ease-in-out ${
          expanded ? "h-0 opacity-0 overflow-hidden" : "h-1/2 opacity-100"
        }`}
      >
        <EPGGrid
          epg={epg}
          signals={playlistPremium}
          selectedKeyLive={selectedSignal?.key_live}
          onSelectSignal={handleSelectSignal}
        />
      </div>
    </div>
  );
}

export default LiveView;
