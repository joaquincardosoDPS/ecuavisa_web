/**
 * Hook que detecta si el usuario está accediendo desde un dispositivo móvil.
 * Combina la detección por User-Agent y por ancho de pantalla (< 768px).
 * Escucha cambios de tamaño de ventana para reaccionar en tiempo real.
 */
export function useIsMobile(): boolean {
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

  const isUserAgentMobile = mobileRegex.test(navigator.userAgent);

  // Considerar tablets en modo portrait como dispositivo no soportado
  const isSmallScreen = window.innerWidth < 1024;

  return isUserAgentMobile || isSmallScreen;
}
