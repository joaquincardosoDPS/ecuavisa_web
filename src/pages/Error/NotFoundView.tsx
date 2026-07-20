import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { catalogService } from "@/services/catalogService";
import Button from "@/components/ui/Button";

function NotFoundView() {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["recommended", "notfound"],
    queryFn: () => catalogService.getRecommendedPrograms({ limit: 3 }),
    staleTime: 1000 * 60 * 5,
  });

  const recommended = data?.data ?? [];

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-84px)] px-6 text-center"
      style={{
        background: "linear-gradient(to bottom, var(--clr-primary), var(--clr-secondary) 50%, var(--clr-primary))",
      }}
    >

      {/* Mensaje principal */}
      <h2
        className="text-2xl font-semibold mt-2"
        style={{ color: "var(--clr-primary-title)" }}
      >
        Lo sentimos,
      </h2>
      <h2
        className="text-2xl font-semibold mt-2"
        style={{ color: "var(--clr-primary-title)" }}
      >
        no encontramos el contenido que buscas.
      </h2>

      {/* Descripción */}
      <p
        className="text-base mt-3 max-w-md opacity-70"
        style={{ color: "var(--clr-primary-text)" }}
      >
        Te recomendamos volver al home o revisar algunos de estos programas que te podrían interesar.
      </p>

      {/* Botón volver al inicio */}
      <Button variant="secondary" onClick={() => navigate("/")} className="mt-8">
        Volver al home
      </Button>

      {/* Recomendados */}
      <div className="w-full max-w-4xl mt-16">
        <h3
          className="text-xl font-semibold mb-6"
          style={{ color: "var(--clr-primary-title)" }}
        >
          Te recomendamos
        </h3>
        <div className="flex flex-row gap-5 justify-center">
          {recommended.map((program) => (
            <div
              key={program.key}
              className="group relative overflow-hidden cursor-pointer rounded-lg transition-all duration-300
                         hover:ring-2 hover:ring-(--foc-primary) hover:shadow-[0_0_20px_rgba(255,19,118,0.3)]
                         w-60 aspect-video bg-(--clr-primary)"
              onClick={() => navigate(`/programas/${program.key}`)}
            >
              {program.image_land?.medium && (
                <img
                  src={program.image_land.medium}
                  alt={program.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotFoundView;