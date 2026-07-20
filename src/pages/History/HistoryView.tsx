import { useNavigate } from "react-router-dom";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import { useDocumentTitle } from "@/hooks/shared/useDocumentTitle";
import { useHistoryData } from "@/hooks/history/useHistoryData";
import Button from "@/components/ui/Button";
import type { HistoryItem } from "@/interfaces/history.interface";

/** Formatea duration_seg a "X h Y min" */
function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h} h ${m} min`;
  if (h > 0) return `${h} h`;
  return `${m} min`;
}

/** Calcula el porcentaje de progreso */
function getProgress(item: HistoryItem): number {
  if (item.duration_seg <= 0) return 0;
  return Math.min(100, (item.time / item.duration_seg) * 100);
}

/** Obtiene la mejor imagen landscape */
function getImage(item: HistoryItem): string {
  return item.image_land?.medium || item.image_land?.default || item.image || "";
}

function HistoryView() {
  useDocumentTitle("Seguir Viendo");

  const navigate = useNavigate();
  const { historyItems, isLoading, isError, error, isAuthenticated } =
    useHistoryData();

  return (
    <div className="pl-48 pt-30 min-h-[calc(100vh-84px)] | xs:max-md:px-7.5 xs:max-md:pt-7.5">
      <h1 className="text-3xl font-bold mb-8">Seguir Viendo</h1>

      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 | xs:max-md:pt-0 xs:max-md:gap-8.5">
          <p className="text-(--clr-primary-title)/60 text-lg">
            Inicia sesión para ver tu historial.
          </p>
          <Button variant="secondary" onClick={() => navigate("/auth/login")}>
            Iniciar sesión
          </Button>
        </div>
      ) : isLoading ? (
        <FullScreenSpinner />
      ) : isError ? (
        <p className="text-red-500 text-center py-20">
          {error instanceof Error
            ? error.message
            : "Error al cargar historial."}
        </p>
      ) : !historyItems || historyItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-(--clr-primary-title)/60 text-lg text-center">
            No tienes episodios pendientes por ver.
          </p>
          <Button variant="secondary" onClick={() => navigate("/")}>
            Explorar contenido
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {historyItems.map((item) => {
            const imgSrc = getImage(item);
            const progress = getProgress(item);
            const remaining = item.duration_seg - item.time;
            const remainingText =
              remaining > 0 ? `${formatDuration(remaining)} restantes` : "";

            return (
              <div
                key={item.slug}
                tabIndex={0}
                onClick={() =>
                  navigate(
                    `/play/${item.key_program}/${item.key_segment}/${item.season}/${item.chapter}`,
                    { state: { resumeTime: item.time } }
                  )
                }
                className="cursor-pointer group"
              >
                {/* Thumbnail con barra de progreso */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-(--clr-secondary,#054668) transition-all duration-200 group-hover:ring-2 group-hover:ring-(--foc-primary,#ff1376) group-hover:scale-[1.02]">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      draggable={false}
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-(--clr-primary-title)/40 text-sm">
                        {item.title}
                      </span>
                    </div>
                  )}

                  {/* Icono play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-12 h-12 rounded-full bg-(--clr-primary)/60 backdrop-blur-sm flex items-center justify-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <polygon points="6,3 20,12 6,21" />
                      </svg>
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  <div className="absolute bottom-0 left-0 right-0 h-[5px] bg-white/20">
                    <div
                      className="h-full bg-(--foc-primary,#FF0069) transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Info debajo */}
                <div className="mt-2 px-0.5">
                  <p className="text-(--clr-primary-title) text-sm font-semibold tracking-wider line-clamp-1">
                    {item.name_program}
                  </p>
                  <p className="text-(--clr-primary-title) text-base uppercase font-bold line-clamp-1 mt-0.5">
                    {item.title}
                  </p>
                  {remainingText && (
                    <p className="text-(--clr-primary-title)/50 text-sm mt-0.5">
                      {remainingText}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HistoryView;
