import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/features/auth/authStore";
import { useConfigStore } from "@/features/config/useConfigStore";
import fallbackLogo from "@/assets/img/logo.svg";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Direction = "next" | "prev";

type StepId = "name" | "email" | "password";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

interface RegisterFormErrors {
  name: string;
  email: string;
  password: string;
}

interface Step {
  readonly id: StepId;
  readonly label: string;
  readonly placeholder: string;
  readonly type: string;
}

export interface UseRegisterFormReturn {
  /** STEPS constant – used by the view to iterate slides */
  STEPS: readonly Step[];
  /** Current step index (0-based) */
  step: number;
  /** Whether a slide transition is in progress */
  isAnimating: boolean;
  /** Whether the password field is revealed */
  showPassword: boolean;
  /** Whether the user has accepted terms & conditions */
  acceptTerms: boolean;
  /** Controlled form values */
  formData: RegisterFormData;
  /** Per-field validation errors */
  errors: RegisterFormErrors;
  /** Whether the register request is in flight */
  isSubmitting: boolean;
  /** Server/network error message */
  submitError: string;
  /** Whether registration completed successfully */
  registrationComplete: boolean;
  /** Dynamic logo URL from config (or fallback) */
  logo: string;
  /** Terms & conditions URL from config */
  termsUrl: string;
  /** Ref array – attach each input via callback ref */
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  /** Advance to the next step or submit on the last step */
  goNext: () => void;
  /** Keyboard handler (Enter → goNext) */
  handleKeyDown: (e: React.KeyboardEvent) => void;
  /** Returns the CSS animation class for a given slide index */
  getSlideClass: (index: number) => string;
  /** Toggle password visibility */
  togglePassword: () => void;
  /** Toggle accept-terms checkbox */
  setAcceptTerms: (checked: boolean) => void;
  /** Update a single form field */
  setFieldValue: (field: StepId, value: string) => void;
  /** Navigate helper – exposed so the view can call navigate() */
  navigate: ReturnType<typeof useNavigate>;
  /** The "from" route stored in location.state (for redirect after register) */
  from: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STEPS: readonly Step[] = [
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

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useRegisterForm(): UseRegisterFormReturn {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/perfiles";
  const logo = useConfigStore((s) => s.config?.logo) || fallbackLogo;
  const termsUrl =
    useConfigStore((s) => s.config?.["terminos-condiciones"]) || "#";

  // ── Stepper state ───────────────────────────────────────────────────────
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<Direction>("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTermsState] = useState(false);

  // ── Form state ──────────────────────────────────────────────────────────
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({
    name: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // ── Refs ────────────────────────────────────────────────────────────────
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Autofocus en el input del paso actual
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[step]?.focus();
    }, 400);
    return () => clearTimeout(timer);
  }, [step]);

  // ── Validation ──────────────────────────────────────────────────────────
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

  // ── Submit ──────────────────────────────────────────────────────────────
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
        const from = location.state?.from || "/";
        navigate("/seleccionar-perfil", { state: { from }, replace: true });
      }, 3000);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { msj?: string } } };
      const msg =
        axiosError?.response?.data?.msj ||
        "Error de conexión. Intenta de nuevo.";
      setSubmitError(msg);
      console.error("[Register] Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Navigation ──────────────────────────────────────────────────────────
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

  // ── Keyboard ────────────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goNext();
    }
  };

  // ── Slide class helper ──────────────────────────────────────────────────
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

  // ── Toggles / setters ──────────────────────────────────────────────────
  const togglePassword = () => setShowPassword((v) => !v);

  const setAcceptTerms = (checked: boolean) => setAcceptTermsState(checked);

  const setFieldValue = (field: StepId, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  // ── Return ──────────────────────────────────────────────────────────────
  return {
    STEPS,
    step,
    isAnimating,
    showPassword,
    acceptTerms,
    formData,
    errors,
    isSubmitting,
    submitError,
    registrationComplete,
    logo,
    termsUrl,
    inputRefs,
    goNext,
    handleKeyDown,
    getSlideClass,
    togglePassword,
    setAcceptTerms,
    setFieldValue,
    navigate,
    from,
  };
}
