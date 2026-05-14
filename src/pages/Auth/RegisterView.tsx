import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/features/auth/authStore";
import RegisterComplete from "./components/RegisterComplete";
import { useConfigStore } from "@/features/config/useConfigStore";
import fallbackLogo from "@/assets/img/logo.svg";
import iconoOculto from "@/assets/img/icons/iconos-oculto.svg";
import iconoVisible from "@/assets/img/icons/iconos-visible.svg";

type Direction = "next" | "prev";

const STEPS = [
  {
    id: "name",
    label: "Ingresa tu nombre",
    placeholder: "Tu nombre",
    type: "text",
  },
  {
    id: "email",
    label: "Ingresa tu correo electrónico",
    placeholder: "correo@ejemplo.com",
    type: "email",
  },
  {
    id: "password",
    label: "Crea una contraseña",
    placeholder: "Password",
    type: "password",
  },
] as const;

function RegisterView() {
  const navigate = useNavigate();
  const logo = useConfigStore((s) => s.config?.logo) || fallbackLogo;
  const termsUrl = useConfigStore((s) => s.config?.["terminos-condiciones"]) || "#";
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<Direction>("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Autofocus en el input del paso actual
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[step]?.focus();
    }, 400);
    return () => clearTimeout(timer);
  }, [step]);

  const validate = (currentStep: number): boolean => {
    const field = STEPS[currentStep].id;
    let error = "";

    if (field === "name" && formData.name.trim().length < 2) {
      error = "El nombre debe tener al menos 2 caracteres";
    } else if (
      field === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      error = "Ingresa un email válido";
    } else if (field === "password" && formData.password.length < 8) {
      error = "La contraseña debe tener al menos 8 caracteres";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const goNext = () => {
    if (isAnimating) return;
    if (!validate(step)) return;

    if (step < STEPS.length - 1) {
      setDirection("next");
      setIsAnimating(true);
      setTimeout(() => {
        setStep((s) => s + 1);
        setIsAnimating(false);
      }, 350);
    } else {
      if (!acceptTerms) {
        setSubmitError("Debes aceptar los términos y condiciones");
        return;
      }
      handleSubmit();
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const handleSubmit = async () => {
    if (!validate(step)) return;
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === "error") {
        setSubmitError(response.msj || "Error al crear la cuenta.");
        return;
      }

      // console.log("[Register] Success:", response);
      const token = response.user!.token;
      useAuthStore.getState().login(token, response.user);

      setRegistrationComplete(true);
      setTimeout(() => {
        navigate("/perfiles");
      }, 3000);
    } catch (error: any) {
      const msg =
        error?.response?.data?.msj || "Error de conexión. Intenta de nuevo.";
      setSubmitError(msg);
      console.error("[Register] Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registrationComplete) {
    return <RegisterComplete />;
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goNext();
    }
  };

  const getSlideClass = (index: number) => {
    if (index === step && !isAnimating) return "register-slide-active";
    if (isAnimating && index === step && direction === "next")
      return "register-slide-exit-left";
    if (isAnimating && index === step && direction === "prev")
      return "register-slide-exit-right";
    if (isAnimating && index === step + 1 && direction === "next")
      return "register-slide-enter-right";
    if (isAnimating && index === step - 1 && direction === "prev")
      return "register-slide-enter-left";
    return "register-slide-hidden";
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-(--clr-primary)">
      {/* Card central */}
      <div className="relative z-10 w-full max-w-md mx-4  backdrop-blur-2xl px-10 py-12">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={logo}
            alt="Logo"
            className="h-28 w-auto cursor-pointer"
            onClick={() => navigate("/home")}
          />
        </div>

        {/* Contador de pasos */}
        <p className="mb-2 text-white/40 transition-opacity duration-300">
          Paso {step + 1} de {STEPS.length}
        </p>

        {/* Error de registro */}
        {submitError && (
          <p className="text-sm text-red-500 mb-2">
            {submitError}
          </p>
        )}

        {/* Contenedor de slides */}
        <div className="relative overflow-hidden min-h-[130px]">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`register-slide ${getSlideClass(i)} ${i === step && !isAnimating
                ? "relative"
                : "absolute top-0 left-0"
                } w-full`}
            >
              {/* Label */}
              <h2 className="text-lg mb-6 font-title text-(--clr-primary-title,#fff)">
                {s.label}
              </h2>

              {/* Input */}
              <div className="relative">
                <input
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type={
                    s.id === "password"
                      ? showPassword
                        ? "text"
                        : "password"
                      : s.type
                  }
                  placeholder={s.placeholder}
                  value={formData[s.id]}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, [s.id]: e.target.value }))
                  }
                  onKeyDown={handleKeyDown}
                  className={`w-full text-base outline-none transition-all duration-300 bg-[#102F40] rounded-md px-5 py-4 text-white placeholder:text-white/30 focus:border-(--foc-primary) focus:shadow-[0_0_0_3px_rgba(255,19,118,0.15)] ${errors[s.id]
                    ? "border-2 border-red-500"
                    : "border-2 border-white/10"
                    } ${s.id === "password" ? "pr-14" : ""}`}
                  autoComplete={s.type === "password" ? "new-password" : s.id}
                />
                {s.id === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer bg-transparent border-none p-0 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-200"
                    tabIndex={-1}
                  >
                    <img
                      src={showPassword ? iconoVisible : iconoOculto}
                      alt={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      className="w-6 h-6"
                    />
                  </button>
                )}
              </div>

              {/* Error */}
              <div
                className={`text-sm mt-2  text-red-500 transition-all duration-200 ${errors[s.id] ? "opacity-100 h-5" : "opacity-0 h-0"
                  }`}
              >
                {errors[s.id]}
              </div>
            </div>
          ))}
        </div>

        {/* Checkboxes de términos y privacidad (solo en paso password) */}
        {step === STEPS.length - 1 && (
          <label className="flex items-start gap-2.5 cursor-pointer group mt-3">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded accent-[var(--foc-primary)] cursor-pointer flex-shrink-0"
            />
            <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
              Acepto los{" "}
              <a
                href={termsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--foc-primary) hover:underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Términos, Condiciones y Políticas de Privacidad
              </a>
            </span>
          </label>
        )}

        {/* Botones */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={goNext}
            disabled={isSubmitting}
            className="flex-1 py-3 text-base font-bold rounded-md transition-all duration-200 cursor-pointer bg-(--foc-primary) text-white border-none hover:brightness-115 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Creando cuenta..."
              : step < STEPS.length - 1
                ? "Continuar"
                : "Crear cuenta"}
          </button>
        </div>

        {/* Link a Login */}
        <p className="text-center text-sm mt-8 text-white/50">
          ¿Ya tienes cuenta?{" "}
          <span
            className="cursor-pointer font-semibold text-(--foc-primary) hover:underline transition-colors duration-200"
            onClick={() => navigate("/auth/login")}
          >
            Inicia sesión
          </span>
        </p>
      </div>

      {/* Slide animations CSS */}
      <style>{`
        .register-slide {
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .register-slide-active {
          transform: translateX(0);
          opacity: 1;
        }
        .register-slide-exit-left {
          transform: translateX(-110%);
          opacity: 0;
        }
        .register-slide-exit-right {
          transform: translateX(110%);
          opacity: 0;
        }
        .register-slide-enter-right {
          transform: translateX(0);
          opacity: 1;
          animation: slideFromRight 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .register-slide-enter-left {
          transform: translateX(0);
          opacity: 1;
          animation: slideFromLeft 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .register-slide-hidden {
          transform: translateX(110%);
          opacity: 0;
          pointer-events: none;
          position: absolute;
        }
        @keyframes slideFromRight {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes slideFromLeft {
          from { transform: translateX(-110%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default RegisterView;
