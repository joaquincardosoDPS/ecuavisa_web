import { useRef, useCallback, useEffect } from "react";
import type { LiveSignal } from "@/interfaces/catalog.interface";
import ExpandButton from "@/components/ui/ExpandButton";
import { getStoredVolume } from "@/utils/volumeStorage";

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
    post({ event: "volumeon", value: getStoredVolume() });
  }, []);

  useEffect(() => {
    if (iframeRef.current) {
      handleIframeLoad();
    }
  }, [rudoKey, handleIframeLoad]);

  if (!signal || !rudoKey) {
    return (
      <div className="h-full w-full rounded-xl bg-black/50 flex items-center justify-center">
        <span className="text-(--clr-primary-title)/50">Sin señal disponible</span>
      </div>
    );
  }

  return (
    <div
      className={
        isExpanded
          ? "fixed inset-0 w-screen h-screen z-9999 bg-black"
          : "h-full w-auto aspect-video rounded-xl overflow-hidden relative group"
      }
    >
      <iframe
        key={rudoKey}
        ref={iframeRef}
        id="vrudo"
        src={`https://rudo.video/live/${rudoKey}?platform=ecuavisaweb`}
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
