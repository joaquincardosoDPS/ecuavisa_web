import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/authStore";
import { profileService } from "@/services/profileService";
import type { AvatarItem } from "@/interfaces/profile.interface";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import Modal from "@/components/ui/Modal";
import { useConfigStore } from "@/features/config/useConfigStore";
import fallbackLogo from "@/assets/img/logo.svg";
import Button from "@/components/ui/Button";

function EditProfileView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const logo = useConfigStore((s) => s.config?.logo) || fallbackLogo;
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const activeProfile = useAuthStore((s) => s.activeProfile);
  const setActiveProfile = useAuthStore((s) => s.setActiveProfile);
  const profiles = queryClient.getQueryData<
    import("@/interfaces/profile.interface").Profile[]
  >(["profiles", token]);

  const isCreateMode = !id || id === "nuevo";

  // Buscar perfil existente en el cache
  const existingProfile = !isCreateMode
    ? profiles?.find((p) => p.id === id)
    : null;

  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isDefaultProfile = existingProfile?.default === true;

  // Prellenar datos si es edición
  useEffect(() => {
    if (existingProfile) {
      setName(existingProfile.name_perfil);
      setSelectedAvatar(existingProfile.avatar || null);
    }
  }, [existingProfile]);

  const {
    data: avatarGroups,
    isLoading,
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

  const handleSubmit = async () => {
    if (!token) return;
    if (!name.trim()) {
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
        ? await profileService.create(token, name.trim(), avatarToSend)
        : await profileService.update(token, id!, name.trim(), avatarToSend);

      if (response.status === "error") {
        setSubmitError(response.msj || "Error al guardar el perfil.");
        return;
      }

      // Refetch cache de perfiles para tener la info fresca
      await queryClient.refetchQueries({ queryKey: ["profiles"] });

      // Si el perfil actualizado era el perfil activo actual, lo actualizamos en la store (y LS)
      if (!isCreateMode && activeProfile?.id === id) {
        const updatedProfiles = queryClient.getQueryData<
          import("@/interfaces/profile.interface").Profile[]
        >(["profiles", token]);
        const updatedActive = updatedProfiles?.find((p) => p.id === id);
        if (updatedActive) {
          setActiveProfile(updatedActive);
        }
      }

      setSubmitSuccess(true);
      setTimeout(() => navigate("/perfiles"), 1500);
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
      navigate("/perfiles");
    } catch (err) {
      console.error("[EditProfile] Delete error:", err);
      setSubmitError("Error de conexión. Intenta de nuevo.");
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <FullScreenSpinner />;

  return (
    <div className="min-h-screen flex flex-col px-25 py-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <img src={logo} alt="Logo" className="h-14 w-auto" />
      </div>
      <div className="flex justify-end">
        <Button
          variant="tertiary"
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-20">
        {/* Formulario */}
        <div className="flex flex-col gap-5 items-start mt-10 col-start-2">
          <p className="text-xl leading-[43px]">
            {isCreateMode ? "Crear perfil" : "Editar perfil"}
          </p>

          <input
            type="text"
            placeholder="Nombre del perfil"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-base outline-none transition-all duration-300 bg-[#102F40] rounded-md px-5 py-3 text-white placeholder:text-white/30 focus:border-(--foc-primary) focus:shadow-[0_0_0_3px_rgba(255,19,118,0.15)]"
          />

          {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

          {submitSuccess && (
            <p className="text-green-500 text-sm">
              {isCreateMode ? "Perfil creado" : "Perfil actualizado"} ✓
            </p>
          )}

          <Button
            variant="secondary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full uppercase text-sm"
          >
            {isSubmitting
              ? "Guardando..."
              : isCreateMode
                ? "Crear perfil"
                : "Guardar cambios"}
          </Button>

          {!isCreateMode && !isDefaultProfile && (
            <p
              onClick={() => setShowDeleteModal(true)}
              className="text-(--foc-primary) cursor-pointer hover:brightness-110"
            >
              Eliminar perfil
            </p>
          )}
        </div>

        {/* Avatares por grupo */}
        <div className="mt-8 col-span-2 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 scrollbar-subtle">
          {isError ? (
            <p className="text-red-500 text-center">
              {error instanceof Error
                ? error.message
                : "Error al cargar avatares."}
            </p>
          ) : (
            avatarGroups?.map((group) => (
              <div key={group.name} className="mb-8">
                {/* Nombre del grupo */}
                <h3 className="text-lg text-white/70 mb-4">{group.name}</h3>

                {/* Grid de avatares */}
                <div className="flex gap-5 flex-wrap">
                  {group.avatars.map((avatar: AvatarItem) => {
                    const avatarUrl = getAvatarUrl(avatar);
                    const isSelected = selectedAvatar === avatar.id;
                    return (
                      <button
                        key={avatar.id}
                        onClick={() => setSelectedAvatar(avatar.id)}
                        className="group cursor-pointer p-1 rounded-xl transition-all duration-200"
                      >
                        <div
                          className={`w-24 h-24 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border-3 transition-all duration-300 ${isSelected
                              ? "border-(--foc-primary) scale-110"
                              : "border-transparent group-hover:border-(--foc-primary)"
                            }`}
                        >
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={`Avatar ${avatar.id}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl text-(--clr-secondary-text)">?</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal confirmacion eliminar */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-8 flex flex-col items-center gap-5 min-w-[350px]">
          <p className="text-white text-center">
            ¿Quieres borrar el perfil de {name || existingProfile?.name_perfil}?
          </p>
          <div className="flex gap-4 w-full mt-2">
            <Button
              variant="tertiary"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 uppercase"
            >
              Cancelar
            </Button>
            <Button
              variant="secondary"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 uppercase"
            >
              {isDeleting ? "Borrando..." : "Borrar"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default EditProfileView;
