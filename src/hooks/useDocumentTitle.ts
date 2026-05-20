import { useEffect } from 'react';
import { useConfigStore } from '@/features/config/useConfigStore';

/**
 * Actualiza `document.title` con el formato "Título | NombreApp".
 * Ya NO envía page_views — el AnalyticsProvider se encarga de eso.
 * Restaura el título base al desmontar el componente.
 */
export function useDocumentTitle(pageTitle: string | undefined | null): void {
  const appName = useConfigStore((s) => s.config?.name);

  useEffect(() => {
    if (!pageTitle) return;

    const fullTitle = appName ? `${pageTitle} | ${appName}` : pageTitle;
    document.title = fullTitle;

    return () => {
      if (appName) document.title = appName;
    };
  }, [pageTitle, appName]);
}
