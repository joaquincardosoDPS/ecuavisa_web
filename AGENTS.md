# Reglamento Maestro — EcuavisaWeb

Este documento es la **fuente única de verdad** del proyecto **ecuavisaweb**. Consolida y reemplaza a `GEMINI.md`, `.agents/rules/*.md` y `VIDEO_PLAYER_GUIDE.md`. Ante cualquier conflicto, estas reglas prevalecen.

---

## 1. Contexto del Proyecto

- **Naturaleza:** Aplicación web de streaming gratuito estilo "Netflix" para un canal de televisión.
- **Arquitectura:** Totalmente dependiente de APIs externas (backend **Rudo**) para Autenticación, Catálogo, Programas, Capítulos, Configuración y Publicidad.
- **Dinamismo:** La app es **multi-cliente**. Los colores, tipografías y configuración se obtienen dinámicamente de la API al iniciar y se inyectan en el `:root` del DOM (ver `src/utils/applyConfigToCSS.ts`). El cliente activo se define en `src/config-global.ts` (`CLIENT`).

## 2. Stack Tecnológico Obligatorio

| Área | Tecnología |
| :--- | :--- |
| Frontend | React 19 (TypeScript estricto, **React Compiler activo**) |
| Build | Vite 8 |
| Estilos | Tailwind CSS 4 (plugin `@tailwindcss/vite`) |
| Estado global | Zustand 5 |
| Routing | React Router 7 |
| Data fetching / caché | TanStack Query v5 + Axios |
| Clases dinámicas | `clsx` + `tailwind-merge` (utilidad `cn` en `src/utils/cn.ts`) |
| Video | `hls.js`, `@glomex/vast-ima-player` (IMA SDK) |
| Otros | `qs`, `he` (decode HTML), `embla-carousel-react` |

**Versiones y scripts** en `package.json`: `dev`, `build` (`tsc -b && vite build`), `lint` (`eslint .`), `preview`.

## 3. Estructura de Carpetas Obligatoria

No crear carpetas fuera de este árbol salvo pedido explícito:

```
├── public
└── src
    ├── assets       (Imágenes, fuentes, iconos estáticos)
    ├── components   (Componentes reutilizables UI: botones, tarjetas, carruseles, reproductores)
    ├── contexts     (Contextos nativos de React, solo si son estrictamente necesarios)
    ├── features     (Agrupación por dominio/módulo: auth, config, profiles, programs)
    ├── hooks        (Custom hooks genéricos y por dominio)
    ├── interfaces   (Tipos e interfaces TypeScript globales)
    ├── layout       (Estructura de página: header, sidebar)
    ├── pages        (Vistas enrutadas, con subcarpeta `components/` para sus componentes privados)
    ├── router       (Configuración de React Router)
    ├── services     (Llamadas a la API, configuración de Axios)
    └── utils        (Formateadores, helpers, parseo, `cn`, config de CSS)
```

- **Convención de módulos grandes:** los componentes con lógica propia (ej. `VideoPlayer`) agrupan en su carpeta: orquestador `.tsx` + subcarpetas `hooks/`, `UI/`, `types/`, `ads/`.
- **Alias de importación:** usar `@/` para rutas dentro de `src` (ej. `@/config-global`, `@/services/api`).

## 4. Tematización y Estilos (Crítico)

La API inyecta colores corporativos en el `:root`. **Es obligatorio** usar las variables CSS en lugar de colores hardcodeados para todo elemento de marca.

### Variables de color disponibles

```
--clr-edit, --clr-icon, --clr-primary, --clr-primary-button,
--clr-primary-subtitle, --clr-primary-text, --clr-primary-title,
--clr-secondary, --clr-secondary-button, --clr-secondary-subtitle,
--clr-secondary-text, --clr-secondary-title,
--clr-text-primary-button, --clr-text-secondary-button, --clr-text-tertiary-button,
--foc-primary, --foc-secondary, --foc-tertiary,
--grad-banner, --grad-sidebar
```

