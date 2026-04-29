import { useRef, useCallback, useEffect } from "react";
import type { LiveSignal } from "@/interfaces/catalog.interface";
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

  const rudoKey = signal?.key_live || signal?.key || null;

  const handleIframeLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    const post = (payload: Record<string, unknown>) =>
      iframe.contentWindow!.postMessage({ message: payload }, "*");

    post({ event: "play" });
    post({ event: "volumeon", value: 1 });
  }, []);

  useEffect(() => {
    if (iframeRef.current) {
      handleIframeLoad();
    }
  }, [rudoKey, handleIframeLoad]);

  if (!signal || !rudoKey) {
    return (
      <div className="h-full w-full rounded-xl bg-black/50 flex items-center justify-center">
        <span className="text-white/50">Sin señal disponible</span>
      </div>
    );
  }

  return (
    <div
      style={
        isExpanded
          ? {
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 9999,
              backgroundColor: "#000",
            }
          : {}
      }
      className={isExpanded ? "" : "h-full w-auto aspect-video rounded-xl overflow-hidden relative group"}
    >
      <iframe
        key={rudoKey}
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
      <ExpandButton isExpanded={isExpanded} onClick={onToggleExpand} />
    </div>
  );
}

export default LivePlayerSection;
