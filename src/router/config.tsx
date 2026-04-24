import { Navigate, type RouteObject } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import ProtectedRoute from "@/router/ProtectedRoute";
import HomeView from "@/pages/Home/HomeView";
import SearchView from "@/pages/Search/SearchView";
import ProgramsView from "@/pages/Programs/ProgramsView";
import ProgramView from "@/pages/Program/ProgramView";
import PlayerView from "@/pages/Player/PlayerView";
import LoginView from "@/pages/Auth/LoginView";
import RegisterView from "@/pages/Auth/RegisterView";
import ProfilesView from "@/pages/Profiles/ProfilesView";
import EditProfileView from "@/pages/Profiles/EditProfileView";

export const APP_ROUTES: RouteObject[] = [
  {
    path: "auth",
    children: [
      { path: "login", element: <LoginView /> },
      { path: "registro", element: <RegisterView /> },
    ],
  },
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
      { path: "favoritos", element: <div>Favoritos</div> },
    ],
  },
  {
    path: "play/:segment/:season/:chapter",
    element: <PlayerView />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "perfiles", element: <ProfilesView /> },
      { path: "perfiles/:id", element: <EditProfileView /> },
    ],
  },
];
