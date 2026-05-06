import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import fallbackLogo from "@/assets/img/logo.svg";
import { useAuthStore } from "@/features/auth/authStore";
import { useConfigStore } from "@/features/config/useConfigStore";
import ProfileDropdown from "./ProfileDropdown";

interface Props {
	isTransparent: boolean;
}


function Header({ isTransparent }: Props) {
	const navigate = useNavigate();
	const [scrollOpacity, setScrollOpacity] = useState(0);
	const [hidden, setHidden] = useState(false);
	const logo = useConfigStore((s) => s.config?.logo) || fallbackLogo;
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const activeProfile = useAuthStore((s) => s.activeProfile);

	const lastScrollYRef = useRef(0);

	useEffect(() => {
		if (!isTransparent) {
			setScrollOpacity(0);
			setHidden(false);
			return;
		}

		const SCROLL_THRESHOLD = 84; // header height

		const handleScroll = () => {
			const currentY = window.scrollY;
			const isScrollingUp = currentY < lastScrollYRef.current;
			lastScrollYRef.current = currentY;

			// At the very top → always visible and transparent
			if (currentY <= 10) {
				setScrollOpacity(0);
				setHidden(false);
				return;
			}

			// Show/hide based on direction
			if (currentY > SCROLL_THRESHOLD) {
				setHidden(!isScrollingUp);
			}

			// Background: visible when scrolling up, transparent when down
			setScrollOpacity(isScrollingUp ? 1 : 0);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [isTransparent]);

	const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
		twMerge(
			"px-3 py-2 transition-all duration-200 border-b-4 border-transparent | xs:max-md:whitespace-nowrap",
			isActive && "border-[var(--foc-primary)]",
		);

	const bgStyle = isTransparent
		? {
			backgroundColor: `color-mix(in srgb, var(--clr-secondary) ${Math.round(scrollOpacity * 100)}%, transparent)`,
			transition: `background-color ${scrollOpacity === 1 ? "150ms" : "300ms"} ease, translate 300ms ease-in-out`,
		}
		: {
			transition: "translate 300ms ease-in-out",
		};

	return (
		<header
			className={twMerge(
				"fixed top-0 left-0 w-full z-50 pb-3.5 flex flex-row justify-between items-center h-[84px] pl-10 xl:pl-25",
				!isTransparent && "bg-brand-secondary",
				scrollOpacity === 0 && "bg-header-gradient",
				hidden && "-translate-y-full",
			)}
			style={bgStyle}
		>
			<button
				onClick={() => navigate("/home")}
				className="cursor-pointer pt-3.5 shrink-0"
			>
				<img src={logo} alt="Logo" className="h-14 w-auto" />
			</button>

			<nav className="flex flex-row items-center gap-15 pt-3.5 font-title text-white text-base | xs:max-xl:gap-5 | xs:max-md:overflow-x-auto text-shadow-md/3">
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
