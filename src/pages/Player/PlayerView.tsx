import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { catalogService } from "@/services/catalogService";
import { Spinner } from "@/components/ui/Spinner";
import { RudoPlayer } from "@/components/RudoPlayer";
import { useAuthStore } from "@/features/auth/authStore";
import { historyService } from "@/services/historyService";

function PlayerView() {
  const { segment, season, chapter } = useParams<{
    segment: string;
    season: string;
    chapter: string;
  }>();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const activeProfile = useAuthStore((s) => s.activeProfile);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentKey, setCurrentKey] = useState("");
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [programTitle, setProgramTitle] = useState("");
  const [vodSlug, setVodSlug] = useState("");
  const [initialSeconds, setInitialSeconds] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    let cancelled = false;

    const loadEpisode = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!segment || !season || !chapter) {
          setError("Parámetros de ruta incompletos");
          setLoading(false);
          return;
        }

        const seasonNum = parseInt(season, 10);
        const chapterNum = parseInt(chapter, 10);

        // Cargar capítulo actual
        const response = await catalogService.getChapterBySlug(
          segment,
          seasonNum,
          chapterNum,
        );
        const chapterData = response?.data;

        if (!chapterData?.key) {
          if (!cancelled) {
            setError("Capítulo no encontrado o sin stream disponible");
            setLoading(false);
          }
          return;
        }

        if (!cancelled) {
          setCurrentKey(chapterData.key);
          setEpisodeTitle(chapterData.name_program || chapterData.title || "");
          setProgramTitle(`T${chapterData.season}:E${chapterData.chapter}`);
          setVodSlug(chapterData.slug);

          // Consultar progreso guardado del capítulo
          let resolvedInitialSeconds: number | undefined;
          if (token && activeProfile) {
            try {
              const timelineRes = await historyService.getTimeline(
                token,
                activeProfile.id,
                [chapterData.slug],
              );
              const timelineItem = timelineRes.data?.[0];
              if (
                timelineItem &&
                timelineItem.end === 0 &&
                timelineItem.time > 0
              ) {
                resolvedInitialSeconds = timelineItem.time;
                console.log(
                  "[PlayerView] ⏩ Resuming at",
                  timelineItem.time,
                  "s",
                );
              }
            } catch (err) {
              console.warn(
                "[PlayerView] Error fetching timeline, starting from 0:",
                err,
              );
            }
          }
          setInitialSeconds(resolvedInitialSeconds);
          setLoading(false);
        }
      } catch (err: unknown) {
        console.error("[PlayerView] Error cargando episodio:", err);
        if (!cancelled) {
          setError("Error al cargar el episodio");
          setLoading(false);
        }
      }
    };

    loadEpisode();

    return () => {
      cancelled = true;
    };
  }, [segment, season, chapter, token, activeProfile]);

  // Fullscreen loading
  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#000",
        }}
      >
        <Spinner />
      </div>
    );
  }

  // Error state
  if (error || !currentKey) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#000",
          color: "#fff",
          fontSize: "1.5rem",
          gap: "1rem",
        }}
      >
        <span>{error || "Contenido no disponible"}</span>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "0.75rem 2rem",
            border: "2px solid rgba(255,255,255,0.3)",
            borderRadius: "999px",
            background: "transparent",
            color: "#fff",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        backgroundColor: "#000",
      }}
    >
      <RudoPlayer
        rudoKey={currentKey}
        mode="vod"
        title={episodeTitle}
        description={programTitle}
        onBack={() => navigate(-1)}
        initialSeconds={initialSeconds}
        userToken={token || undefined}
        userProfile={activeProfile?.id || undefined}
        vodSlug={vodSlug}
      />
    </div>
  );
}

export default PlayerView;
