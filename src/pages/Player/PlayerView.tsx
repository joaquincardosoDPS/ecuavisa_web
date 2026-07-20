import { useMemo, useEffect } from "react";
import { RudoPlayer } from "@/components/RudoPlayer";
import { usePlayerEpisode } from "@/hooks/player/usePlayerEpisode";
import { useDocumentTitle } from "@/hooks/shared/useDocumentTitle";
import { useAnalytics } from "@/layout/AnalyticsWrapper";
import { PlayerLoading } from "./components/PlayerLoading";
import { PlayerError } from "./components/PlayerError";
import { ShrunkBackdrop } from "./components/ShrunkBackdrop";

/** Convierte texto a slug (sin tildes, sin espacios, lowercase). */
function toSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

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
    programKey,
    segment,
    chapterTitle,
    chapterNumber,
    seasonNumber,
  } = usePlayerEpisode();

  useDocumentTitle(episodeTitle);

  const { trackPage } = useAnalytics();

  // Override del path para GA4: /programas/{programa}/{segmento}/{temporada}/{titulo-video}
  const analyticsPath = useMemo(() => {
    if (!programKey || !chapterTitle) return null;
    const parts = ['/programas', programKey];
    if (segment) parts.push(segment);
    if (seasonNumber != null) parts.push(String(seasonNumber));
    parts.push(toSlug(chapterTitle));
    return parts.join('/');
  }, [programKey, segment, seasonNumber, chapterTitle]);

  // Título descriptivo: "PROGRAMA | Segmento | Temporada X | Capítulo Y"
  const analyticsTitle = useMemo(() => {
    if (!episodeTitle) return null;
    const parts = [episodeTitle];
    if (segment) parts.push(segment.replace(/-/g, ' '));
    if (seasonNumber != null) parts.push(`Temporada ${seasonNumber}`);
    if (chapterNumber != null) parts.push(`Capitulo ${chapterNumber}`);
    return parts.join(' | ');
  }, [episodeTitle, segment, seasonNumber, chapterNumber]);

  useEffect(() => {
    if (analyticsPath && analyticsTitle) {
      trackPage(analyticsPath, analyticsTitle);
    }
  }, [analyticsPath, analyticsTitle, trackPage]);

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
