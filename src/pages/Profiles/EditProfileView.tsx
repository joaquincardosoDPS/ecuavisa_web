import { useEditProfile } from "@/hooks/profiles/useEditProfile";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { BackButton } from "@/components/ui/BackButton";
import ProfileActionRow from "@/components/ui/ProfileActionRow";
import Button from "@/components/ui/Button";

function EditProfileView() {
  const {
    isCreateMode,
    existingProfile,
    isDefaultProfile,
    name,
    setName,
    selectedAvatar,
    avatarGroups,
    showDeleteModal,
    setShowDeleteModal,
    isDeleting,
    isSubmitting,
    submitError,
    submitSuccess,
    isLoading,
    handleSubmit,
    handleDelete,
    navigate,
  } = useEditProfile();

  if (isLoading) return <FullScreenSpinner />;

  // Buscar URL del avatar seleccionado o del existente
  const avatarUrl = (() => {
    if (selectedAvatar && avatarGroups) {
      for (const group of avatarGroups) {
        const found = group.avatars.find((a) => a.id === selectedAvatar);
        if (found) {
          return found.images?.big || found.images?.medium || found.images?.default || null;
        }
      }
    }
    if (existingProfile && !Array.isArray(existingProfile.images)) {
      return existingProfile.images?.big || existingProfile.images?.medium || existingProfile.images?.default || null;
    }
    return null;
  })();

  return (
    <div className="min-h-screen flex flex-col px-40 pt-25" style={{ background: 'linear-gradient(to right, #17142C, #2D2533, #3D2E3D)' }}>
      <BackButton />
      <div className="flex flex-row">
        <div className="w-1/2">
          <h1 className="self-stretch text-4xl font-bold leading-12 mb-12">
            {isCreateMode ? "Nuevo perfil" : "Mi perfil"}
          </h1>
          <p className="self-stretch text-3xl font-bold leading-10 mb-4">
            {isCreateMode ? "Creá tu perfil de Ecuavisa" : "Personalizá tu experiencia en Ecuavisa"}
          </p>
          <p className="self-stretch text-2xl font-bold leading-8">
            {isCreateMode
              ? "Elige un nombre y avatar obligatorios para crear tu nuevo perfil"
              : "Personaliza tu experiencia en Ecuavisa y disfruta de contenido hecho para ti"}
          </p>

          <div className="flex flex-col gap-6 mt-8">
            {/* Elegir avatar */}
            <ProfileActionRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2c0 .7.5 1.2 1.2 1.2h16.8c.7 0 1.2-.5 1.2-1.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              }
              label={isCreateMode ? "Elegir avatar *" : "Elegir avatar"}
              variant="navigation"
              onClick={() => navigate('avatars')}
            />

            {/* Nombre */}
            <ProfileActionRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>
              }
              label={isCreateMode ? "Nombre *" : "Nombre"}
              variant="editable"
              value={name || (isCreateMode ? "Toca para escribir nombre" : "")}
              onValueChange={setName}
              onSave={!isCreateMode ? () => handleSubmit(name, false) : undefined}
            />

            {/* Mensajes de error/éxito */}
            {submitError && (
              <p className="text-red-500 font-semibold text-lg">{submitError}</p>
            )}
            {submitSuccess && (
              <p className="text-green-400 font-semibold text-lg">
                {isCreateMode ? "¡Perfil creado con éxito!" : "¡Perfil actualizado!"}
              </p>
            )}

            {/* Botón Crear perfil (solo en modo creación) */}
            {isCreateMode && (
              <div className="mt-4">
                <Button
                  variant="primary"
                  onClick={() => handleSubmit(name, true)}
                  disabled={isSubmitting}
                  className="w-full text-xl py-4 font-bold"
                >
                  {isSubmitting ? "Creando perfil..." : "Crear perfil"}
                </Button>
              </div>
            )}

            {/* Eliminar perfil (solo edición) */}
            {!isCreateMode && !isDefaultProfile && (
              <ProfileActionRow
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                }
                label="Eliminar perfil"
                variant="action"
                onClick={() => setShowDeleteModal(true)}
              />
            )}
          </div>
        </div>
        <div className="w-1/2 flex items-center justify-center mt-20 flex-col">
          {avatarUrl ? (
            <div className="relative w-80 h-80 rounded-[40px] outline-4 outline-(--clr-primary-title) inline-flex flex-col justify-center items-center overflow-hidden bg-(--clr-secondary-button)/25">
              <img src={avatarUrl} alt={name || "Perfil"} className={`w-full h-full object-cover transition-opacity duration-300 ${isSubmitting ? "opacity-40" : "opacity-100"}`} />
              {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                  <div className="w-12 h-12 border-4 border-t-(--foc-primary) border-white/20 rounded-full animate-spin" />
                </div>
              )}
            </div>
          ) : (
            <div data-tipo="NoAvatar" className="relative w-80 h-80 bg-(--foc-primary) rounded-[40px] outline-4 outline-(--clr-primary-title) inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
              <div className={`self-stretch text-center justify-start text-(--clr-primary-title) text-[200px] font-bold font-['Gotham'] leading-[220px] transition-opacity duration-300 ${isSubmitting ? "opacity-40" : "opacity-100"}`}>
                {(name || existingProfile?.name_perfil || 'U').charAt(0).toUpperCase()}
              </div>
              {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                  <div className="w-12 h-12 border-4 border-t-white border-white/20 rounded-full animate-spin" />
                </div>
              )}
            </div>
          )}
          <p className="mt-10 text-5xl font-bold text-(--clr-primary-title) leading-14">
            {name || existingProfile?.name_perfil || (isCreateMode ? "Nombre de perfil" : "")}
          </p>
        </div>
      </div>

      {/* Modal confirmacion eliminar */}
      {!isCreateMode && (
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          message={`¿Quieres borrar el perfil de ${existingProfile?.name_perfil || ""}?`}
          confirmLabel="Borrar"
          loadingLabel="Borrando..."
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}

export default EditProfileView;
