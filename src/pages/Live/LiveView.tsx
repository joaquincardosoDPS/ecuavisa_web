import { useLiveSignal } from "@/hooks/live/useLiveSignal";
import { useDocumentTitle } from "@/hooks/shared/useDocumentTitle";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import EPGGrid from "./components/EPGGrid";
import LivePlayerSection from "./components/LivePlayerSection";
import LiveSignalInfo from "./components/LiveSignalInfo";
import bgLogin from "@/assets/img/bg_login.png";

function LiveView() {
  useDocumentTitle('En Vivo');

  const {
    selectedSignal,
    epg,
    playlistPremium,
    isLoading,
    expanded,
    handleSelectSignal,
    toggleExpand,
  } = useLiveSignal();

  if (isLoading) return <FullScreenSpinner />;

  return (
    <div
      className="pl-42 pt-38 gap-8 flex flex-col h-[calc(100vh)] overflow-hidden relative | xs:max-md:px-7.5 xs:max-md:h-auto xs:max-md:gap-2.5"
      style={{
        background: `url(${bgLogin}) top center / 100% auto no-repeat`,
      }}
    >
      {/* Player + Info */}
      <div
        className={`flex gap-5 transition-all duration-500 ease-in-out | xs:max-md:flex-col ${expanded ? "h-full" : "h-[55%]"
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

      {/* EPG */}
      <div
        className={`[scrollbar-width:none] [&::-webkit-scrollbar]:hidden transition-all duration-500 ease-in-out ${expanded ? "h-0 opacity-0 overflow-hidden" : "h-[45%] opacity-100"
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
