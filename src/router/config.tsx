import { Navigate, type RouteObject } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import ProtectedRoute from "@/router/ProtectedRoute";
import HomeView from "@/pages/Home/HomeView";
import SearchView from "@/pages/Search/SearchView";
import ProgramsView from "@/pages/Programs/ProgramsView";
import ProgramPage from "@/pages/Program/index";
import PlayerView from "@/pages/Player/PlayerView";
import LoginView from "@/pages/Auth/LoginView";
import RegisterView from "@/pages/Auth/RegisterView";
import ProfilesView from "@/pages/Profiles/ProfilesView";
import EditProfileView from "@/pages/Profiles/EditProfileView";
import MyListView from "@/pages/MyList/MyListView";
import CategoryView from "@/pages/Category/CategoryView";
import MyAccountView from "@/pages/MyAccount/MyAccountView";
import LiveView from "@/pages/Live/LiveView";
import EventView from "@/pages/Event/EventView";
import NotFoundView from "@/pages/Error/NotFoundView";

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
      { path: "programas/:slug", element: <ProgramPage /> },
      { path: "categoria/:slug", element: <CategoryView /> },
      { path: "eventos/:slug", element: <EventView /> },
      { path: "en-vivo", element: <LiveView /> },
      { path: "mi-lista", element: <MyListView /> },
      { path: "*", element: <NotFoundView /> },
    ],
  },
  {
    path: "play/:segment/:season/:chapter",
    element: <PlayerView />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "cuenta", element: <MyAccountView /> },
      { path: "perfiles", element: <ProfilesView /> },
      { path: "perfiles/:id", element: <EditProfileView /> },
    ],
  },
  {
    path: "*",
    element: <MainLayout />,
    children: [{ path: "*", element: <NotFoundView /> }],
  },
];
