import { useEffect, useRef, useCallback } from 'react';
import { historyService } from '@/services/historyService';

interface UseWatchHistoryOptions {
    /** Slug del capítulo actual (campo `vod` del EP) */
    vodSlug?: string;
    /** Tiempo actual de reproducción en segundos */
    currentTime: number;
    /** Duración total del video en segundos */
    duration: number;
    /** Si el video se está reproduciendo actualmente */
    isPlaying: boolean;
    /** Si es contenido en vivo (no se guarda historial) */
    isLive?: boolean;
    /** Si hay ads reproduciéndose (pausar tracking) */
    playingAds?: boolean;
    /** Token del usuario autenticado */
    token?: string;
    /** ID del perfil activo */
    profile?: string;
}

/**
 * Calcula el intervalo de guardado según la duración del video:
 * - 0s   < dur <= 180s  → cada 30s
 * - 180s < dur <  600s  → cada 45s
 * - 600s <= dur          → cada 60s
 */
function getSaveInterval(duration: number): number {
    if (duration <= 180) return 30;
    if (duration < 600) return 45;
    return 60;
}

/**
 * Hook que guarda periódicamente el progreso de reproducción
 * en el endpoint history/add para la funcionalidad "Seguir viendo".
 *
 * También guarda al pausar y al desmontar (con end=0),
 * y marca end=1 cuando el video llega al final.
 */
export function useWatchHistory({
    vodSlug,
    currentTime,
    duration,
    isPlaying,
    isLive = false,
    playingAds = false,
    token,
    profile,
}: UseWatchHistoryOptions) {
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const lastSavedTimeRef = useRef<number>(0);
    const currentTimeRef = useRef(currentTime);
    const durationRef = useRef(duration);

    // Mantener refs actualizados
    currentTimeRef.current = currentTime;
    durationRef.current = duration;

    const canSave = !!vodSlug && !!token && !!profile && !isLive;

    const saveProgress = useCallback(
        (end?: 0 | 1) => {
            if (!canSave || !vodSlug || !token || !profile) return;

            const time = currentTimeRef.current;
            // No guardar si el tiempo no avanzó significativamente (>2s)
            if (end === undefined && Math.abs(time - lastSavedTimeRef.current) < 2) return;

            lastSavedTimeRef.current = time;
            console.log(`[WatchHistory] Saving progress: vod=${vodSlug}, time=${Math.floor(time)}s${end !== undefined ? `, end=${end}` : ''}`);

            historyService.saveProgress({
                token,
                profile,
                vod: vodSlug,
                time,
                end,
            });
        },
        [canSave, vodSlug, token, profile],
    );

    // Intervalo periódico basado en la duración del video
    useEffect(() => {
        if (!canSave || !isPlaying || playingAds || duration <= 0) {
            // Limpiar intervalo si no se cumplen las condiciones
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        const intervalMs = getSaveInterval(duration) * 1000;
        console.log(`[WatchHistory] Starting periodic save every ${intervalMs / 1000}s (duration: ${Math.floor(duration)}s)`);

        intervalRef.current = setInterval(() => {
            saveProgress();
        }, intervalMs);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [canSave, isPlaying, playingAds, duration, saveProgress]);

    // Guardar al pausar
    useEffect(() => {
        if (!canSave || isLive) return;

        if (!isPlaying && currentTime > 0 && !playingAds) {
            saveProgress(0);
        }
    }, [isPlaying, canSave, isLive, currentTime, playingAds, saveProgress]);

    // Guardar al desmontar (cleanup del componente)
    useEffect(() => {
        if (!canSave) return;

        return () => {
            if (currentTimeRef.current > 0) {
                const isFinished = durationRef.current > 0 && (durationRef.current - currentTimeRef.current) < 5;
                historyService.saveProgress({
                    token: token!,
                    profile: profile!,
                    vod: vodSlug!,
                    time: currentTimeRef.current,
                    end: isFinished ? 1 : 0,
                });
            }
        };
    }, [canSave, vodSlug, token, profile]);

    // Retornar saveProgress para uso manual (e.g., marcar fin)
    return { saveProgress };
}
