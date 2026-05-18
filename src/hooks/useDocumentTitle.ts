import { useEffect } from 'react';
import { useConfigStore } from '@/features/config/useConfigStore';
import { sendPageView } from '@/hooks/useGoogleAnalytics';

/**
 * Actualiza `document.title` con el formato "Título | NombreApp".
 * Envía un page_view a GA4 cuando el título está listo.
 * Restaura el título base al desmontar el componente.
 */
export function useDocumentTitle(pageTitle: string | undefined | null): void {
  const appName = useConfigStore((s) => s.config?.name);

  useEffect(() => {
    if (!pageTitle) return;

    const fullTitle = appName ? `${pageTitle} | ${appName}` : pageTitle;
    document.title = fullTitle;

    // Enviar page_view ahora que el título está listo
    sendPageView(window.location.pathname);

    return () => {
      if (appName) document.title = appName;
    };
  }, [pageTitle, appName]);
}
