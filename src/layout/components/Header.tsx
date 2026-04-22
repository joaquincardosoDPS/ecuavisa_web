import { NavLink, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import logo from "@/assets/img/logo.svg";

interface Props {
    isTransparent: boolean;
}

function Header({ isTransparent }: Props) {
    const navigate = useNavigate();

    const onClickLogo = () => {
        navigate("/home");
    }

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        twMerge(
            "px-3 py-2 transition-all duration-200 border-b-4 border-transparent",
            isActive && "border-[var(--foc-primary)]"
        );

    return (
        <header
            className={twMerge(
                "fixed top-0 left-0 w-full z-50 px-25 py-3.5 flex flex-row justify-between items-center h-[84px] transition-colors duration-300",
                isTransparent ? "bg-transparent hover:bg-brand-secondary" : "bg-brand-secondary"
            )}
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
            <div className="flex flex-row items-center gap-4">
                <h1 className="text-white font-medium">Mi perfil</h1>
                <img src="https://placehold.co/56" alt="Avatar" className="w-14 h-14 rounded-full" />
            </div>
        </header>
    )
}

export default Header;