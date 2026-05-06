import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/authStore";
import { useConfigStore } from "@/features/config/useConfigStore";
import fallbackLogo from "@/assets/img/logo.svg";

function MyAccountView() {
  const navigate = useNavigate();
  const logo = useConfigStore((s) => s.config?.logo) || fallbackLogo;
  const user = useAuthStore((s) => s.user);
  const activeProfile = useAuthStore((s) => s.activeProfile);
  const logout = useAuthStore((s) => s.logout);

  const avatarUrl =
    (activeProfile?.images && !Array.isArray(activeProfile.images)
      ? activeProfile.images.medium || activeProfile.images.default
      : null) || activeProfile?.avatar;

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col px-25 py-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <img src={logo} alt="Logo" className="h-14 w-auto" />
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => navigate(-1)}
          className="bg-(--clr-secondary) py-2 px-6 rounded-md text-white cursor-pointer hover:brightness-110 transition-all duration-200"
        >
          Volver
        </button>
      </div>

      <div className="flex items-center justify-center flex-col gap-6 mt-10">
        <p className="text-2xl leading-[43px] font-bold">Cuenta</p>

        {/* Avatar */}
        <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user?.name || "Avatar"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-(--clr-secondary) flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </div>

        {/* Nombre y correo */}
        <div className="text-center">
          <p className="mb-3">{user?.name || "Usuario"}</p>
          <p className="">{user?.email || ""}</p>
        </div>

        {/* Cerrar sesión */}
        <button
          onClick={handleLogout}
          className="mt-4 bg-(--foc-primary) hover:bg-(--foc-primary)/80 text-white px-8 py-3 rounded-md font-semibold transition-all duration-200 cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default MyAccountView;
