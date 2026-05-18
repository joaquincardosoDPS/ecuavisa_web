import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let gtagInitialized = false;

/** Override de path para vistas cuya URL no coincide con el path deseado en GA4. */
let analyticsPathOverride: string | null = null;

/** Último path enviado a GA4 (deduplicación). */
let lastSentPath = '';

/** Timer del debounce para coalescer llamadas rápidas. */
let dispatchTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Inyecta el script de gtag.js y configura GA4 con `send_page_view: false`.
 * Se ejecuta una sola vez por sesión.
 */
export function initGtag(googleId: string): void {
  if (gtagInitialized || !googleId) return;
  gtagInitialized = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${googleId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', googleId, { send_page_view: false });
}

/**
 * Sobrescribe el path que se envía a GA4 en lugar del `pathname` real.
 * Se limpia automáticamente al desmontar el componente.
 */
export function useAnalyticsPath(customPath: string | undefined | null): void {
  useEffect(() => {
    analyticsPathOverride = customPath || null;
    return () => {
      analyticsPathOverride = null;
    };
  }, [customPath]);
}

/**
 * Agenda un page_view con debounce de 300ms.
 * Lee el override de path y document.title al momento de disparar.
 */
function schedulePageView(fallbackPath: string): void {
  if (dispatchTimer) clearTimeout(dispatchTimer);

  dispatchTimer = setTimeout(() => {
    dispatchTimer = null;

    const path = analyticsPathOverride || fallbackPath;
    if (path === lastSentPath) return;
    lastSentPath = path;

    const payload = {
      title: document.title,
      path,
      device_type: 'desktop',
    };

    console.log(
      '%c[GA4 page_view]',
      'color: #4285F4; font-weight: bold;',
      payload,
    );

    if (gtagInitialized) {
      window.gtag('event', 'page_view', payload);
    }
  }, 300);
}

/**
 * Envía un page_view a GA4. Usa el override si existe.
 * Llamado desde useDocumentTitle y desde vistas con cambios
 * de estado que no generan cambio de URL (ej. cambio de segmento).
 */
export function sendPageView(fallbackPath: string): void {
  if (!fallbackPath) return;
  schedulePageView(fallbackPath);
}
