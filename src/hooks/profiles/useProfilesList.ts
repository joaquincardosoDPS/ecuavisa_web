import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/authStore";
import { profileService } from "@/services/profileService";
import { useConfigStore } from "@/features/config/useConfigStore";
import { useProfileDraftStore } from "@/features/profiles/profileDraftStore";
import type { Profile } from "@/interfaces/profile.interface";
import fallbackLogo from "@/assets/img/logo.svg";

interface UseProfilesListReturn {
  profiles: Profile[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  logo: string;
  isEditing: boolean;
  toggleEditing: () => void;
  handleProfileClick: (profile: Profile) => void;
  getAvatarUrl: (profile: Profile) => string | null;
  navigate: ReturnType<typeof useNavigate>;
}

export function useProfilesList(): UseProfilesListReturn {
  const navigate = useNavigate();
  const logo = useConfigStore((s) => s.config?.logo) || fallbackLogo;
  const token = useAuthStore((s) => s.token);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    useProfileDraftStore.getState().clear();
  }, []);

  const {
    data: profiles,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["profiles", token],
    queryFn: async () => {
      const response = await profileService.getAll(token!);
      if (response.status === "error") {
        throw new Error(response.msj || "Error al cargar perfiles.");
      }
      return response.data || [];
    },
    enabled: !!token,
  });

  const getAvatarUrl = (profile: Profile): string | null => {
    if (Array.isArray(profile.images)) return null;
    return profile.images?.medium || profile.images?.default || null;
  };

  const handleProfileClick = (profile: Profile) => {
    if (isEditing) {
      navigate(`/mi-ecuavisa/perfiles/${profile.id}`);
    } else {
      console.log("[Profiles] Selected:", profile.name_perfil, profile.id);
      useAuthStore.getState().setActiveProfile(profile);
      navigate("/");
    }
  };

  const toggleEditing = () => {
    setIsEditing((v) => !v);
  };

  return {
    profiles,
    isLoading,
    isError,
    error: error as Error | null,
    logo,
    isEditing,
    toggleEditing,
    handleProfileClick,
    getAvatarUrl,
    navigate,
  };
}
