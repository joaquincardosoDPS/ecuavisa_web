/* eslint-disable react-refresh/only-export-components */
import { Navigate, type RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "@/layout/MainLayout";
import { AnalyticsWrapper } from "@/layout/AnalyticsWrapper";
// import ProtectedRoute from "@/router/ProtectedRoute";
import { FullScreenSpinner } from "@/components/ui/FullScreenSpinner";

const HomeView = lazy(() => import("@/pages/Home/HomeView"));
const SearchView = lazy(() => import("@/pages/Search/SearchView"));
const ProgramsView = lazy(() => import("@/pages/Programs/ProgramsView"));
const ProgramPage = lazy(() => import("@/pages/Program/index"));
const PlayerView = lazy(() => import("@/pages/Player/PlayerView"));
const LoginView = lazy(() => import("@/pages/Auth/LoginView"));
const RegisterView = lazy(() => import("@/pages/Auth/RegisterView"));
const SelectProfileView = lazy(() => import("@/pages/Auth/SelectProfileView"));
const ProfilesView = lazy(() => import("@/pages/Profiles/ProfilesView"));
const EditProfileView = lazy(() => import("@/pages/Profiles/EditProfileView"));
const SelectAvatarView = lazy(() => import("@/pages/Profiles/SelectAvatarView"));
const MyListView = lazy(() => import("@/pages/MyList/MyListView"));
const HistoryView = lazy(() => import("@/pages/History/HistoryView"));
const CategoryView = lazy(() => import("@/pages/Category/CategoryView"));
const MyAccountView = lazy(() => import("@/pages/MyAccount/MyAccountView"));
const LiveView = lazy(() => import("@/pages/Live/LiveView"));
const EventView = lazy(() => import("@/pages/Event/EventView"));
const TVPairView = lazy(() => import("@/pages/TV/TVPairView"));
const NotFoundView = lazy(() => import("@/pages/Error/NotFoundView"));

const Lazy = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<FullScreenSpinner />}>{children}</Suspense>
);

export const APP_ROUTES: RouteObject[] = [
  {
    // Layout raíz para tracking de analytics en todas las rutas
    element: <AnalyticsWrapper />,
    children: [
      {
        path: "auth",
        children: [
          { path: "login", element: <Lazy><LoginView /></Lazy> },
          { path: "registro", element: <Lazy><RegisterView /></Lazy> },
        ],
      },
      {
        // element: <ProtectedRoute />,
        children: [
          { path: "seleccionar-perfil", element: <Lazy><SelectProfileView /></Lazy> },
          {
            id: "root",
            element: <MainLayout />,
            children: [
              { path: "/", element: <Lazy><HomeView /></Lazy> },
              { path: "home", element: <Navigate to="/" replace /> },
              { path: "buscar", element: <Lazy><SearchView /></Lazy> },
              { path: "programas", element: <Lazy><ProgramsView /></Lazy> },
              { path: "programas/:slug", element: <Lazy><ProgramPage /></Lazy> },
              { path: "categoria/:slug", element: <Lazy><CategoryView /></Lazy> },
              { path: "eventos/:slug", element: <Lazy><EventView /></Lazy> },
              { path: "live", element: <Lazy><LiveView /></Lazy> },
              { path: "mi-lista", element: <Lazy><MyListView /></Lazy> },
              { path: "seguir-viendo", element: <Lazy><HistoryView /></Lazy> },
              { path: "mi-ecuavisa", element: <Lazy><MyAccountView /></Lazy> },
              { path: "mi-ecuavisa/perfiles", element: <Lazy><ProfilesView /></Lazy> },
              { path: "mi-ecuavisa/perfiles/:id", element: <Lazy><EditProfileView /></Lazy> },
              { path: "mi-ecuavisa/perfiles/:id/avatars", element: <Lazy><SelectAvatarView /></Lazy> },
              { path: "*", element: <Lazy><NotFoundView /></Lazy> },
            ],
          },
          {
            path: "play/:program/:segment/:season/:chapter",
            element: <Lazy><PlayerView /></Lazy>,
          },
          { path: "tv", element: <Lazy><TVPairView /></Lazy> },
        ],
      },
    ],
  },
];
