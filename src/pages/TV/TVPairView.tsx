import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/features/auth/authStore";
import { useConfigStore } from "@/features/config/useConfigStore";
import { devicePairService } from "@/services/devicePairService";
import { useIsMobile } from "@/hooks/useIsMobile";
import fallbackLogo from "@/assets/img/logo.svg";

type PairStatus = "idle" | "loading" | "success" | "error";

function TVPairView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const logo = useConfigStore((s) => s.config?.logo) || fallbackLogo;
  const token = useAuthStore((s) => s.token);
  const isMobile = useIsMobile();

  const [code, setCode] = useState("");
  const [status, setStatus] = useState<PairStatus>("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-rellenar código desde la URL (?code=XXXXXX)
  useEffect(() => {
    const urlCode = searchParams.get("code");
    if (urlCode) {
      setCode(urlCode);
    }
  }, [searchParams]);

  // Autofocus al montar
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setStatus("error");
      setMessage("Ingresa el código que aparece en tu TV.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await devicePairService.pair(token!, trimmed);

      if (response.status === "ok") {
        setStatus("success");
        setMessage(response.msj || "Dispositivo vinculado correctamente.");
        if (!isMobile) {
          setTimeout(() => {
            navigate("/home");
          }, 3000);
        }
      } else {
        setStatus("error");
        setMessage(response.msj || "No se pudo vincular el dispositivo.");
      }
    } catch {
      setStatus("error");
      setMessage("Error de conexión. Intenta de nuevo.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-(--clr-primary)">
      <div className="relative z-10 w-full max-w-md mx-4 backdrop-blur-2xl px-5 py-8 sm:px-10 sm:py-12">
        {/* Logo */}
        <div className="flex justify-center mb-6 sm:mb-10">
          <img
            src={logo}
            alt="Logo"
            className="h-16 sm:h-28 w-auto cursor-pointer"
            onClick={() => navigate("/home")}
          />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-title text-(--clr-primary-title,#fff) text-center mb-2">
          Vincular TV
        </h1>
        <p className="text-white/50 text-sm text-center mb-8">
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
          className="w-full text-center text-2xl font-mono tracking-[0.5em] outline-none transition-all duration-300 bg-[#102F40] rounded-md px-5 py-4 text-white placeholder:text-white/30 placeholder:tracking-normal placeholder:text-base placeholder:font-sans focus:border-(--foc-primary) focus:shadow-[0_0_0_3px_rgba(255,19,118,0.15)] border-2 border-white/10 disabled:opacity-50"
        />

        {/* Mensaje de estado */}
        {message && (
          <div
            className={`mt-4 text-sm text-center transition-all duration-300 ${
              status === "success"
                ? "text-green-400"
                : status === "error"
                  ? "text-red-400"
                  : "text-white/50"
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
          <p className="text-center text-sm mt-6 text-white/40">
            <span
              className="cursor-pointer hover:text-white/70 transition-colors duration-200"
              onClick={() => navigate("/home")}
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
