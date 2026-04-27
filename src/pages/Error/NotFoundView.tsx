import { useNavigate } from "react-router-dom";

function NotFoundView() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-84px)] px-6 text-center">
      {/* Código 404 grande */}
      <h1
        className="text-[8rem] font-black leading-none tracking-tighter"
        style={{ color: "var(--foc-primary)", opacity: 0.85 }}
      >
        404
      </h1>

      {/* Mensaje principal */}
      <h2
        className="text-2xl font-semibold mt-2"
        style={{ color: "var(--clr-primary-title)" }}
      >
        Página no encontrada
      </h2>

      {/* Descripción */}
      <p
        className="text-base mt-3 max-w-md opacity-70"
        style={{ color: "var(--clr-primary-text)" }}
      >
        Lo sentimos, la página que buscas no existe o fue movida.
      </p>

      {/* Botón volver al inicio */}
      <button
        onClick={() => navigate("/home")}
        className="mt-8 px-8 py-3 rounded-full text-sm font-semibold tracking-wide
                   transition-all duration-200 hover:scale-105 hover:brightness-110 cursor-pointer"
        style={{
          backgroundColor: "var(--clr-secondary-button)",
          color: "var(--clr-text-primary-button)",
        }}
      >
        Volver al inicio
      </button>
    </div>
  );
}

export default NotFoundView;