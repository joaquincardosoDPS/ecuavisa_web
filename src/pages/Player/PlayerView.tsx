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
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0 }}>
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
        style={{
          position: "fixed",
          transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: isShrunk ? 50 : 0,
          borderRadius: isShrunk ? "12px" : "0",
          overflow: "hidden",
          boxShadow: isShrunk ? "0 8px 32px rgba(0,0,0,0.6)" : "none",
          ...(isShrunk
            ? {
              bottom: "10rem",
              right: "5rem",
              width: "28vw",
              height: "16vw",
            }
            : {
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
            }),
          backgroundColor: "#000",
        }}
      >
        {isShrunk && (
          <div
            onClick={expandPlayer}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 55,
              cursor: "pointer",
              overflow: "hidden"
            }}
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
