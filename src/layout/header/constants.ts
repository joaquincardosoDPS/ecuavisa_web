export interface NavbarItemConfig {
    id: string;
    title: string;
    path: string;
    icon: string;
}

export const NAVBAR_FOCUS_KEY = 'NAVBAR';

export const NAVBAR_ITEMS: NavbarItemConfig[] = [
    { id: 'navbar-live', title: 'VIVO', path: '/live', icon: 'live' },
    { id: 'navbar-home', title: 'Programación', path: '/', icon: 'home' },
    { id: 'navbar-lista', title: 'Mi lista', path: '/mi-lista', icon: 'lista' },
];

/** Altura del navbar en px */
export const NAVBAR_HEIGHT = 80;
