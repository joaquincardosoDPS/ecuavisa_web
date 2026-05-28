import { useEffect, useRef, useState } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useLiveData } from "@/hooks/useLiveData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import EPGGrid from "./components/EPGGrid";
import LivePlayerSection from "./components/LivePlayerSection";
import LiveSignalInfo from "./components/LiveSignalInfo";

function LiveView() {
  useDocumentTitle('En Vivo');

  const { epg, playlistPremium, isLoading } = useLiveData();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Leer señal: primero desde state (navigate interno), luego desde URL (acceso directo)
  const [selectedKeyLive, setSelectedKeyLive] = useState<string | null>(() => {
    const fromState = (location.state as { signal?: string })?.signal;
    if (fromState) return fromState;
    return searchParams.get("signal");
  });

  // Expand state local
  const [expanded, setExpanded] = useState(false);

  // Si llegamos por location.state, migrarlo al query param y limpiar el state
  // para evitar que al volver atrás quede un state "fantasma".
  const didMigrateState = useRef(false);
  useEffect(() => {
    if (didMigrateState.current) return;
    const fromState = (location.state as { signal?: string })?.signal;
    if (fromState) {
      didMigrateState.current = true;
      navigate(
        { pathname: location.pathname, search: `?signal=${fromState}` },
        { replace: true, state: null },
      );
    }
  }, [location.state, location.pathname, navigate]);

  // Determinar la señal efectiva: si la seleccionada no existe en el playlist,
  // usar la primera señal disponible (sin setState, evita render cascada).
  const resolvedKeyLive = (() => {
    if (playlistPremium.length === 0) return selectedKeyLive;

    const exists = selectedKeyLive && playlistPremium.some(
      (s) => s.key_live === selectedKeyLive || s.key === selectedKeyLive,
    );

    if (exists) return selectedKeyLive;
    return playlistPremium[0].key_live || playlistPremium[0].key;
  })();

  // Sincronizar el query param ?signal= cada vez que cambie la señal resuelta
  useEffect(() => {
    if (!resolvedKeyLive) return;

    const current = searchParams.get("signal");
    if (current !== resolvedKeyLive) {
      setSearchParams({ signal: resolvedKeyLive }, { replace: true });
    }
  }, [resolvedKeyLive, searchParams, setSearchParams]);

  // Buscar la señal seleccionada en el array
  const selectedSignal =
    playlistPremium.find(
      (s) => s.key_live === resolvedKeyLive || s.key === resolvedKeyLive,
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
