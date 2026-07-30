import { useNavigate } from "react-router-dom";
import { useProfilesList } from "@/hooks/profiles/useProfilesList";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import { useAuthStore } from "@/features/auth/authStore";
import iconEdit from "@/assets/img/icons/iconos-edit.svg";
import Button from "@/components/ui/Button";
import type { Profile } from "@/interfaces/profile.interface";

function SelectProfileView() {
  const { profiles, isLoading, isError, error, getAvatarUrl, isEditing } = useProfilesList();
  const setActiveProfile = useAuthStore((s) => s.setActiveProfile);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  // const location = useLocation();
  // const from = location.state?.from || "/";

  const handleSelect = (profile: Profile) => {
    if (isEditing) {
      navigate(`/mi-ecuavisa/perfiles/${profile.id}`);
    } else {
      setActiveProfile(profile);
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-25 py-25 " >
      <div className="flex flex-col items-center mb-10">
        <p className="text-2xl leading-10.75">¿Quién está ahí?</p>
      </div>
      <div className="flex flex-col items-center">
        {isLoading ? (
          <FullScreenSpinner />
        ) : isError ? (
          <p className="text-red-500">
            {error instanceof Error ? error.message : "Error al cargar perfiles."}
          </p>
        ) : (
          <div className="flex gap-8 flex-wrap justify-center">
            {profiles?.map((profile) => {
              const avatarUrl = getAvatarUrl(profile);
              return (
                <button
                  key={profile.id}
                  onClick={() => handleSelect(profile)}
                  className="flex flex-col items-center gap-3 group cursor-pointer py-8"
                >
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
                  <span className="text-xl text-(--clr-primary-title)/70 group-hover:text-(--clr-primary-title) transition-colors duration-200">
                    {profile.name_perfil}
                  </span>
                </button>
              );
            })}

            {/* Boton crear perfil */}
            {(profiles?.length ?? 0) < 4 && (
              <button
                onClick={() => navigate("/mi-ecuavisa/perfiles/nuevo")}
                className="flex flex-col items-center gap-3 group cursor-pointer py-8"
              >
                <div className="w-36 h-36 rounded-full bg-(--clr-secondary) flex items-center justify-center group-hover:border-(--foc-primary) transition-all duration-300 border-3 border-transparent">
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

      {/* Botones de acción */}
      <div className="flex justify-center gap-6 mt-8">
        {/* <Button
          variant="primary"
          onClick={toggleEditing}
        >
          {isEditing ? "Listo" : "Editar Perfiles"}
        </Button> */}

        <Button
          variant="secondary"
          onClick={() => logout()}
        >
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}

export default SelectProfileView;
