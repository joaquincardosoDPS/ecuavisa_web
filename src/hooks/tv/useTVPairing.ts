import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/features/auth/authStore";
import { useConfigStore } from "@/features/config/useConfigStore";
import { devicePairService } from "@/services/devicePairService";
import { useIsMobile } from "@/hooks/shared/useIsMobile";
import fallbackLogo from "@/assets/img/logo.svg";

export type PairStatus = "idle" | "loading" | "success" | "error";

export interface UseTVPairingReturn {
  code: string;
  setCode: (code: string) => void;
  status: PairStatus;
  message: string;
  handleSubmit: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  logo: string;
  isMobile: boolean;
}

export function useTVPairing(): UseTVPairingReturn {
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
            navigate("/");
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

  return {
    code,
    setCode,
    status,
    message,
    handleSubmit,
    handleKeyDown,
    inputRef,
    logo,
    isMobile,
  };
}
