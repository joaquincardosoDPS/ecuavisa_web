import { createBrowserRouter } from "react-router-dom";
import { APP_ROUTES } from "./config";
import { BASENAME } from "@/config-global";

export const appRouter = createBrowserRouter(APP_ROUTES, {
    basename: BASENAME
});