import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { catalogService } from "@/services/catalogService";
import { adsService } from "@/services/adsService";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Spinner } from "@/components/ui/Spinner";
import type {
  Chapter,
  ProgramDetailResponse,
} from "@/interfaces/catalog.interface";

function PlayerView() {
  const { segment, season, chapter } = useParams<{
    segment: string;
    season: string;
    chapter: string;
  }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [vastUrl, setVastUrl] = useState<string | undefined>(undefined);
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [programTitle, setProgramTitle] = useState("");
  const [currentKey, setCurrentKey] = useState("");

  // Episodios para el VideoPlayer (actual + siguiente)
  const [episodes, setEpisodes] = useState<Chapter[]>([]);
  const [programSlug, setProgramSlug] = useState("");

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
        console.log("chapterData", chapterData);

        if (!chapterData?.m3u8) {
          if (!cancelled) {
            setError("Capítulo no encontrado o sin stream disponible");
            setLoading(false);
          }
          return;
        }

        // Intentar cargar siguiente capítulo
        let nextChapterData: Chapter | null = null;
        try {
          const nextResponse = await catalogService.getChapterBySlug(
            segment,
            seasonNum,
            chapterNum + 1,
          );
          if (nextResponse?.data?.m3u8) {
            nextChapterData = nextResponse.data;
          }
        } catch {
          // No hay siguiente capítulo, no es un error
          console.log("[PlayerView] No hay siguiente capítulo disponible");
        }

        // Resolver ads
        let resolvedVastUrl: string | undefined;
        try {
          const vmapData = await adsService.getVodAds(chapterData.key);
          if (vmapData) {
            resolvedVastUrl = adsService.getPrerollVastUrl(vmapData);
            console.log(
              "[PlayerView] VAST URL resuelta:",
              resolvedVastUrl ? "encontrada" : "sin preroll",
            );
          }
        } catch (adsError) {
          console.warn(
            "[PlayerView] Error obteniendo ads, continuando sin publicidad:",
            adsError,
          );
        }

        if (!cancelled) {
          setVideoUrl(chapterData.m3u8);
          setVastUrl(resolvedVastUrl);
          setEpisodeTitle(chapterData.name_program);
          setProgramTitle(`T${chapterData.season}:E${chapterData.chapter}`);
          setCurrentKey(chapterData.key);
          setProgramSlug(chapterData.slug);

          // Construir lista de episodios para VideoPlayer
          const episodeList: Chapter[] = [chapterData];
          if (nextChapterData) {
            episodeList.push(nextChapterData);
            console.log('[PlayerView] ✅ Siguiente episodio encontrado:', nextChapterData.title, 'key:', nextChapterData.key);
          } else {
            console.log('[PlayerView] ❌ No hay siguiente episodio');
          }
          console.log('[PlayerView] Episodes list:', episodeList.map(e => ({ key: e.key, title: e.title })));
          setEpisodes(episodeList);

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

  // Cuando el VideoPlayer selecciona el siguiente episodio, navegar a su ruta
  const handleEpisodeSelect = useCallback(
    (ep: Chapter) => {
      navigate(`/play/${ep.key_segment}/${ep.season}/${ep.chapter}`, {
        replace: true,
      });
    },
    [navigate],
  );

  // Leer imagen de fondo del programa desde el cache de TanStack Query
  const programBackgroundImage = useMemo(() => {
    if (!programSlug) return undefined;
    const cached = queryClient.getQueryData<ProgramDetailResponse>([
      "programDetail",
      programSlug,
    ]);
    if (!cached?.data) return undefined;
    const program = cached.data;
    return (
      program.image_slider?.big ||
      program.image_background?.big ||
      program.image_land?.big
    );
  }, [programSlug, queryClient]);

  console.log("programBackgroundImage", programBackgroundImage);

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
        episodes={episodes}
        currentEpisodeKey={currentKey}
        onEpisodeSelect={handleEpisodeSelect}
        programBackgroundImage={programBackgroundImage}
        onBack={() => navigate(-1)}
      />
    </div>
  );
}

export default PlayerView;
