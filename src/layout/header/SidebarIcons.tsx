/* === Header/Sidebar Icons ===
 * Mapea iconos por nombre para uso en la navbar.
 */

import type { SVGProps } from 'react';
import { HeaderHome } from '@/components/icons/header-home';
import { HeaderSearch } from '@/components/icons/header-search';
import { HeaderLive } from '@/components/icons/header-live';
import { HeaderList } from '@/components/icons/header-list';
import { SidebarOnDemand } from '@/components/icons/sidebar-on-demand';
import { SidebarHistory } from '@/components/icons/sidebar-history';
import { SidebarAcount } from '@/components/icons/sidebar-acount';

type IconComponent = React.FC<SVGProps<SVGSVGElement>>;

const ICON_MAP: Record<string, IconComponent> = {
    home: HeaderHome,
    search: HeaderSearch,
    programs: SidebarOnDemand,
    live: HeaderLive,
    lista: HeaderList,
    list: HeaderList,
    history: SidebarHistory,
    account: SidebarAcount,
    login: SidebarAcount,
};

export function SidebarIcon({ name, size = 48 }: { name: string; size?: number }) {
    const Icon = ICON_MAP[name];
    if (!Icon) return null;
    return <Icon width={size} height={size} />;
}
