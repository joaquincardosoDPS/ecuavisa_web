import { useProfilesList } from "@/hooks/profiles/useProfilesList";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import iconEdit from "@/assets/img/icons/iconos-edit.svg";
import Button from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { useAuthStore } from "@/features/auth/authStore";

function ProfilesView() {
  const {
    profiles,
    isLoading,
    isError,
    error,
    isEditing,
    toggleEditing,
    handleProfileClick,
    getAvatarUrl,
    navigate,
  } = useProfilesList();
  
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen flex flex-col px-25 py-25" style={{ background: 'linear-gradient(to right, #17142C, #2D2533, #3D2E3D)' }}>
      <BackButton />

      {/* Titulo */}
      <div className="flex flex-col items-center ">
        <p className="text-2xl leading-[43px]">¿Quién está ahí?</p>
      </div>

      {/* Perfiles */}
      <div className="flex flex-col items-center">
        {isLoading ? (
          <FullScreenSpinner />
        ) : isError ? (
          <p className="text-red-500">
            {error instanceof Error
              ? error.message
              : "Error al cargar perfiles."}
          </p>
        ) : (
          <div className="flex gap-8 flex-wrap justify-center">
            {profiles?.map((profile) => {
              const avatarUrl = getAvatarUrl(profile);
              return (
                <button
                  key={profile.id}
                  onClick={() => handleProfileClick(profile)}
                  className="flex flex-col items-center gap-3 group cursor-pointer py-8"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-36 h-36 rounded-full overflow-hidden bg-(--clr-primary-title)/10 flex items-center justify-center border-3 border-transparent group-hover:border-(--foc-primary) transition-all duration-300">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={profile.name_perfil}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl text-(--clr-secondary-text)">
                          {profile.name_perfil.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {/* Icono editar */}
                    {isEditing && (
                      <div className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-(--clr-primary-title) flex items-center justify-center shadow-lg">
                        <img src={iconEdit} alt="Editar" className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Nombre */}
                  <span className="text-xl text-(--clr-primary-title)/70 group-hover:text-(--clr-primary-title) transition-colors duration-200">
                    {profile.name_perfil}
                  </span>
                </button>
              );
            })}

            {/* Boton crear perfil */}
            {(profiles?.length ?? 0) < 4 && (
              <button
                onClick={() => navigate("/perfiles/nuevo")}
                className="flex flex-col items-center gap-3 group cursor-pointer py-8 "
              >
                <div className="w-36 h-36 rounded-full bg-(--clr-secondary) flex items-center justify-center group-hover:border-(--foc-primary) transition-all duration-300 border-3 border-transparent ">
                  <span className="text-5xl text-(--clr-secondary-text) group-hover:text-(--foc-primary) transition-colors duration-300">
                    +
                  </span>
                </div>
                <span className="text-xl text-(--clr-secondary-text) group-hover:text-(--clr-primary-title) transition-colors duration-200">
                  Agregar perfil
                </span>
              </button>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-center gap-6 mt-8">
        <Button
          variant="secondary"
          onClick={toggleEditing}
        >
          {isEditing ? "Listo" : "Editar Perfiles"}
        </Button>
        
        <Button
          variant="tertiary"
          onClick={() => logout()}
        >
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}

export default ProfilesView;
