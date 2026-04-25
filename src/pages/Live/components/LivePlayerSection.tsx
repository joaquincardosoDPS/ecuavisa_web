import { VideoPlayer } from "@/components/VideoPlayer";
import type { LiveSignal } from "@/interfaces/catalog.interface";
import ExpandButton from "@/components/VideoPlayer/UI/ExpandButton";

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
  if (!signal) {
    return (
      <div className="h-full w-full rounded-xl bg-black/50 flex items-center justify-center">
        <span className="text-white/50">Sin señal disponible</span>
      </div>
    );
  }

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
        <VideoPlayer
          src={signal.m3u8}
          title={signal.name_live}
          isLive
          autoplay
          vastUrl={signal.vast || undefined}
          onBack={onToggleExpand}
        />
      </div>
    );
  }

  return (
    <div className="h-full w-auto aspect-video rounded-xl overflow-hidden relative group">
      <VideoPlayer
        src={signal.m3u8}
        title={signal.name_live}
        isLive
        hideUI
        autoplay
        vastUrl={signal.vast || undefined}
      />
      <ExpandButton isExpanded={false} onClick={onToggleExpand} />
    </div>
  );
}

export default LivePlayerSection;
