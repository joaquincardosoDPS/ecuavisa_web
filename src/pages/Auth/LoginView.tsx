import { useLoginForm } from "@/hooks/auth/useLoginForm";
import { useDocumentTitle } from "@/hooks/shared/useDocumentTitle";
import iconoOculto from "@/assets/img/icons/iconos-oculto.svg";
import iconoVisible from "@/assets/img/icons/iconos-visible.svg";
import Button from "@/components/ui/Button";

function LoginView() {
  useDocumentTitle('Iniciar Sesión');

  const {
    STEPS,
    step,
    isAnimating,
    showPassword,
    formData,
    errors,
    isSubmitting,
    submitError,
    logo,
    inputRefs,
    goNext,
    handleKeyDown,
    getSlideClass,
    togglePassword,
    setFieldValue,
    navigate,
    from,
  } = useLoginForm();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-(--clr-primary)">
      {/* Card central */}
      <div className="relative z-10 w-full max-w-md mx-4 backdrop-blur-2xl px-5 py-8 sm:px-10 sm:py-12">
        {/* Logo */}
        <div className="flex justify-center mb-5 sm:mb-8">
          <img
            src={logo}
            alt="Logo"
            className="h-16 sm:h-28 w-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Contador de pasos */}
        <p className="mb-2 text-(--clr-primary-title)/40 transition-opacity duration-300">
          Paso {step + 1} de {STEPS.length}
        </p>

        {/* Contenedor de slides */}
        <div className="relative overflow-hidden min-h-[130px]">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`auth-slide ${getSlideClass(i)} ${i === step && !isAnimating
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
                  onChange={(e) => setFieldValue(s.id, e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`w-full text-base outline-none transition-all duration-300 bg-(--clr-secondary) rounded-md px-5 py-4 text-(--clr-primary-title) placeholder:text-(--clr-primary-title)/30 focus:border-(--foc-primary) focus:shadow-[0_0_0_3px_rgba(255,19,118,0.15)] ${errors[s.id]
                    ? "border-2 border-red-500"
                    : "border-2 border-(--clr-primary-title)/10"
                    } ${s.id === "password" ? "pr-14" : ""}`}
                  autoComplete={
                    s.type === "password" ? "current-password" : s.id
                  }
                />
                {s.id === "password" && (
                  <button
                    type="button"
                    onClick={togglePassword}
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
                className={`text-sm mt-2 text-red-500 transition-all duration-200 ${errors[s.id] ? "opacity-100 h-5" : "opacity-0 h-0"
                  }`}
              >
                {errors[s.id]}
              </div>
            </div>
          ))}
        </div>

        {/* Error de login */}
        {submitError && (
          <p className="text-sm text-red-500 text-center mt-4 mb-2">
            {submitError}
          </p>
        )}

        {/* Botones */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="secondary"
            onClick={goNext}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting
              ? "Iniciando sesión..."
              : step < STEPS.length - 1
                ? "Continuar"
                : "Iniciar sesión"}
          </Button>
        </div>

        {/* Links */}
        <p className="text-center text-sm mt-8 text-(--clr-primary-title)/50">
          ¿No tienes cuenta?{" "}
          <span
            className="cursor-pointer font-semibold text-(--foc-primary) hover:underline transition-colors duration-200"
            onClick={() => navigate("/auth/registro", { state: { from } })}
          >
            Regístrate
          </span>
        </p>
      </div>

      {/* Slide animations CSS */}
      <style>{`
        .auth-slide {
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .auth-slide-active {
          transform: translateX(0);
          opacity: 1;
        }
        .auth-slide-exit-left {
          transform: translateX(-110%);
          opacity: 0;
        }
        .auth-slide-exit-right {
          transform: translateX(110%);
          opacity: 0;
        }
        .auth-slide-enter-right {
          transform: translateX(0);
          opacity: 1;
          animation: authSlideFromRight 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .auth-slide-enter-left {
          transform: translateX(0);
          opacity: 1;
          animation: authSlideFromLeft 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .auth-slide-hidden {
          transform: translateX(110%);
          opacity: 0;
          pointer-events: none;
          position: absolute;
        }
        @keyframes authSlideFromRight {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes authSlideFromLeft {
          from { transform: translateX(-110%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default LoginView;
