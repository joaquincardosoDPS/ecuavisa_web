import { NavLink, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/features/auth/authStore";

import logo from "@/assets/img/logo.svg";

interface Props {
    isTransparent: boolean;
}

const SCROLL_THRESHOLD = 150; // px hasta opacidad completa

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
        handleScroll(); // Evaluar posición actual al montar

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isTransparent, handleScroll]);

    const onClickLogo = () => {
        navigate("/home");
    }

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        twMerge(
            "px-3 py-2 transition-all duration-200 border-b-4 border-transparent",
            isActive && "border-[var(--foc-primary)]"
        );

    // Cuando es transparente, usar un fondo con opacidad dinámica basada en scroll
    // Cuando NO es transparente, usar el color sólido directamente
    const bgStyle = isTransparent
        ? { backgroundColor: `color-mix(in srgb, var(--clr-secondary) ${Math.round(scrollOpacity * 100)}%, transparent)` }
        : {};

    const getAvatarUrl = (): string | null => {
        if (!activeProfile) return null;
        const images = activeProfile.images;
        if (Array.isArray(images)) return null;
        return images?.medium || images?.small || images?.default || null;
    };

    const avatarUrl = getAvatarUrl();

    return (
        <header
            className={twMerge(
                "fixed top-0 left-0 w-full z-50 px-25 py-3.5 flex flex-row justify-between items-center h-[84px] transition-colors duration-300",
                !isTransparent && "bg-brand-secondary"
            )}
            style={bgStyle}
        >
            <button onClick={onClickLogo} className="cursor-pointer">
                <img src={logo} alt="Logo" className="h-14 w-auto" />
            </button>
            <nav className="flex flex-row gap-15 font-title font-semibold text-white text-base">
                <NavLink to="/home" className={navLinkClasses}>Portada</NavLink>
                <NavLink to="/buscar" className={navLinkClasses}>Búsqueda</NavLink>
                <NavLink to="/programas" className={navLinkClasses}>Programas</NavLink>
                <NavLink to="/en-vivo" className={navLinkClasses}>En vivo</NavLink>
                <NavLink to="/favoritos" className={navLinkClasses}>Mi Lista</NavLink>
            </nav>

            {isAuthenticated && activeProfile ? (
                <button
                    onClick={() => navigate("/perfiles")}
                    className="flex flex-row items-center gap-3 cursor-pointer group"
                >
                    <span className="text-white font-medium group-hover:text-(--foc-primary) transition-colors duration-200">
                        Mi perfil
                    </span>
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 border-2 border-transparent group-hover:border-(--foc-primary) transition-all duration-200">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt={activeProfile.name_perfil}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg text-white/70">
                                {activeProfile.name_perfil.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </button>
            ) : (
                <button
                    onClick={() => navigate("/auth/login")}
                    className="bg-(--foc-primary) text-(--clr-primary-text,#fff) px-6 py-2.5 rounded-md font-semibold text-sm hover:brightness-110 transition-all duration-200 cursor-pointer uppercase"
                >
                    Login
                </button>
            )}
        </header>
    )
}

export default Header;