# Guía de Implementación: Componente VideoPlayer

El componente `VideoPlayer` es un reproductor de video de alto rendimiento basado en **Hls.js** para streaming HLS y el **IMA SDK de Google** para la gestión de publicidad (VAST/VMAP). Está diseñado para ser modular, encapsulado y fácil de portar a otros proyectos React.

## 🚀 Requisitos Previos

Para utilizar este componente en un nuevo proyecto, asegúrate de instalar las siguientes dependencias:

```bash
npm install hls.js @glomex/vast-ima-player axios he
```

## 📂 Estructura del Módulo

El componente se encuentra en `src/components/VideoPlayer` y tiene la siguiente estructura:

*   `VideoPlayer.tsx`: Orquestador principal del reproductor.
*   `hooks/`: Lógica separada para HLS, Ads y Analytics.
*   `ads/`: Integración con el IMA SDK para publicidad.
*   `UI/`: Componentes de interfaz (Seekbar, botones, barras de control).
*   `types/`: Definiciones de interfaces de TypeScript.

## 🛠️ Props del Componente (`VideoPlayerProps`)

| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `src` | `string` | **Requerido.** URL del manifiesto `.m3u8`. |
| `title` | `string` | **Requerido.** Título principal que aparece en la barra superior. |
| `description` | `string` | Descripción o subtítulo (ej: "Temporada 1: Episodio 5"). |
| `isLive` | `boolean` | Define si el contenido es una señal en vivo (desactiva seekbar). |
| `vastUrl` | `string` | URL de la publicidad VAST/VMAP. |
| `autoplay` | `boolean` | Inicia la reproducción automáticamente (por defecto `true`). |
| `onBack` | `function` | Callback para la acción del botón "Volver". |
| `initialSeconds` | `number` | Punto de inicio de la reproducción en segundos. |
| `episodes` | `Chapter[]` | Lista de capítulos para habilitar el menú lateral y la transición de fin de video. |
| `currentEpisodeKey` | `string` | Identificador del capítulo actual. |
| `onEpisodeSelect` | `function` | Callback cuando el usuario selecciona otro capítulo. |
| `programBackgroundImage` | `string` | Imagen de fondo para la transición de "Siguiente capítulo". |

## 📖 Ejemplo de Uso

### 1. Implementación Básica (VOD)

```tsx
import { VideoPlayer } from '@/components/VideoPlayer';

function MyPlayerPage() {
  const handleBack = () => window.history.back();

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <VideoPlayer
        src="https://ejemplo.com/video/playlist.m3u8"
        title="Mi Gran Programa"
        description="Capítulo 10"
        onBack={handleBack}
      />
    </div>
  );
}
```

### 2. Implementación con Publicidad y Siguiente Capítulo

```tsx
<VideoPlayer
  src={videoUrl}
  title="Título del Programa"
  vastUrl="https://pubads.g.doubleclick.net/..." // URL VAST
  episodes={listaDeCapitulos}
  currentEpisodeKey="cap-101"
  programBackgroundImage="/path/to/background.jpg"
  onEpisodeSelect={(nextEp) => navigate(`/play/${nextEp.slug}`)}
  onBack={() => navigate(-1)}
/>
```

## 🎨 Personalización (Theming)

El componente utiliza variables CSS globales para mantener la consistencia visual. Puedes personalizarlas en tu archivo `index.css`:

```css
:root {
  --clr-primary: #001a28;            /* Color de fondo principal */
  --foc-primary: #ff1376;            /* Color de acento/foco (botones, progress bar) */
  --clr-secondary-button: #FA6428;   /* Color del botón "Reproducir ahora" */
}
```

## 💡 Notas Técnicas

1.  **Gestión de Memoria:** El componente realiza una limpieza automática del objeto HLS y de los listeners de los anuncios al desmontarse.
2.  **Atajos de Teclado:**
    *   `Espacio / Enter`: Play / Pause.
    *   `Flechas Izq / Der`: Avance/Retroceso rápido (Hold-to-seek).
    *   `Flechas Arriba / Abajo`: Control de volumen.
    *   `ESC / Backspace`: Acción de volver.
3.  **Publicidad:** Si se provee una `vastUrl`, el reproductor priorizará la carga del anuncio antes de iniciar el contenido principal.
