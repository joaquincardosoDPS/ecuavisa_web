import { Navigate, type RouteObject } from "react-router-dom";
import HomeView from "@/pages/Home/HomeView";
import MainLayout from "@/layout/MainLayout";
import SearchView from "@/pages/Search/SearchView";

export const APP_ROUTES: RouteObject[] = [
    {
        id: "root",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/home" replace />
            },
            {
                path: "home",
                element: <HomeView />
            },
            {
                path: "buscar",
                element: <SearchView />
            },
            {
                path: "programas",
                element: <div>Programas</div>
            },
            {
                path: "en-vivo",
                element: <div>En vivo</div>
            },
            {
                path: "favoritos",
                element: <div>Favoritos</div>
            }
        ]
    }
];
