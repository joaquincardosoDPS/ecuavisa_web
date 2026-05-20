import { useState, useEffect } from "react";

/**
 * Hook que detecta si el usuario está accediendo desde un dispositivo móvil o tablet.
 * Utiliza User-Agent y capacidades táctiles para evitar bloquear navegadores de escritorio reducidos.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isUserAgentMobile = mobileRegex.test(navigator.userAgent);

    // Los iPads en iOS 13+ se identifican como "Macintosh" por defecto, 
    // pero podemos detectarlos verificando si soportan toques (touch points).
    const isIPadOS =
      navigator.userAgent.includes("Mac") &&
      "maxTouchPoints" in navigator &&
      navigator.maxTouchPoints > 2;

    setIsMobile(isUserAgentMobile || isIPadOS);
  }, []);

  return isMobile;
}
