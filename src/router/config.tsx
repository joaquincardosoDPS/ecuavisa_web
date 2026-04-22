import { Navigate, type RouteObject } from "react-router-dom";
import HomeView from "@/pages/Home/HomeView";
import MainLayout from "@/layout/MainLayout";
import SearchView from "@/pages/Search/SearchView";
import ProgramsView from "@/pages/Programs/ProgramsView";
import ProgramView from "@/pages/Program/ProgramView";
import PlayerView from "@/pages/Player/PlayerView";

export const APP_ROUTES: RouteObject[] = [
    {
        id: "root",
        element: <MainLayout />,
        children: [
            { index: true, element: <Navigate to="/home" replace /> },
            { path: "home", element: <HomeView /> },
            { path: "buscar", element: <SearchView /> },
            { path: "programas", element: <ProgramsView /> },
            { path: "programas/:slug", element: <ProgramView /> },
            { path: "en-vivo", element: <div>En vivo</div> },
            { path: "favoritos", element: <div>Favoritos</div> }
        ]
    },
    {
        path: "play/:segment/:season/:chapter",
        element: <PlayerView />,
    },
];
