import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface HlsBackgroundVideoProps {
  url: string;
  style?: React.CSSProperties;
}

/**
 * Componente para reproducir video HLS como fondo (sin audio, en bucle).
 * Forza la resolución más baja (level 0) para ahorrar ancho de banda en TVs (Regla 1 y 5).
 */
export const HlsBackgroundVideo = ({ url, style }: HlsBackgroundVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !url) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        autoStartLoad: true,
        startLevel: 0,
      });

      hls.loadSource(url);
      hls.attachMedia(videoElement);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (hls) {
          hls.currentLevel = 0;
        }
        videoElement.play().catch((err) => {
          console.warn("[HlsBackground] Autoplay prevented or failed:", err);
        });
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls?.recoverMediaError();
              break;
            default:
              hls?.destroy();
              break;
          }
        }
      });
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      // Soporte nativo (Safari / WebOS / Tizen)
      videoElement.src = url;
    }

    return () => {
      if (hls) {
        // Regla 4: Gestión Draconiana de la Memoria
        hls.destroy();
      }
    };
  }, [url]);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      style={{
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};
