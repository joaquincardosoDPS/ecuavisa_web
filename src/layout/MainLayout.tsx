import { Outlet, useLocation } from 'react-router-dom'
import Header from './components/Header'
import { twMerge } from 'tailwind-merge';

function MainLayout() {

    const { pathname } = useLocation();
    const isTransparent = pathname === "/home";

    const headerClasses = (isTransparent: boolean) =>
        twMerge(
            "flex flex-col transition-[padding] duration-300",
            !isTransparent && "pt-[84px]"
        );
    return (
        <div className={twMerge(headerClasses(isTransparent), "min-h-screen")}>
            <Header
                isTransparent={isTransparent}
            />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout