import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/authStore";
import { profileService } from "@/services/profileService";
import type { Profile } from "@/interfaces/profile.interface";
import { Spinner } from "@/components/ui/Spinner";
import logo from "@/assets/img/logo.svg";
import iconEdit from "@/assets/img/icons/iconos-edit.svg";

function ProfilesView() {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const [isEditing, setIsEditing] = useState(false);

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
      navigate(`/perfiles/${profile.id}`);
    } else {
      console.log("[Profiles] Selected:", profile.name_perfil, profile.id);
      useAuthStore.getState().setActiveProfile(profile);
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-(--clr-primary) px-25 py-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <img src={logo} alt="Logo" className="h-14 w-auto" />
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => setIsEditing((v) => !v)}
          className={`py-2 px-6 rounded-md text-white cursor-pointer hover:brightness-110 transition-all duration-200 ${
            isEditing ? "bg-(--foc-primary)" : "bg-(--clr-secondary)"
          }`}
        >
          {isEditing ? "Listo" : "Editar Perfiles"}
        </button>
      </div>

      {/* Titulo */}
      <div className="flex flex-col items-center mt-15">
        <p className="text-2xl leading-[43px]">¿Quién está ahí?</p>
      </div>

      {/* Perfiles */}
      <div className="flex flex-col items-center">
        {isLoading ? (
          <Spinner />
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
                    <div className="w-36 h-36 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border-3 border-transparent group-hover:border-(--foc-primary) transition-all duration-300">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={profile.name_perfil}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl text-[#b9b9b9]">
                          {profile.name_perfil.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {/* Icono editar */}
                    {isEditing && (
                      <div className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg">
                        <img src={iconEdit} alt="Editar" className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Nombre */}
                  <span className="text-xl text-white/70 group-hover:text-white transition-colors duration-200">
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
                  <span className="text-5xl text-[#b9b9b9] group-hover:text-(--foc-primary) transition-colors duration-300">
                    +
                  </span>
                </div>
                <span className="text-xl text-[#b9b9b9] group-hover:text-white transition-colors duration-200">
                  Agregar perfil
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilesView;