### Cómo usarlas

- **Tailwind 4 (preferido):** la configuración en `@theme` (ver `src/index.css`) mapea tokens de marca:
  - `bg-brand-primary` → `--clr-primary`
  - `bg-brand-secondary` → `--clr-secondary`
  - `bg-brand-accent` → `--clr-secondary-button`
  - `text-brand-focus` / foco → `--foc-primary`
  - Tipografía: `font-title`, `font-subtitle`, `font-text`, `font-button`; tamaños `text-title`, `text-subtitle`, `text-base-app`
  - Radios: `rounded-brand-pill`, `rounded-brand-card`
- **Alternativa con arbitrary values:** `bg-[var(--clr-primary)]`, `text-[var(--clr-primary-text)]`.
- **Estilos en línea** (`style={{ backgroundColor: apiColor }}`) solo para valores dinámicos que Tailwind no puede compilar.
- `--foc-primary` es crítico para el estado de focus/teclado (navegación con control remoto: outline + `--shadow-primary`).
- Existen valores de fallback en `:root` (en `src/index.css`) para evitar errores antes de la carga de la API.
- Fuente base: **Gotham** (OTF locales, pesos 400/700/900), fallback Arial/Helvetica.

### Regla de clases dinámicas

Tailwind **no compila clases generadas en runtime** (ej. `bg-[${apiColor}]`). Para estilos dinámicos usar variables CSS nativas o estilos en línea. Clases condicionales: combinar con `cn()` (`clsx` + `tailwind-merge`).

## 5. Reglas de TypeScript e Interfaces

- **Obligatorio:** definir interfaces para toda respuesta de API en `src/interfaces/` (patrón existente: `catalog.interface.ts`, `config.interface.ts`, `profile.interface.ts`, `vod.ts`, etc.).
- Prohibido `any`. Usar tipos específicos; para extensiones desconocidas usar `[key: string]: unknown`.
- Tipado estricto: el build ejecuta `tsc -b`; debe pasar sin errores.

## 6. Servicios y API

- Todas las llamadas a la API viven en `src/services/`, expuestas como objetos de servicio (`authService`, `catalogService`, etc.).
- Usar **siempre** la instancia Axios compartida `src/services/api.ts` (no crear instancias nuevas). Esta instancia:
  - Define `Content-Type: application/x-www-form-urlencoded`.
  - Inyecta automáticamente `client` y `_t` (cache-buster) en cada POST vía interceptor, serializando con `qs.stringify`.
- Los endpoints se declaran en `src/config-global.ts` como constantes `RUDO_*`; **no hardcodear URLs** en servicios.
- La API responde con estructura `{ status, code, msj, ... }` — manejar `status: 'error'` y el campo `msj` en los flujos de UI.

## 7. Estado y Datos

### TanStack Query (datos del servidor)
- TODO fetching, caché, reintentos y estados de carga de la API con TanStack Query.
- Funciones asíncronas puras en `services/`; hooks de Query/Mutation en `hooks/` o `features/`.
- Siempre exponer `isLoading` e `isError` a la interfaz.

### Zustand (estado de cliente)
- Zustand ÚNICAMENTE para estado global del cliente: sesión, perfil activo, volumen del reproductor, modales, drafts. **Nunca** para datos de API que pertenecen a la caché de Query.
- Usar selectores específicos al consumir la store para evitar re-renders innecesarios.
- Las stores viven en `src/features/<dominio>/` (ej. `authStore.ts`, `useConfigStore.ts`, `profileDraftStore.ts`, `programsStore.ts`).

### React Compiler First
- Escribir "Plain Old JavaScript" para React. **NO** usar `useMemo`, `useCallback` ni `React.memo` salvo justificación técnica explícita de que el compilador no puede resolver ese caso.

## 8. Componentes y Hooks

