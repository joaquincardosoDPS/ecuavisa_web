import { useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import logo from "@/assets/img/logo.svg";
import { useAuthStore } from "@/features/auth/authStore";
import ProfileDropdown from "./ProfileDropdown";

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
			"px-3 py-2 transition-all duration-200 border-b-4 border-transparent | xs:max-md:whitespace-nowrap",
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
				"fixed top-0 left-0 w-full z-50 pb-3.5 flex flex-row justify-between items-center h-[84px] transition-colors duration-300 pl-10 xl:pl-25",
				!isTransparent && "bg-brand-secondary",
			)}
			style={bgStyle}
		>
			<button
				onClick={() => navigate("/home")}
				className="cursor-pointer pt-3.5 shrink-0"
			>
				<img src={logo} alt="Logo" className="h-14 w-auto" />
			</button>

			<nav className="flex flex-row items-center gap-15 pt-3.5 font-title text-white text-base | xs:max-xl:gap-5 | xs:max-md:overflow-x-auto">
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
					className="bg-(--clr-secondary-button) text-(--clr-text-primary-button) px-6 py-2.5 mt-3.5 rounded-md font-semibold text-sm hover:brightness-110 transition-all duration-200 cursor-pointer uppercase mr-10 xl:mr-25 shrink-0"
				>
					Login
				</button>
			)}
		</header>
	);
}

export default Header;
