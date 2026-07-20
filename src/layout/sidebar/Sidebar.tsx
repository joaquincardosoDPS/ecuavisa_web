import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarIcon } from '../header/SidebarIcons';

interface SidebarItem {
	id: string;
	label: string;
	icon: string;
	path: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
	{ id: 'sb-home', label: 'Inicio', icon: 'home', path: '/' },
	{ id: 'sb-search', label: 'Buscar', icon: 'search', path: '/buscar' },
	{ id: 'sb-programs', label: 'Programas', icon: 'programs', path: '/programas' },
	{ id: 'sb-live', label: 'En vivo', icon: 'live', path: '/en-vivo' },
	{ id: 'sb-list', label: 'Mi Lista', icon: 'list', path: '/mi-lista' },
	{ id: 'sb-history', label: 'Seguir Viendo', icon: 'history', path: '/seguir-viendo' },
	{ id: 'sb-account', label: 'Cuenta', icon: 'account', path: '/mi-ecuavisa' },
];

function Sidebar() {
	const navigate = useNavigate();
	const location = useLocation();

	const isActive = (path: string) => {
		if (path === '/') return location.pathname === '/';
		return location.pathname.startsWith(path);
	};

	return (
		<aside
			className="fixed top-0 left-0 h-full z-50 flex flex-col items-center justify-center w-[96px] bg-black/20 border-r-(--clr-primary-title)/20 border-r"
		>
			<nav className="flex flex-col items-center" style={{ rowGap: '1rem' }}>
				{SIDEBAR_ITEMS.map((item) => {
					const active = isActive(item.path);
					return (
						<button
							key={item.id}
							onClick={() => navigate(item.path)}
							className={[
								'flex flex-col items-center justify-center',
								'w-[60px] py-1.5 rounded-xl',
								'transition-all duration-200 cursor-pointer',
								active
									? 'text-(--foc-primary,#ff1376)'
									: 'text-(--clr-primary-title) hover:text-(--clr-primary-title)',
							].join(' ')}
						>
							<SidebarIcon name={item.icon} size={22} />
							<span className="text-[0.6rem] mt-1.5 font-semibold leading-tight">
								{item.label}
							</span>
						</button>
					);
				})}
			</nav>
		</aside>
	);
}

export default Sidebar;
