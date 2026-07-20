import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/authStore";
import { profileService } from "@/services/profileService";
import { useConfigStore } from "@/features/config/useConfigStore";
import { useProfileDraftStore } from "@/features/profiles/profileDraftStore";
import type { Profile, AvatarItem, AvatarGroup } from "@/interfaces/profile.interface";
import fallbackLogo from "@/assets/img/logo.svg";

interface UseEditProfileReturn {
  // Mode & existing data
  isCreateMode: boolean;
  existingProfile: Profile | null | undefined;
  isDefaultProfile: boolean;

  // Form state
  name: string;
  setName: (value: string) => void;
  selectedAvatar: string | null;
  setSelectedAvatar: (value: string | null) => void;
  isSubmitting: boolean;
  submitError: string;
  submitSuccess: boolean;
  showDeleteModal: boolean;
  setShowDeleteModal: (value: boolean) => void;
  isDeleting: boolean;

  // Avatars query
  avatarGroups: AvatarGroup[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;

  // Actions
  handleSubmit: (newName?: string, shouldNavigate?: boolean) => Promise<void>;
  handleDelete: () => Promise<void>;
  getAvatarUrl: (avatar: AvatarItem) => string | null;
  logo: string;
  navigate: ReturnType<typeof useNavigate>;
}

export function useEditProfile(): UseEditProfileReturn {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const logo = useConfigStore((s) => s.config?.logo) || fallbackLogo;
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const activeProfile = useAuthStore((s) => s.activeProfile);
  const setActiveProfile = useAuthStore((s) => s.setActiveProfile);

  const { data: profiles, isLoading: isLoadingProfiles } = useQuery({
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

  const isCreateMode = !id || id === "nuevo";

  // Buscar perfil existente en la lista de perfiles
  const existingProfile = !isCreateMode
    ? profiles?.find((p) => p.id === id)
    : null;

  const { name, setName, selectedAvatar, setSelectedAvatar, clear: clearDraft } = useProfileDraftStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isDefaultProfile = existingProfile?.default === true;

  // Prellenar datos si es edición y el draft está vacío
  useEffect(() => {
    if (existingProfile) {
      if (!name) {
        setName(existingProfile.name_perfil);
      }
      if (selectedAvatar === null) {
        setSelectedAvatar(existingProfile.avatar || null);
      }
    } else if (isCreateMode && !name && selectedAvatar === null) {
      clearDraft();
    }
  }, [existingProfile, isCreateMode, id]);

  const {
    data: avatarGroups,
    isLoading: isLoadingAvatars,
    isError,
    error,
  } = useQuery({
    queryKey: ["avatars"],
    queryFn: async () => {
      const response = await profileService.getAvatars();
      if (response.status === "error") {
        throw new Error(response.msj || "Error al cargar avatares.");
      }
      return response.data || [];
    },
  });

  const getAvatarUrl = (avatar: AvatarItem): string | null => {
    return avatar.images?.medium || avatar.images?.default || null;
  };

  const handleSubmit = async (newName?: string, shouldNavigate = true) => {
    if (!token) return;
    const finalName = (newName !== undefined ? newName : name).trim();
    if (!finalName) {
      setSubmitError("El nombre del perfil es obligatorio.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // En edición, si no se eligió avatar, mantener el avatar actual del perfil
      const avatarToSend = isCreateMode
        ? selectedAvatar
        : (selectedAvatar ?? existingProfile?.avatar ?? null);

      const response = isCreateMode
        ? await profileService.create(token, finalName, avatarToSend)
        : await profileService.update(token, id!, finalName, avatarToSend);

      if (response.status === "error") {
        setSubmitError(response.msj || "Error al guardar el perfil.");
        return;
      }

      // Refetch cache de perfiles para tener la info fresca
      await queryClient.refetchQueries({ queryKey: ["profiles"] });

      // Si el perfil actualizado era el perfil activo actual, lo actualizamos en la store (y LS)
      if (!isCreateMode && activeProfile?.id === id) {
        const updatedProfiles = queryClient.getQueryData<Profile[]>(["profiles", token]);
        const updatedActive = updatedProfiles?.find((p) => p.id === id);
        if (updatedActive) {
          setActiveProfile(updatedActive);
        }
      }

      setSubmitSuccess(true);
      if (shouldNavigate) {
        clearDraft();
        setTimeout(() => navigate("/mi-ecuavisa/perfiles"), 1500);
      }
    } catch (err) {
      console.error("[EditProfile] Error:", err);
      setSubmitError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !id || isCreateMode) return;

    setIsDeleting(true);
    try {
      const response = await profileService.delete(token, id);
      if (response.status === "error") {
        setSubmitError(response.msj || "Error al eliminar el perfil.");
        setShowDeleteModal(false);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["profiles"] });
      clearDraft();
      navigate("/mi-ecuavisa/perfiles");
    } catch (err) {
      console.error("[EditProfile] Delete error:", err);
      setSubmitError("Error de conexión. Intenta de nuevo.");
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isCreateMode,
    existingProfile,
    isDefaultProfile,
    name,
    setName,
    selectedAvatar,
    setSelectedAvatar,
    isSubmitting,
    submitError,
    submitSuccess,
    showDeleteModal,
    setShowDeleteModal,
    isDeleting,
    avatarGroups,
    isLoading: isLoadingAvatars || isLoadingProfiles,
    isError,
    error: error as Error | null,
    handleSubmit,
    handleDelete,
    getAvatarUrl,
    logo,
    navigate,
  };
}
