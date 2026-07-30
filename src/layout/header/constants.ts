export interface NavbarItemConfig {
    id: string;
    title: string;
    path: string;
    icon?: string;
}

export const NAVBAR_ITEMS: NavbarItemConfig[] = [
    { id: 'navbar-home', title: 'Inicio', path: '/', icon: 'home' },
    { id: 'navbar-live', title: 'En vivo', path: '/live', icon: 'live' },
    { id: 'navbar-videoteca', title: 'Videoteca', path: '/programas' },
    { id: 'navbar-lista', title: 'Mi lista', path: '/mi-lista', icon: 'lista' },
];

export const NAVBAR_HEIGHT = 80;
