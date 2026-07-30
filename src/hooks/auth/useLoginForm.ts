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

type StepId = "email" | "password";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email: string;
  password: string;
}

interface Step {
  readonly id: StepId;
  readonly label: string;
  readonly placeholder: string;
  readonly type: string;
}

export interface UseLoginFormReturn {
  /** STEPS constant – used by the view to iterate slides */
  STEPS: readonly Step[];
  /** Current step index (0-based) */
  step: number;
  /** Whether a slide transition is in progress */
  isAnimating: boolean;
  /** Whether the password field is revealed */
  showPassword: boolean;
  /** Controlled form values */
  formData: LoginFormData;
  /** Per-field validation errors */
  errors: LoginFormErrors;
  /** Whether the login request is in flight */
  isSubmitting: boolean;
  /** Server/network error message */
  submitError: string;
  /** Dynamic logo URL from config (or fallback) */
  logo: string;
  /** Ref array – attach each input via callback ref */
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  /** Advance to the next step or submit on the last step */
  goNext: () => void;
  /** Return to the previous step */
  goPrev: () => void;
  /** Keyboard handler (Enter → goNext) */
  handleKeyDown: (e: React.KeyboardEvent) => void;
  /** Returns the CSS animation class for a given slide index */
  getSlideClass: (index: number) => string;
  /** Toggle password visibility */
  togglePassword: () => void;
  /** Update a single form field */
  setFieldValue: (field: StepId, value: string) => void;
  /** Navigate helper – exposed so the view can call navigate() */
  navigate: ReturnType<typeof useNavigate>;
  /** The "from" route stored in location.state (for redirect after login) */
  from: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STEPS: readonly Step[] = [
  {
    id: "email",
    label: "Ingresa tu correo electrónico",
    placeholder: "correo@ejemplo.com",
    type: "email",
  },
  {
    id: "password",
    label: "Ingresa tu contraseña",
    placeholder: "Password",
    type: "password",
  },
] as const;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useLoginForm(): UseLoginFormReturn {
  const navigate = useNavigate();
  const location = useLocation();
  const logo = useConfigStore((s) => s.config?.logo) || fallbackLogo;
  const from = (location.state as { from?: string })?.from || "/perfiles";

  // ── Stepper state ───────────────────────────────────────────────────────
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<Direction>("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── Form state ──────────────────────────────────────────────────────────
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFormErrors>({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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

    if (
      field === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      error = "Ingresa un email válido";
    } else if (field === "password" && formData.password.length < 1) {
      error = "Ingresa tu contraseña";
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
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.status === "error") {
        setSubmitError(response.msj || "Credenciales incorrectas.");
        return;
      }

      // console.log("[Login] Success:", response);
      const token = response.user!.token;
      useAuthStore.getState().login(token, response.user);

      const from = location.state?.from || "/";
      navigate("/seleccionar-perfil", { state: { from }, replace: true });
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { msj?: string } } };
      const msg =
        axiosError?.response?.data?.msj || "Error de conexión. Intenta de nuevo.";
      setSubmitError(msg);
      console.error("[Login] Error:", error);
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
      handleSubmit();
    }
  };

  const goPrev = () => {
    if (isAnimating || step <= 0) return;
    setDirection("prev");
    setIsAnimating(true);
    setTimeout(() => {
      setStep((s) => s - 1);
      setIsAnimating(false);
    }, 350);
  };

  // ── Keyboard ────────────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      goNext();
    }
  };

  // ── Slide class helper ──────────────────────────────────────────────────
  const getSlideClass = (index: number) => {
    if (index === step && !isAnimating) return "auth-slide-active";
    if (isAnimating && index === step && direction === "next")
      return "auth-slide-exit-left";
    if (isAnimating && index === step && direction === "prev")
      return "auth-slide-exit-right";
    if (isAnimating && index === step + 1 && direction === "next")
      return "auth-slide-enter-right";
    if (isAnimating && index === step - 1 && direction === "prev")
      return "auth-slide-enter-left";
    return "auth-slide-hidden";
  };

  // ── Toggles / setters ──────────────────────────────────────────────────
  const togglePassword = () => setShowPassword((v) => !v);

  const setFieldValue = (field: StepId, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  // ── Return ──────────────────────────────────────────────────────────────
  return {
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
    goPrev,
    handleKeyDown,
    getSlideClass,
    togglePassword,
    setFieldValue,
    navigate,
    from,
  };
}
