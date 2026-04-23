# Gemini CLI - Project Guidelines (chvweb-2)

Este archivo establece las reglas y estándares para el desarrollo del proyecto **chvweb-2**. Estas instrucciones son prioritarias para el agente.

## 📺 Contexto del Proyecto
- **Naturaleza:** Aplicación web de streaming gratuito para un canal de televisión.
- **Arquitectura:** Totalmente dependiente de APIs externas para Autenticación, Catálogo, Programas y Capítulos.
- **Dinamismo:** La aplicación es multi-cliente. Los colores y configuración se obtienen dinámicamente al iniciar.

## 🎨 Tematización y Estilos (Crítico)
La aplicación obtiene colores corporativos de una API al inicio y los inyecta en el `:root` del DOM. **Es obligatorio usar estas variables CSS** en lugar de colores hardcodeados o clases estándar de Tailwind cuando se trate de elementos de marca.

### Variables CSS Disponibles:
- `--clr-primary`, `--clr-primary-title`, `--clr-primary-subtitle`, `--clr-primary-text`: Fondo y textos principales.
- `--clr-secondary`, `--clr-secondary-title`, `--clr-secondary-text`: Fondos y textos secundarios.
- `--clr-secondary-button`, `--clr-text-primary-button`: Estilos de botones principales.
- `--clr-text-tertiary-button`: Texto para botones de tercer nivel.
- `--clr-icon`: Color para iconos vectoriales.
- `--foc-primary`: Color para estados de focus/selección (crítico para navegación con control remoto/teclado).
- `--grad-sidebar`: Gradiente o color para la barra lateral.

### Integración con Tailwind:
Al crear componentes, usa las variables de la siguiente forma:
`className="bg-[var(--clr-primary)] text-[var(--clr-primary-text)]"` o mediante la configuración de Tailwind si ya están mapeadas.

## 🛠 Stack Tecnológico
- **Frontend:** React 19 (TypeScript), Vite 8.
- **Estilos:** Tailwind CSS 4 (usando `@tailwindcss/vite`).
- **Estado:** Zustand 5.
- **Routing:** React Router 7.
- **Data Fetching:** TanStack Query v5 + Axios.
- **Video:** hls.js, glomex VAST player.

## 📏 Reglas de Desarrollo

### 1. TypeScript e Interfaces
- **Obligatorio:** Definir interfaces para toda respuesta de API en `src/interfaces/`.
- Evitar el uso de `any`. Usar tipos específicos.

### 2. Servicios y API
- Las llamadas a la API deben residir en `src/services/`.
- Utilizar `qs.stringify` para serializar los cuerpos de las peticiones POST (Content-Type: application/x-www-form-urlencoded).

### 3. Componentes y Hooks
- Actuar como un **Experto en Programación Web**.
- Los componentes de video deben manejar correctamente el ciclo de vida y la limpieza de memoria.
- Extraer la lógica de negocio a hooks personalizados en `src/hooks/`.

### 4. Validación
- Antes de finalizar, verificar:
  1. No hay errores de TypeScript (`tsc`).
  2. El linting pasa (`npm run lint`).
  3. El uso de colores respeta las variables CSS dinámicas para asegurar la compatibilidad con el branding del cliente.
