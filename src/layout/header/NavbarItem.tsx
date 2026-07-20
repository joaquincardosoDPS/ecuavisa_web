import { useNavigate, useLocation } from 'react-router-dom';
import type { NavbarItemConfig } from './constants';
import { SidebarIcon } from './SidebarIcons';

interface NavbarItemProps {
    item: NavbarItemConfig;
}

export function NavbarItem({
    item,
}: NavbarItemProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = item.path === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(item.path);

    const handleSelect = () => {
        navigate(item.path, { replace: true });
    };


    const baseClasses = [
        'flex items-center h-10 px-4 rounded-full',
        'transition-all duration-200',
        'cursor-pointer whitespace-nowrap',
        'text-[1rem] font-normal',
    ].join(' ');

    const stateClasses = isActive
        ? 'bg-white/20 text-(--clr-primary-title) border border-(--clr-primary-title)/40 opacity-100'
        : 'text-(--clr-primary-title) opacity-70 hover:opacity-100 hover:bg-(--clr-primary-title)/10';

    return (
        <li
            className={`${baseClasses} ${stateClasses}`}
            onClick={handleSelect}
        >
            <span className='flex items-center justify-center mr-2 rounded-md' style={{ width: '1.375rem', height: '1.375rem' }}>
                <SidebarIcon name={item.icon} size={22} />
            </span>
            <span className=''>{item.title}</span>
        </li>
    );
}
