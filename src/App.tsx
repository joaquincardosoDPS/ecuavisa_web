import { RouterProvider } from "react-router-dom"
import { appRouter } from "./router"
import { useAppInitialization } from "./hooks/useAppInitilization";
import { useIsMobile } from "./hooks/useIsMobile";
import { FullScreenSpinner } from "./components/ui/FullScreenSpinner";
import OnlyWebView from "./pages/Error/OnlyWebView";



function App() {
  const isMobile = useIsMobile();
  const { isLoading, isError } = useAppInitialization();
  

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


