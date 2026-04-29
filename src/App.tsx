import { RouterProvider } from "react-router-dom"
import { appRouter } from "./router"
import { useAppInitialization } from "./hooks/useAppInitilization";
import { useIsMobile } from "./hooks/useIsMobile";
import { FullScreenSpinner } from "./components/ui/FullScreenSpinner";
import OnlyWebView from "./pages/Error/OnlyWebView";

function App() {
  const isMobile = useIsMobile();
  const { isLoading, isError } = useAppInitialization();

  // Bloquear acceso desde dispositivos móviles antes de cualquier otra lógica
  if (isMobile) return <OnlyWebView />;

  if (isLoading) return <FullScreenSpinner />;
  if (isError) return <div>Error crítico al iniciar la aplicación.</div>;

  return (
    <RouterProvider router={appRouter} />
  )
}

export default App
