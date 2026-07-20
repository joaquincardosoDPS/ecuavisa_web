import { useEditProfile } from "@/hooks/profiles/useEditProfile";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { BackButton } from "@/components/ui/BackButton";
import ProfileActionRow from "@/components/ui/ProfileActionRow";

function EditProfileView() {
  const {
    existingProfile,
    isDefaultProfile,
    name,
    setName,
    selectedAvatar,
    avatarGroups,
    showDeleteModal,
    setShowDeleteModal,
    isDeleting,
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
    <div className="min-h-screen flex flex-col px-40 py-25" style={{ background: 'linear-gradient(to right, #17142C, #2D2533, #3D2E3D)' }}>
      <BackButton />
      <div className="flex flex-row">
        <div className="w-1/2">
          <h1 className="self-stretch text-4xl font-bold leading-12 mb-12">Mi perfil</h1>
          <p className="self-stretch text-3xl font-bold leading-10 mb-4">Personalizá tu experiencia en Ecuavisa</p>
          <p className="self-stretch text-2xl font-bold leading-8 ">Personaliza tu experiencia en Ecuavisa y disfruta de contenido hecho para ti</p>

          <div className="flex flex-col gap-10 mt-8">
            {/* Elegir avatar */}
            <ProfileActionRow
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2c0 .7.5 1.2 1.2 1.2h16.8c.7 0 1.2-.5 1.2-1.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              }
              label="Elegir avatar"
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
              label="Nombre"
              variant="editable"
              value={name}
              onValueChange={setName}
              onSave={() => handleSubmit(name, false)}
            />

            {/* Eliminar perfil */}
            {!isDefaultProfile && (
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
            <div className="w-80 h-80 rounded-[40px] outline-4 outline-(--clr-primary-title) inline-flex flex-col justify-center items-center overflow-hidden bg-(--clr-secondary-button)/25">
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div data-tipo="NoAvatar" className="w-80 h-80 bg-(--foc-primary) rounded-[40px] outline-4 outline-(--clr-primary-title) inline-flex flex-col justify-center items-center gap-2 overflow-hidden">
              <div className="self-stretch text-center justify-start text-(--clr-primary-title) text-[200px] font-bold font-['Gotham'] leading-[220px]">
                {(name || existingProfile?.name_perfil || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          <p className="mt-10 text-5xl font-bold text-(--clr-primary-title) leading-14">
            {name || existingProfile?.name_perfil}
          </p>
        </div>
      </div>



      {/* Modal confirmacion eliminar */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        message={`¿Quieres borrar el perfil de ${existingProfile?.name_perfil || existingProfile?.name_perfil}?`}
        confirmLabel="Borrar"
        loadingLabel="Borrando..."
        isLoading={isDeleting}
      />
    </div>
  );
}

export default EditProfileView;
