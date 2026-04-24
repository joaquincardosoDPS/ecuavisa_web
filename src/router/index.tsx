import { createHashRouter } from "react-router-dom";
import { APP_ROUTES } from "./config";

export const appRouter = createHashRouter(APP_ROUTES);