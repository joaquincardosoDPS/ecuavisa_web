declare global {
  interface Window {
    dataLayer: IArguments[];
    gtag: (...args: unknown[]) => void;
  }
}

let gtagInitialized = false;
let measurementId = '';

try {
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function () { window.dataLayer.push(arguments as unknown as IArguments); };
} catch {
  // SSR o entorno sin window
}

/**
 * Inyecta el script de gtag.js y configura GA4.
 */
export function initGtag(googleId: string): void {
  if (gtagInitialized || !googleId) return;
  gtagInitialized = true;
  measurementId = googleId;

  try {
    // Intentar congelar history para bloquear Enhanced Measurement
    const origPush = history.pushState;
    const origReplace = history.replaceState;

    Object.defineProperty(history, 'pushState', {
      value: origPush,
      writable: false,
      configurable: true,
    });
    Object.defineProperty(history, 'replaceState', {
      value: origReplace,
      writable: false,
      configurable: true,
    });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleId}`;
    script.onload = () => {
      try {
        Object.defineProperty(history, 'pushState', {
          value: origPush,
          writable: true,
          configurable: true,
        });
        Object.defineProperty(history, 'replaceState', {
          value: origReplace,
          writable: true,
          configurable: true,
        });
      } catch {
        // Fallback silencioso
      }
    };
    document.head.appendChild(script);

    window.gtag('js', new Date());
    window.gtag('set', { 'send_to': googleId });
  } catch (e) {
    console.warn('[GA4] Error al inicializar:', e);
  }
}

export function isGtagReady(): boolean {
  return gtagInitialized && !!measurementId;
}

export function getMeasurementId(): string {
  return measurementId;
}
