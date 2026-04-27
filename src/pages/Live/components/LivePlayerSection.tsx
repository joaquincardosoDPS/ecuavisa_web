import { useRef, useCallback } from "react";
import type { LiveSignal } from "@/interfaces/catalog.interface";
import { RudoPlayer } from "@/components/RudoPlayer";
import ExpandButton from "@/components/ui/ExpandButton";

interface LivePlayerSectionProps {
  signal: LiveSignal | null;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function LivePlayerSection({
  signal,
  isExpanded,
  onToggleExpand,
}: LivePlayerSectionProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Enviar play + volumeon al iframe cuando carga (fix: cambio de señal quedaba muteado)
  const handleIframeLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    const post = (payload: Record<string, unknown>) =>
      iframe.contentWindow!.postMessage({ message: payload }, "*");

    post({ event: "play" });
    post({ event: "volumeon", value: 1 });
  }, []);

  if (!signal) {
    return (
      <div className="h-full w-full rounded-xl bg-black/50 flex items-center justify-center">
        <span className="text-white/50">Sin señal disponible</span>
      </div>
    );
  }

  const rudoKey = signal.key_live || signal.key;

  if (isExpanded) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9999,
          backgroundColor: "#000",
        }}
      >
        <RudoPlayer
          rudoKey={rudoKey}
          mode="live"
          title={signal.name_live || "Canal en vivo"}
          onBack={onToggleExpand}
        />
        <ExpandButton isExpanded onClick={onToggleExpand} />
      </div>
    );
  }

  return (
    <div className="h-full w-auto aspect-video rounded-xl overflow-hidden relative group">
      <iframe
        ref={iframeRef}
        id="vrudo"
        src={`https://rudo.video/live/${rudoKey}`}
        width="100%"
        height="100%"
        title={signal.name_live || "Canal en vivo"}
        allow="autoplay; fullscreen"
        onLoad={handleIframeLoad}
        style={{ border: "none", overflow: "hidden" }}
      />
      <ExpandButton isExpanded={false} onClick={onToggleExpand} />
    </div>
  );
}

export default LivePlayerSection;
