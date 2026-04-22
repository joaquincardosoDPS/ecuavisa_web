import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { catalogService } from "@/services/catalogService";
import { adsService } from "@/services/adsService";
import { VideoPlayer } from "@/components/VideoPlayer/VideoPlayer";
import { Spinner } from "@/components/ui/Spinner";


function PlayerView() {
  const { segment, season, chapter } = useParams<{
    segment: string;
    season: string;
    chapter: string;
  }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [vastUrl, setVastUrl] = useState<string | undefined>(undefined);
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [programTitle, setProgramTitle] = useState("");
  const [currentKey, setCurrentKey] = useState("");

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

        const response = await catalogService.getChapterBySlug(
          segment,
          parseInt(season, 10),
          parseInt(chapter, 10),
        );
        const chapterData = response?.data;

        if (!chapterData?.m3u8) {
          if (!cancelled) {
            setError("Capítulo no encontrado o sin stream disponible");
            setLoading(false);
          }
          return;
        }

        let resolvedVastUrl: string | undefined;
        try {
          const vmapData = await adsService.getVodAds(chapterData.key);
          if (vmapData) {
            resolvedVastUrl = adsService.getPrerollVastUrl(vmapData);
            console.log('[PlayerView] VAST URL resuelta:', resolvedVastUrl ? 'encontrada' : 'sin preroll');
          }
        } catch (adsError) {
          console.warn('[PlayerView] Error obteniendo ads, continuando sin publicidad:', adsError);
        }

        if (!cancelled) {
          setVideoUrl(chapterData.m3u8);
          setVastUrl(resolvedVastUrl);
          setEpisodeTitle(chapterData.title);
          setProgramTitle(chapterData.name_program || "");
          setCurrentKey(chapterData.key);
          setLoading(false);
        }
      } catch (err: any) {
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
  }, [segment, season, chapter]);

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
  if (error || !videoUrl) {
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
      <VideoPlayer
        src={videoUrl}
        title={episodeTitle}
        description={programTitle}
        vastUrl={vastUrl}
        rudoKey={currentKey}
        onBack={() => navigate(-1)}
      />
    </div>
  );
}

export default PlayerView;