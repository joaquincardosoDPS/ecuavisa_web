import { RudoPlayer } from "@/components/RudoPlayer";
import { usePlayerEpisode } from "@/hooks/usePlayerEpisode";
import { PlayerLoading } from "./components/PlayerLoading";
import { PlayerError } from "./components/PlayerError";
import { ShrunkBackdrop } from "./components/ShrunkBackdrop";

function PlayerView() {
  const {
    loading,
    error,
    currentKey,
    episodeTitle,
    programTitle,
    vodSlug,
    chapterImage,
    initialSeconds,
    nextChapter,
    isShrunk,
    remainingSeconds,
    expandPlayer,
    handleTimeUpdate,
    token,
    activeProfile,
    playNext,
    goBack,
    goToEpisodes,
  } = usePlayerEpisode();

  if (loading) {
    return <PlayerLoading chapterImage={chapterImage} />;
  }

  if (error || !currentKey) {
    return <PlayerError error={error} onBack={goBack} />;
  }

  return (
    <div className="fixed inset-0 overflow-hidden z-0">
      {isShrunk && chapterImage && (
        <ShrunkBackdrop
          chapterImage={chapterImage}
          nextChapter={nextChapter}
          programTitle={episodeTitle}
          remainingSeconds={remainingSeconds}
          onPlayNext={playNext}
          onGoToEpisodes={goToEpisodes}
        />
      )}

      <div
        className={
          isShrunk
            ? "fixed bottom-40 right-20 w-[28vw] aspect-video rounded-xl overflow-hidden z-50 shadow-[0_8px_32px_rgba(0,0,0,0.6)] bg-black transition-all duration-600 ease-in-out"
            : "fixed inset-0 w-screen h-screen overflow-hidden bg-black transition-all duration-600 ease-in-out"
        }
      >
        {isShrunk && (
          <div
            onClick={expandPlayer}
            className="absolute inset-0 z-55 cursor-pointer overflow-hidden"
          />
        )}

        <RudoPlayer
          rudoKey={currentKey}
          mode="vod"
          title={episodeTitle}
          description={programTitle}
          onBack={goBack}
          initialSeconds={initialSeconds}
          userToken={token || undefined}
          userProfile={activeProfile?.id || undefined}
          vodSlug={vodSlug}
          onTimeUpdate={handleTimeUpdate}
          hideOverlay={isShrunk}
        />
      </div>
    </div>
  );
}

export default PlayerView;
