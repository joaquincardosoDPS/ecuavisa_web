import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "@/features/auth/authStore";
import { profileService } from "@/services/profileService";
import type { Profile } from "@/interfaces/profile.interface";
import ProfileAvatar from "./ProfileAvatar";

function ProfileDropdown() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeProfile = useAuthStore((s) => s.activeProfile);
  const setActiveProfile = useAuthStore((s) => s.setActiveProfile);
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);

  const { data: profiles } = useQuery({
    queryKey: ["profiles", token],
    queryFn: async () => {
      const response = await profileService.getAll(token!);
      if (response.status === "error") return [];
      return response.data || [];
    },
    enabled: !!token,
  });

  // Cerrar al hacer clic fuera
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!activeProfile) return null;

  const handleSwitch = (profile: Profile) => {
    setActiveProfile(profile);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/home");
  };

  const navigateTo = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="relative pr-10 xl:pr-25 pt-3.5" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-row items-center gap-3 cursor-pointer group"
      >
        <span className="z-30 text-white font-medium group-hover:text-(--foc-primary) transition-colors duration-200">
          Mi perfil
        </span>
        <ProfileAvatar
          profile={activeProfile}
          size="md"
          className="z-30 border-2 border-transparent group-hover:border-(--foc-primary) transition-all duration-200"
        />
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute right-0 -top-5 pt-30 bg-(--clr-secondary) rounded-l-lg py-4 min-w-[260px] animate-in fade-in slide-in-from-top-2 duration-200 z-20">
          {/* Perfiles */}
          <div className="flex flex-col mb-5">
            {profiles?.map((profile) => (
              <button
                key={profile.id}
                onClick={() => handleSwitch(profile)}
                className={twMerge(
                  "flex items-center gap-3 px-5 py-2.5 cursor-pointer hover:bg-white/10 transition-all duration-150",
                )}
              >
                <ProfileAvatar profile={profile} size="sm" />
                <span className="text-white text-sm font-medium">
                  {profile.name_perfil}
                </span>
              </button>
            ))}

            {/* Agregar perfil */}
            {(profiles?.length ?? 0) < 4 && (
              <button
                onClick={() => navigateTo("/perfiles/nuevo")}
                className="flex items-center gap-3 px-5 py-2.5 cursor-pointer hover:bg-white/10 transition-all duration-150"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-xl text-white/50">+</span>
                </div>
                <span className=" text-sm">Agregar perfil</span>
              </button>
            )}
          </div>

          {/* Links */}
          <div className="flex flex-col">
            <DropdownLink onClick={() => navigateTo("/perfiles")}>
              Editar perfiles
            </DropdownLink>
            <DropdownLink onClick={() => navigateTo("/cuenta")}>
              Cuenta
            </DropdownLink>
            <DropdownLink onClick={() => navigateTo("/tv")}>
              Vincular TV
            </DropdownLink>
            <DropdownLink onClick={handleLogout}>Desconectarse</DropdownLink>
          </div>
        </div>
      )}
    </div>
  );
}

/** Link individual del dropdown */
function DropdownLink({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-2 text-left text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all duration-150 cursor-pointer"
    >
      {children}
    </button>
  );
}

export default ProfileDropdown;
