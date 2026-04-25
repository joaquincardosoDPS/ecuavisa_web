import { NavLink, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/features/auth/authStore";
import ProfileDropdown from "./ProfileDropdown";

import logo from "@/assets/img/logo.svg";

interface Props {
  isTransparent: boolean;
}

const SCROLL_THRESHOLD = 150;

function Header({ isTransparent }: Props) {
  const navigate = useNavigate();
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const activeProfile = useAuthStore((s) => s.activeProfile);

  const handleScroll = useCallback(() => {
    if (!isTransparent) return;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const opacity = Math.min(1, scrollY / SCROLL_THRESHOLD);
    setScrollOpacity(opacity);
  }, [isTransparent]);

  useEffect(() => {
    if (!isTransparent) {
      setScrollOpacity(0);
      return;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isTransparent, handleScroll]);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    twMerge(
      "px-3 py-2 transition-all duration-200 border-b-4 border-transparent",
      isActive && "border-[var(--foc-primary)]",
    );

  const bgStyle = isTransparent
    ? {
        backgroundColor: `color-mix(in srgb, var(--clr-secondary) ${Math.round(scrollOpacity * 100)}%, transparent)`,
      }
    : {};

  return (
    <header
      className={twMerge(
        "fixed top-0 left-0 w-full z-50 pl-25 pb-3.5 flex flex-row justify-between items-center h-[84px] transition-colors duration-300",
        !isTransparent && "bg-brand-secondary",
      )}
      style={bgStyle}
    >
      <button
        onClick={() => navigate("/home")}
        className="cursor-pointer pt-3.5"
      >
        <img src={logo} alt="Logo" className="h-14 w-auto" />
      </button>

      <nav className="flex flex-row items-center gap-15 pt-3.5 font-title text-white text-base">
        <NavLink to="/home" className={navLinkClasses}>
          Portada
        </NavLink>
        <NavLink to="/buscar" className={navLinkClasses}>
          Búsqueda
        </NavLink>
        <NavLink to="/programas" className={navLinkClasses}>
          Programas
        </NavLink>
        <NavLink to="/en-vivo" className={navLinkClasses}>
          En vivo
        </NavLink>
        <NavLink to="/mi-lista" className={navLinkClasses}>
          Mi Lista
        </NavLink>
      </nav>

      {isAuthenticated && activeProfile ? (
        <ProfileDropdown />
      ) : (
        <button
          onClick={() => navigate("/auth/login")}
          className="bg-(--foc-primary) text-(--clr-primary-text,#fff) px-6 py-2.5 mt-3.5 rounded-md font-semibold text-sm hover:brightness-110 transition-all duration-200 cursor-pointer uppercase mr-25"
        >
          Login
        </button>
      )}
    </header>
  );
}

export default Header;
