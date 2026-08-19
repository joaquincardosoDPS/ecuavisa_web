import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/features/auth/authStore";
import { useConfigStore } from "@/features/config/useConfigStore";
import type { Profile } from "@/interfaces/profile.interface";
import { NAVBAR_ITEMS } from "./constants";
import { NavbarItem } from "./NavbarItem";
import { SidebarIcon } from "./SidebarIcons";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import logoFallback from '@/assets/img/logo.svg';

function getProfileAvatarUrl(profile: Profile): string | null {
	if (Array.isArray(profile.images)) return null;
	return profile.images?.medium || profile.images?.default || null;
}

function Header() {
	const configLogo = useConfigStore((s) => s.config?.logo);
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const activeProfile = useAuthStore((s) => s.activeProfile);
	const [searchMode, setSearchMode] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchParams] = useSearchParams();
	const location = useLocation();
	const inputRef = useRef<HTMLInputElement>(null);
	const centerRef = useRef<HTMLDivElement>(null);
	const [naturalWidth, setNaturalWidth] = useState(0);
	const navigate = useNavigate();

	// Pre-fill query if present on /buscar page
	useEffect(() => {
		const q = searchParams.get('q');
		if (q) {
			setSearchQuery(q);
		}
	}, [searchParams]);

	/* ── Avatar ── */
	const avatarUrl = activeProfile ? getProfileAvatarUrl(activeProfile) : null;
	const avatarInitial = (activeProfile?.name_perfil || 'U').charAt(0).toUpperCase();

	const goToProfile = useCallback(() => {
		navigate(isAuthenticated ? `/mi-ecuavisa/perfiles` : '/auth/login', { replace: true });
	}, [isAuthenticated, navigate]);

	/* ── Search ── */
	const openSearch = useCallback(() => {
		if (centerRef.current && naturalWidth === 0) {
			setNaturalWidth(centerRef.current.offsetWidth);
		}
		setSearchMode(true);
		setTimeout(() => inputRef.current?.focus(), 100);
	}, [naturalWidth]);

	const closeSearch = useCallback(() => {
		setSearchMode(false);
	}, []);

	const handleSearchSubmit = useCallback(() => {
		const trimmed = searchQuery.trim();
		if (trimmed) {
			navigate(`/buscar?q=${encodeURIComponent(trimmed)}`);
			setSearchMode(false);
		} else if (location.pathname !== '/buscar') {
			navigate('/buscar');
			setSearchMode(false);
		}
	}, [searchQuery, navigate, location.pathname]);

	return (
		<div>
			{searchMode && (
				<div
					className='fixed inset-0 z-40 transition-opacity duration-300 backdrop-blur-sm'
					style={{ background: 'color-mix(in srgb, var(--clr-primary) 70%, transparent)' }}
					onClick={closeSearch}
				/>
			)}
			<nav
				className={[
					'fixed top-0 left-0 right-0 z-50',
					'flex items-center',
					'px-[3.25vw] h-20',
				].join(' ')}
			>
				{/* Left: avatar */}
				<div className='flex items-center justify-start shrink-0 w-30'>
					<img
						src={configLogo || logoFallback}
						alt="Logo"
						className='h-10 w-auto object-contain'
						draggable={false}
					/>
				</div>

				<div
					ref={centerRef}
					className='relative flex items-center justify-center border border-(--clr-primary-title)/15 rounded-full h-12 overflow-hidden transition-all duration-400 ease-in-out mx-auto min-w-120'
					style={{
						width: naturalWidth
							? (searchMode ? `${Math.max(naturalWidth * 1.3, 560)}px` : `${naturalWidth}px`)
							: undefined,
						backgroundColor: searchMode ? 'color-mix(in srgb, var(--clr-primary) 95%, transparent)' : 'color-mix(in srgb, var(--clr-primary-title) 20%, transparent)',
					}}
				>
					{/* ── Nav items layer ── */}
					<ul
						className='flex items-center list-none m-0 px-2 transition-all duration-300 ease-in-out whitespace-nowrap'
						style={{
							opacity: searchMode ? 0 : 1,
							pointerEvents: searchMode ? 'none' : 'auto',
							transform: searchMode ? 'scale(0.9)' : 'scale(1)',
							columnGap: '0.5rem',
						}}
					>
						{/* Search trigger */}
						<li
							className={[
								'flex items-center px-5 py-2 rounded-full',
								'transition-all duration-200 cursor-pointer',
								'text-[1.1rem] font-bold',
								'hover:bg-(--clr-primary-title)/10',
							].join(' ')}
							onClick={openSearch}
						>
							<span className='flex items-center justify-center' style={{ width: '1.375rem', height: '1.375rem' }}>
								<SidebarIcon name="search" size={22} />
							</span>
						</li>

						{/* Nav items */}
						{NAVBAR_ITEMS.map((item) => (
							<NavbarItem key={item.id} item={item} />
						))}
					</ul>

					<div
						className='absolute inset-0 flex items-center px-5 transition-all duration-300 ease-in-out'
						style={{
							opacity: searchMode ? 1 : 0,
							pointerEvents: searchMode ? 'auto' : 'none',
							transform: searchMode ? 'translateY(0)' : 'translateY(6px)',
						}}
					>
						<button
							type="button"
							onClick={handleSearchSubmit}
							className='flex items-center justify-center shrink-0 cursor-pointer text-(--clr-primary-title) hover:text-(--clr-secondary-button) transition-colors'
							tabIndex={searchMode ? 0 : -1}
							title="Buscar"
						>
							<SidebarIcon name="search" size={20} />
						</button>
						<input
							ref={inputRef}
							type="text"
							value={searchQuery}
							placeholder="Buscar programas, películas..."
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleSearchSubmit();
								if (e.key === 'Escape') closeSearch();
							}}
							className='ml-3 flex-1 bg-transparent border-none outline-none text-[1.1rem] text-(--clr-primary-text) placeholder:text-(--clr-primary-title)/35'
							autoComplete="off"
							maxLength={100}
							tabIndex={searchMode ? 0 : -1}
						/>
						<button
							type="button"
							className='ml-2 w-8 h-8 flex items-center justify-center rounded-full opacity-50 hover:opacity-100 hover:bg-(--clr-primary-title)/10 cursor-pointer transition-opacity duration-150 text-(--clr-primary-title)'
							onClick={closeSearch}
							tabIndex={searchMode ? 0 : -1}
						>
							✕
						</button>
					</div>
				</div>

				{/* Right: logo */}

				<div className='flex items-center justify-end shrink-0 w-40'>
					<div className="mr-2">Mi perfil</div>
					<button
						className={[
							'w-12 h-12 rounded-xl overflow-hidden',
							'border-2 transition-all duration-200 cursor-pointer',
							'flex items-center justify-center',
							'bg-(--clr-secondary)',
						].join(' ')}
						onClick={goToProfile}
					>
						{avatarUrl ? (
							<img
								src={avatarUrl}
								alt={activeProfile?.name_perfil || 'Avatar'}
								className='w-full h-full object-cover'
								draggable={false}
								decoding="async"
							/>
						) : (
							<span className='text-[1.2rem] font-bold text-(--clr-primary-title)'>
								{avatarInitial}
							</span>
						)}
					</button>
				</div>
			</nav>
		</div>
	);
}

export default Header;
