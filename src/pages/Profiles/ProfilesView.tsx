import { useEffect } from "react";
import { useProfilesList } from "@/hooks/profiles/useProfilesList";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";
import iconEdit from "@/assets/img/icons/iconos-edit.svg";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/features/auth/authStore";

function ProfilesView() {
  const {
    profiles,
    isLoading,
    isError,
    error,
    handleProfileClick,
    getAvatarUrl,
    navigate,
  } = useProfilesList();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const validateSession = useAuthStore((state) => state.validateSession);

  useEffect(() => {
    validateSession();
  }, [validateSession]);

  const userName = [user?.name, user?.last_name].filter(Boolean).join(" ") || user?.name || "";
  const userEmail = user?.email || "";

  console.log(user)
  return (
    <div className="h-screen flex flex-row px-40 pt-25" style={{ background: 'linear-gradient(to right, #17142C, #2D2533, #3D2E3D)' }}>
      {/* <BackButton /> */}

      {/* Contenedor principal */}
      <div className="flex flex-col w-1/2 mx-auto">
        <h1 className="text-4xl font-bold leading-10.75 text-(--clr-primary-title) mb-8">
          Mi cuenta
        </h1>

        {/* Datos Personales */}
        <div className="mb-10 ">
          <h2 className="text-xl font-bold text-(--clr-primary-title) mb-4">
            Datos personales
          </h2>
          <div className="flex flex-col gap-2">
            <div>
              <span className="text-sm text-(--clr-primary-title)/60 block mb-1">
                Nombre
              </span>
              <p className="text-lg font-medium text-(--clr-primary-title)">
                {userName || "—"}
              </p>
            </div>
            <div>
              <span className="text-sm text-(--clr-primary-title)/60 block mb-1">
                Correo electrónico
              </span>
              <p className="text-lg font-medium text-(--clr-primary-title)">
                {userEmail || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Sección de Perfiles */}
        <h2 className="text-2xl font-bold text-(--clr-primary-title) mb-4">
          Perfiles
        </h2>

        {/* Perfiles */}
        <div className="flex flex-col items-start">
          {isLoading ? (
            <FullScreenSpinner />
          ) : isError ? (
            <p className="text-red-500">
              {error instanceof Error
                ? error.message
                : "Error al cargar perfiles."}
            </p>
          ) : (
            <div className="flex gap-8 flex-wrap justify-start w-full">
              {profiles?.map((profile) => {
                const avatarUrl = getAvatarUrl(profile);
                return (
                  <div
                    key={profile.id}
                    className="flex flex-col items-center gap-2 py-4"
                  >
                    {/* Botón Selección de Perfil */}
                    <button
                      type="button"
                      onClick={() => handleProfileClick(profile)}
                      className="flex flex-col items-center gap-3 group cursor-pointer"
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
                      </div>

                      {/* Nombre */}
                      <span className="text-xl text-(--clr-primary-title)/70 group-hover:text-(--clr-primary-title) transition-colors duration-200">
                        {profile.name_perfil}
                      </span>
                    </button>

                    {/* Botón Editar debajo del Perfil */}
                    <button
                      type="button"
                      onClick={() => navigate(`/mi-ecuavisa/perfiles/${profile.id}`)}
                      className="flex items-center gap-1.5 p-3 rounded-full bg-white hover:bg-(--foc-primary) text-(--clr-primary-title) text-sm font-medium transition-all duration-200 cursor-pointer shadow-sm border-(--clr-secondary)/90 border-4"
                    >
                      <img src={iconEdit} alt="Editar" className="w-6 h-6" />
                    </button>
                  </div>
                );
              })}

              {/* Botón crear perfil */}
              {(profiles?.length ?? 0) < 4 && (
                <button
                  type="button"
                  onClick={() => navigate("/mi-ecuavisa/perfiles/nuevo")}
                  className="flex flex-col items-center gap-3 group cursor-pointer py-4"
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
            onClick={() => logout()}
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
      <div className="flex flex-col w-1/2 ">
        <h2>Hola</h2>
      </div>
    </div>
  );
}

export default ProfilesView;
