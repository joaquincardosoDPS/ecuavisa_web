import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLiveData } from "@/hooks/useLiveData";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import EPGGrid from "./components/EPGGrid";
import LivePlayerSection from "./components/LivePlayerSection";
import LiveSignalInfo from "./components/LiveSignalInfo";

function LiveView() {
  const { epg, playlistPremium, isLoading } = useLiveData();
  const location = useLocation();

  // Leer señal: primero desde state (navigate), luego desde URL (acceso directo)
  const [selectedKeyLive, setSelectedKeyLive] = useState<string | null>(() => {
    const fromState = (location.state as { signal?: string })?.signal;
    if (fromState) return fromState;
    const params = new URLSearchParams(location.search);
    return params.get("signal");
  });

  // Expand state local
  const [expanded, setExpanded] = useState(false);

  // Inicializar con la primera señal si no hay selección
  useEffect(() => {
    if (playlistPremium.length > 0 && !selectedKeyLive) {
      const firstKey = playlistPremium[0].key_live || playlistPremium[0].key;
      setSelectedKeyLive(firstKey);
    }
  }, [playlistPremium, selectedKeyLive]);

  // Buscar la señal seleccionada en el array
  const selectedSignal =
    playlistPremium.find(
      (s) => s.key_live === selectedKeyLive || s.key === selectedKeyLive,
    ) ?? playlistPremium[0] ?? null;

  const handleSelectSignal = (keyLive: string) => {
    setSelectedKeyLive(keyLive);
  };

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  if (isLoading) return <FullScreenSpinner />;

  return (
    <div className="px-25 py-5 gap-5 flex flex-col h-[calc(100vh-84px)] | xs:max-md:px-7.5 xs:max-md:h-auto xs:max-md:gap-2.5">
      {/* Player + Info */}
      <div
        className={`flex gap-5 transition-all duration-500 ease-in-out | xs:max-md:flex-col ${expanded ? "h-full" : "h-1/2"
          } xs:max-md:h-auto`}
      >
        {/* Info de la señal - 40% (se oculta al expandir) */}
        {!expanded && (
          <div className="w-[40%]">
            <LiveSignalInfo signal={selectedSignal} epg={epg} />
          </div>
        )}
        {/* Player - 60% */}
        <div className="w-[60%] flex items-center justify-center | xs:max-md:w-full xs:max-md:h-auto">
          <LivePlayerSection
            signal={selectedSignal}
            isExpanded={expanded}
            onToggleExpand={toggleExpand}
          />
        </div>

      </div>

      {/* EPG - se oculta al expandir */}
      <div
        className={`overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden transition-all duration-500 ease-in-out ${expanded ? "h-0 opacity-0 overflow-hidden" : "h-1/2 opacity-100"
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

