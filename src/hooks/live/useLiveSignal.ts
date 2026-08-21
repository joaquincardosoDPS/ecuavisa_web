import { useEffect, useRef, useState } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { useLiveData } from "@/hooks/live/useLiveData";
import type { LiveSignal, EPGChannel } from "@/interfaces/catalog.interface";

export interface UseLiveSignalReturn {
  selectedSignal: LiveSignal | null;
  epg: EPGChannel[];
  playlistPremium: LiveSignal[];
  isLoading: boolean;
  expanded: boolean;
  handleSelectSignal: (keyLive: string) => void;
  toggleExpand: () => void;
  resolvedKeyLive: string | null;
}

export function useLiveSignal(): UseLiveSignalReturn {
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
  const [expanded, setExpanded] = useState(() => {
    return searchParams.get("expanded") === "true";
  });

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

  return {
    selectedSignal,
    epg,
    playlistPremium,
    isLoading,
    expanded,
    handleSelectSignal,
    toggleExpand,
    resolvedKeyLive,
  };
}
