# 🔄 Revertir cambios de build para file://

> Estos cambios se hicieron para que el `dist/index.html` funcione abriendo directamente desde el explorador de archivos (`file://` protocol), **solo para revisión interna**.
> Cuando se despliegue en un servidor real (nginx, Vercel, etc.), se deben revertir.

---

## 1. `src/router/index.tsx` — Volver a BrowserRouter

```diff
- import { createHashRouter } from "react-router-dom";
- import { APP_ROUTES } from "./config";
-
- export const appRouter = createHashRouter(APP_ROUTES);

+ import { createBrowserRouter } from "react-router-dom";
+ import { APP_ROUTES } from "./config";
+ import { BASENAME } from "@/config-global";
+
+ export const appRouter = createBrowserRouter(APP_ROUTES, {
+     basename: BASENAME
+ });
```

## 2. `src/router/config.tsx` — Restaurar lazy loading

Cambiar los imports directos por `React.lazy()`:

```tsx
import { lazy, Suspense } from "react";

const HomeView = lazy(() => import("@/pages/Home/HomeView"));
const SearchView = lazy(() => import("@/pages/Search/SearchView"));
const ProgramsView = lazy(() => import("@/pages/Programs/ProgramsView"));
const ProgramView = lazy(() => import("@/pages/Program/ProgramView"));
const PlayerView = lazy(() => import("@/pages/Player/PlayerView"));
const LoginView = lazy(() => import("@/pages/Auth/LoginView"));
const RegisterView = lazy(() => import("@/pages/Auth/RegisterView"));
const ProfilesView = lazy(() => import("@/pages/Profiles/ProfilesView"));
const EditProfileView = lazy(() => import("@/pages/Profiles/EditProfileView"));
```

Y envolver cada `element` con `<Suspense>`:
```tsx
{ path: "home", element: <Suspense fallback={<FullScreenSpinner message="" />}><HomeView /></Suspense> }
```

## 3. `vite.config.ts` — Quitar legacy plugin y restaurar code splitting

```diff
- import legacy from '@vitejs/plugin-legacy'

  export default defineConfig({
-   base: './',
    plugins: [
      tailwindcss(),
      react(),
      babel({ presets: [reactCompilerPreset()] }),
-     legacy({
-       targets: ['chrome >= 30'],
-       additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
-       modernPolyfills: true,
-       renderLegacyChunks: true,
-     }),
    ],
-   build: {
-     rolldownOptions: {
-       output: { codeSplitting: false }
-     }
-   }
  })
```

## 4. `src/config-global.ts` — Quitar fallback 'chv' y file:// check

```diff
- const client = new URLSearchParams(window.location.search).get('client')
-     || (location.protocol !== 'file:' ? window.location.pathname.split('/')[2] : '')
-     || '';
- export const CLIENT = client || 'chv';

+ const client = new URLSearchParams(window.location.search).get('client') || window.location.pathname.split('/')[2];
+ export const CLIENT = client || '';
```

## 5. `package.json` — Quitar postbuild patch

```diff
- "build": "tsc -b && vite build && node -e \"...patch...\""
+ "build": "tsc -b && vite build"
```

## 6. Desinstalar dependencias de legacy

```bash
npm uninstall @vitejs/plugin-legacy terser
```

---

> **Nota:** Los fixes de TypeScript (unused imports, optional chaining, `@types/he`, `ignoreDeprecations`) son mejoras reales y **NO se deben revertir**.
