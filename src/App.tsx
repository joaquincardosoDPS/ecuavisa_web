import { RouterProvider } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { appRouter } from "./router"
import { useAppInitialization } from "./hooks/shared/useAppInitilization";
import { useIsMobile } from "./hooks/shared/useIsMobile";
import { useConfigStore } from "./features/config/useConfigStore";
import { FullScreenSpinner } from "./components/ui/FullScreenSpinner";
import OnlyWebView from "./pages/Error/OnlyWebView";
import { redirectToStore } from "./utils/mobileDetect";
import fallbackLogo from "@/assets/img/logo.svg";

const REDIRECT_DELAY_MS = 800;

function App() {
  const isMobile = useIsMobile();
  const { isLoading, isError } = useAppInitialization();
  const config = useConfigStore((s) => s.config);
  const redirectAttempted = useRef(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redirigir automáticamente al store cuando se detecta móvil y el config está listo
  useEffect(() => {
    if (!isMobile || redirectAttempted.current || !config) return;

    const path = window.location.pathname;
    const isAllowed = path.includes('/tv') || path.includes('/auth/');
    if (isAllowed) return;

    redirectAttempted.current = true;
     
    setIsRedirecting(true);

    const timer = setTimeout(() => {
      const didRedirect = redirectToStore(config["android-link"], config["ios-link"]);
      // Si no se pudo redirigir (OS desconocido o sin URL), quitar el estado
      if (!didRedirect) setIsRedirecting(false);
    }, REDIRECT_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isMobile, config]);

  // Pantalla de transición mientras se redirige al store
  if (isRedirecting) {
    const logo = config?.logo || fallbackLogo;
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--clr-primary)] px-5">
        <img src={logo} alt="Logo" className="mb-8 h-16 w-auto animate-pulse" />
        <div className="mb-6">
          <svg
            className="animate-spin h-8 w-8 text-[var(--foc-primary)]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <p className="text-[var(--clr-primary-text)] text-lg font-medium animate-pulse">
          Redirigiendo al store…
        </p>
      </div>
    );
  }

  // Permitir rutas de vinculación TV y autenticación en móvil
  if (isMobile) {
    const path = window.location.pathname;
    const isAllowed = path.includes('/tv') || path.includes('/auth/');
    if (!isAllowed) return <OnlyWebView />;
  }

  if (isLoading) return <FullScreenSpinner />;
  if (isError) return <div>Error crítico al iniciar la aplicación.</div>;

  return (
    <RouterProvider router={appRouter} />
  )
}

export default App
