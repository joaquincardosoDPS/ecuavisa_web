import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { isGtagReady, getMeasurementId } from '@/hooks/shared/useGoogleAnalytics';

interface AnalyticsContextProps {
  trackPage: (path: string, title?: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextProps | undefined>(undefined);

/**
 * Provider centralizado de analytics. Un solo useEffect maneja el envío.
 * Componentes usan `trackPage(path, title)` para setear datos custom.
 */
function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [manualPath, setManualPath] = useState<string | null>(null);
  const [manualTitle, setManualTitle] = useState<string | null>(null);
  const lastTrackedRef = useRef<string | null>(null);

  // Resetear override cuando cambia la ruta
  useEffect(() => {
     
    setManualPath(null);
     
    setManualTitle(null);
  }, [location.pathname]);

  // Envío centralizado con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isGtagReady()) return;

      const finalPath = manualPath || location.pathname;

      // Si la ruta necesita override (play, programas/:slug) y aún no lo tiene, esperar
      if (!manualPath) {
        const needsOverride =
          location.pathname.startsWith('/play/') ||
          (location.pathname.startsWith('/programas/') && location.pathname.split('/').length > 2);
        if (needsOverride) return;
      }

      // Deduplicar
      if (lastTrackedRef.current === finalPath) return;
      lastTrackedRef.current = finalPath;

      const pageLocation = `${window.location.origin}${finalPath}`;
      const pageTitle = manualTitle || document.title;

      console.log(
        '%c[GA4 page_view]',
        'color: #4285F4; font-weight: bold;',
        { page_title: pageTitle, page_path: finalPath, page_location: pageLocation },
      );

      window.gtag('event', 'page_view', {
        page_path: finalPath,
        page_location: pageLocation,
        page_title: pageTitle,
        send_to: getMeasurementId(),
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname, manualPath, manualTitle]);

  const trackPage = useCallback((path: string, title?: string) => {
    setManualPath(path);
    setManualTitle(title || null);
  }, []);

  return (
    <AnalyticsContext.Provider value={{ trackPage }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

/**
 * Hook para acceder al tracker desde cualquier componente.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAnalytics(): AnalyticsContextProps {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics debe usarse dentro de un AnalyticsProvider');
  }
  return context;
}

/**
 * Layout raíz que envuelve todas las rutas con el AnalyticsProvider.
 */
export function AnalyticsWrapper() {
  return (
    <AnalyticsProvider>
      <Outlet />
    </AnalyticsProvider>
  );
}