- Actuar como **Experto en Programación Web / Arquitecto de Software Frontend**.
- Extraer la lógica de negocio a hooks personalizados en `src/hooks/`.
- Los componentes de video deben manejar correctamente el ciclo de vida y la **limpieza de memoria** (destroy de HLS, remover listeners de ads al desmontar).
- Páginas: componentes privados en `src/pages/<Pagina>/components/`.

## 9. Límites de Modificación

- Modificar EXCLUSIVAMENTE el código solicitado. No refactorizar, eliminar ni alterar código no relacionado con la tarea actual.
- No modificar `package.json` / dependencias sin pedido explícito.

## 10. Reglas de Lint

- ESLint configurado en `eslint.config.js` (flat config: `@eslint/js`, `typescript-eslint`, `react-hooks` con reglas compatibles con React Compiler, `react-refresh`).
- Reglas relajadas a propósito para React Compiler: `react-hooks/set-state-in-effect`, `refs`, `immutability` en `off`. No reintroducir `useMemo`/`useCallback` para "arreglar" lint; el compilador los maneja.

## 11. Validación Antes de Finalizar (Checklist Obligatorio)

1. No hay errores de TypeScript: `npm run build` (ejecuta `tsc -b`) o `npx tsc -b`.
2. El linting pasa: `npm run lint`.
3. Los colores respetan las variables CSS dinámicas (sección 4) — compatible con el branding multi-cliente.
4. No se introdujeron llamadas a API fuera de `services/` ni endpoints hardcodeados.
5. Los componentes de video limpian sus recursos al desmontarse.

## 12. Formato de Respuesta

- Entregar el código en bloques limpios de TypeScript (`tsx`/`ts`).
- Explicar brevemente qué se cambió o creó.
- Cerrar con una sección breve **"💡 Sugerencia Experta"**: una (1) mejora específica de arquitectura, accesibilidad o rendimiento.

## 13. Guía del Componente VideoPlayer

Ubicación: `src/components/VideoPlayer/` (`VideoPlayer.tsx` + `hooks/`, `ads/`, `UI/`, `types/`). Basado en `hls.js` (HLS) e IMA SDK (`@glomex/vast-ima-player`) para VAST/VMAP.

- **Props clave:** `src` (`.m3u8`, requerido), `title` (requerido), `description`, `isLive` (desactiva seekbar), `vastUrl`, `autoplay` (default `true`), `onBack`, `initialSeconds`, `episodes`/`currentEpisodeKey`/`onEpisodeSelect` (menú de capítulos + transición de fin), `programBackgroundImage`.
- **Limpieza:** destruir objeto HLS y listeners de anuncios al desmontar.
- **Atajos de teclado:** Espacio/Enter = Play/Pause; ←/→ = seek (hold-to-seek); ↑/↓ = volumen; ESC/Backspace = volver.
- **Publicidad:** si hay `vastUrl`, cargar el anuncio antes del contenido principal.
- **Theming:** usa las variables CSS de la sección 4.

## 14. Notas de Configuración y Dominio

- **Cliente:** `CLIENT` en `src/config-global.ts` (actualmente `'latina'`). Backend Rudo en `https://consumers.rudo.video` y CDN en `https://cdn.rudo.video`.
- **Sesión en localStorage:** claves `auth_token`, `auth_user`, `active_profile`, `last_profile_<userId>`, `app_client`, `app_client_v`.
- **Advertising:** ads VOD vía `RUDO_VOD_ADS` (VMAP en `https://rudo.video/ads/vmap/vod`); dominio de fallback `ADS_FALLBACK_DOMAIN`.
- **EPG/Señal en vivo:** variables CSS dedicadas `--epg-*` ya definidas en `src/index.css`.
- **Utilidades existentes que reutilizar antes de crear nuevas:** `cn`, `formatDate`, `formatDuration`, `vmapParser`, `applyConfigToCSS`, `volumeStorage`, `mobileDetect`, `useDebounce`, `useInfiniteScroll`, `useImagePreloader`, `useIsMobile`, `useDocumentTitle`, `useGoogleAnalytics`, `useAppInitilization`.
