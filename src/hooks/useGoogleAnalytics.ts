declare global {
  interface Window {
    dataLayer: IArguments[];
    gtag: (...args: unknown[]) => void;
  }
}

let gtagInitialized = false;
let measurementId = '';

window.dataLayer = window.dataLayer || [];
// eslint-disable-next-line prefer-rest-params
window.gtag = function () { window.dataLayer.push(arguments as unknown as IArguments); };

/**
 * Inyecta el script de gtag.js y configura GA4.
 * NO usa gtag('config') para evitar page_views automáticos.
 * Solo usamos gtag('js') + gtag('event') manual.
 */
export function initGtag(googleId: string): void {
  if (gtagInitialized || !googleId) return;
  gtagInitialized = true;
  measurementId = googleId;

  // Congelar history.pushState/replaceState para bloquear Enhanced Measurement
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
  };
  document.head.appendChild(script);

  // Solo inicializar el timestamp — SIN config para evitar page_view automático
  window.gtag('js', new Date());

  // Usar 'set' para establecer el measurement_id sin disparar page_view
  window.gtag('set', {
    'send_to': googleId,
  });
}

export function isGtagReady(): boolean {
  return gtagInitialized && !!measurementId;
}

export function getMeasurementId(): string {
  return measurementId;
}
