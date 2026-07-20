import { useNavigate } from "react-router-dom";
import { useTVPairing } from "@/hooks/tv/useTVPairing";

function TVPairView() {
  const navigate = useNavigate();
  const {
    code,
    setCode,
    status,
    message,
    handleSubmit,
    handleKeyDown,
    inputRef,
    logo,
    isMobile,
  } = useTVPairing();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-(--clr-primary)">
      <div className="relative z-10 w-full max-w-md mx-4 backdrop-blur-2xl px-5 py-8 sm:px-10 sm:py-12">
        {/* Logo */}
        <div className="flex justify-center mb-6 sm:mb-10">
          <img
            src={logo}
            alt="Logo"
            className="h-16 sm:h-28 w-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-title text-(--clr-primary-title,#fff) text-center mb-2">
          Vincular TV
        </h1>
        <p className="text-(--clr-primary-title)/50 text-sm text-center mb-8">
          Ingresa el código que aparece en la pantalla de tu televisor.
        </p>

        {/* Input de código */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Ej: A3B7X9"
          maxLength={10}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={status === "loading" || status === "success"}
          className="w-full text-center text-2xl font-mono tracking-[0.5em] outline-none transition-all duration-300 bg-(--clr-secondary) rounded-md px-5 py-4 text-(--clr-primary-title) placeholder:text-(--clr-primary-title)/30 placeholder:tracking-normal placeholder:text-base placeholder:font-sans focus:border-(--foc-primary) focus:shadow-[0_0_0_3px_rgba(255,19,118,0.15)] border-2 border-(--clr-primary-title)/10 disabled:opacity-50"
        />

        {/* Mensaje de estado */}
        {message && (
          <div
            className={`mt-4 text-sm text-center transition-all duration-300 ${
              status === "success"
                ? "text-green-400"
                : status === "error"
                  ? "text-red-400"
                  : "text-(--clr-primary-title)/50"
            }`}
          >
            {status === "success" && (
              <span className="inline-block mr-1.5 text-lg">✓</span>
            )}
            {status === "error" && (
              <span className="inline-block mr-1.5 text-lg">✕</span>
            )}
            {message}
          </div>
        )}

        {/* Botón */}
        <button
          onClick={handleSubmit}
          disabled={status === "loading" || status === "success"}
          className="w-full mt-6 py-3.5 text-base font-bold rounded-md transition-all duration-200 cursor-pointer bg-(--clr-secondary-button) text-(--clr-text-primary-button) border-none hover:brightness-115 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading"
            ? "Vinculando..."
            : status === "success"
              ? "¡Vinculado!"
              : "Vincular dispositivo"}
        </button>

        {/* Volver al inicio */}
        {!isMobile && (
          <p className="text-center text-sm mt-6 text-(--clr-primary-title)/40">
            <span
              className="cursor-pointer hover:text-(--clr-primary-title)/70 transition-colors duration-200"
              onClick={() => navigate("/")}
            >
              ← Volver al inicio
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default TVPairView;
