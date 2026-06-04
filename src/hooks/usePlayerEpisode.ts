import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { catalogService } from "@/services/catalogService";
import { useAuthStore } from "@/features/auth/authStore";
import { historyService } from "@/services/historyService";
import type { Chapter } from "@/interfaces/catalog.interface";

/** Segundos antes de terminar en los que el player se achica */
const SHRINK_THRESHOLD_SECONDS = 30;

export function usePlayerEpisode() {
  const { program, segment, season, chapter } = useParams<{
    program: string;
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
  const [chapterImage, setChapterImage] = useState("");
  const [programKey, setProgramKey] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterNumber, setChapterNumber] = useState<number | null>(null);
  const [seasonNumber, setSeasonNumber] = useState<number | null>(null);
  const [initialSeconds, setInitialSeconds] = useState<number | undefined>(
    undefined,
  );
  const [nextChapter, setNextChapter] = useState<Chapter | null>(null);

  // Estado de minimización
  const [isShrunk, setIsShrunk] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(SHRINK_THRESHOLD_SECONDS);
  const isShrunkRef = useRef(false);
  const userExpandedRef = useRef(false);
  const autoPlayCancelledRef = useRef(false);
  const nextChapterRef = useRef<Chapter | null>(null);

  // Mantener ref sincronizado con el estado
  nextChapterRef.current = nextChapter;

  const handleTimeUpdate = (currentTime: number, duration: number) => {
    if (duration > 0) {
      const remaining = duration - currentTime;
      if (remaining > SHRINK_THRESHOLD_SECONDS && userExpandedRef.current) {
        userExpandedRef.current = false;
      }
      if (remaining <= SHRINK_THRESHOLD_SECONDS && remaining > 0 && !isShrunkRef.current && !userExpandedRef.current) {
        isShrunkRef.current = true;
        setIsShrunk(true);
      }
      // Update countdown when shrunk and next chapter exists
      if (isShrunkRef.current && nextChapterRef.current) {
        const secs = Math.max(0, Math.ceil(remaining));
        setRemainingSeconds(secs);

        // Auto-play next chapter when countdown ends
        if (secs <= 1 && !autoPlayCancelledRef.current && segment) {
          autoPlayCancelledRef.current = true;
          navigate(`/play/${program}/${segment}/${nextChapterRef.current.season}/${nextChapterRef.current.chapter}`);
        }
      }
    }
  };

  const expandPlayer = () => {
    setIsShrunk(false);
    isShrunkRef.current = false;
    userExpandedRef.current = true;
    autoPlayCancelledRef.current = true;
  };

  const playNext = () => {
    if (nextChapter && segment && program) {
      navigate(`/play/${program}/${segment}/${nextChapter.season}/${nextChapter.chapter}`);
    }
  };

  const goBack = () => {
    navigate(`/programas/${programKey}`);
  };

  const goToEpisodes = () => {
    if (programKey) {
      navigate(`/programas/${programKey}`);
    }
  };

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

        // Obtener detalle del programa para saber si es single_episode
        const programDetail = program
          ? (await catalogService.getProgramDetail(program))?.data
          : null;
        const isNoSegments = programDetail?.single_episode === true;

        // Cargar capítulo actual
        let chapterData: import("@/interfaces/catalog.interface").Chapter | undefined;

        if (isNoSegments) {
          // Programa single_episode: obtener capítulos sin segmento
          const response = await catalogService.getChapters({
            program: program!,
            no_segments: true,
          });
          chapterData = response?.data?.[0];
        } else {
          // Programa con segmentos: obtener capítulo específico
          const response = await catalogService.getChapterBySlug({
            program,
            segment,
            season: seasonNum,
            chapter: chapterNum,
          });
          chapterData = response?.data;
        }

        if (!chapterData?.key) {
          if (!cancelled) {
            navigate("/404", { replace: true });
          }
          return;
        }

        if (!cancelled) {
          setCurrentKey(chapterData.key);
          setEpisodeTitle(chapterData.name_program || chapterData.title || "");
          setProgramTitle(`T${chapterData.season}:E${chapterData.chapter}`);
          setVodSlug(chapterData.slug);
          setChapterImage(chapterData.image_land?.big || "");
          setProgramKey(chapterData.key_program || "");
          setChapterTitle(chapterData.title || "");
          setChapterNumber(chapterData.chapter ?? null);
          setSeasonNumber(chapterData.season ?? null);

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
              }
            } catch {
              // Timeline no disponible, iniciar desde el principio
            }
          }
          setInitialSeconds(resolvedInitialSeconds);

          // Intentar cargar el siguiente capítulo (solo si tiene segmentos y next-cap > 0)
          const nextCapNum = chapterData["next-cap"];
          if (!isNoSegments && nextCapNum > 0) {
            try {
              const nextRes = await catalogService.getChapterBySlug({
                program,
                segment,
                season: seasonNum,
                chapter: nextCapNum,
              });
              if (!cancelled && nextRes?.data?.key) {
                setNextChapter(nextRes.data);
              } else if (!cancelled) {
                setNextChapter(null);
              }
            } catch {
              if (!cancelled) setNextChapter(null);
            }
          } else {
            if (!cancelled) setNextChapter(null);
          }

          setLoading(false);
        }
      } catch {
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

  // Resetear estado al cambiar de episodio
  useEffect(() => {
    setIsShrunk(false);
    isShrunkRef.current = false;
    userExpandedRef.current = false;
    autoPlayCancelledRef.current = false;
    setNextChapter(null);
    setRemainingSeconds(SHRINK_THRESHOLD_SECONDS);
    setInitialSeconds(undefined);
  }, [segment, season, chapter]);


  // Prevenir scroll en la página del player
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  return {
    // Datos
    loading,
    error,
    currentKey,
    episodeTitle,
    programTitle,
    vodSlug,
    chapterImage,
    initialSeconds,
    nextChapter,
    segment,

    // Minimización
    isShrunk,
    remainingSeconds,
    expandPlayer,
    handleTimeUpdate,

    // Autenticación
    token,
    activeProfile,

    // Navegación
    playNext,
    goBack,
    goToEpisodes,
    programKey,
    chapterTitle,
    chapterNumber,
    seasonNumber,
  };
}
