export const RUDO_CDN_URL = 'https://cdn.rudo.video';
export const RUDO_API_URL = 'https://consumers.rudo.video/categories/all';
export const RUDO_BASE_USER = 'https://consumers.rudo.video/users'

/**
 * Detección del cliente multi-fuente (orden de prioridad):
 * 1. Query param en la URL principal:  ?client=latina
 * 2. Query param dentro del hash:      #/home?client=latina
 * 3. Valor previamente guardado en localStorage
 * 4. Fallback:                         'dps'
 */
const LS_CLIENT_KEY = 'app_client';
const LS_VERSION_KEY = 'app_client_v';
const LS_CURRENT_VERSION = '2'; // Bump to invalidate stale LS values

// Limpia valores viejos de localStorage cuando cambia la versión
if (localStorage.getItem(LS_VERSION_KEY) !== LS_CURRENT_VERSION) {
  localStorage.removeItem(LS_CLIENT_KEY);
  localStorage.setItem(LS_VERSION_KEY, LS_CURRENT_VERSION);
}

function resolveClient(): string {
  // let resolved: string | null = null;

  // // 1. ?client= en la URL real (antes del #)
  // resolved = new URLSearchParams(window.location.search).get('client');
  // if (resolved) {
  //   localStorage.setItem(LS_CLIENT_KEY, resolved);
  //   return resolved;
  // }

  // // 2. ?client= dentro del hash (después del #)
  // const hashParts = window.location.hash.split('?');
  // if (hashParts.length > 1) {
  //   resolved = new URLSearchParams(hashParts[1]).get('client');
  //   if (resolved) {
  //     localStorage.setItem(LS_CLIENT_KEY, resolved);
  //     return resolved;
  //   }
  // }

  // // 3. Valor guardado en localStorage
  // const fromStorage = localStorage.getItem(LS_CLIENT_KEY);
  // if (fromStorage) return fromStorage;

  // 4. Fallback
  return 'chv';
}

export const CLIENT = resolveClient();
export const BASENAME = import.meta.env.BASE_URL.replace(/\/+$/, '') || '/';

export const ADS_FALLBACK_DOMAIN = 'https://www.michv.cl';

// Social Login Configuration - These will be loaded from API
export const GOOGLE_CLIENT_ID = 'https://consumers.rudo.video/users/login_rrss'; // Will be loaded from API configuration  
export const APPLE_CLIENT_ID = 'https://consumers.rudo.video/users/login_rrss'; // Will be loaded from API configuration

//----- USER RUDO -----//

export const RUDO_DEVICE_CODE_URL = `${RUDO_BASE_USER}/device_code`
export const RUDO_DEVICE_VERIFY_URL = `${RUDO_BASE_USER}/device_verify`
export const RUDO_DEVICE_PAIR_URL = `${RUDO_BASE_USER}/device_pair`

//export const RUDO_PLAYLIST_URL = `${RUDO_CDN_URL}/assets/${CLIENT}/playlists/static/playlist.json`;

export const RUDO_PLAYLIST_PREMIUM_URL = `${RUDO_CDN_URL}/assets/${CLIENT}/playlists/static/playlist_premium.json`;

export const RUDO_PLAYLIST_GLOBAL_EPG_URL = `${RUDO_CDN_URL}/assets/${CLIENT}/playlists/global_epg.json`;

// Servicios ----

// Categorias
export const RUDO_VOD_CATEGORY = `https://consumers.rudo.video/categories/all`; // Permite ver todas las categorias - vod category
// Capitulos
export const RUDO_VOD_CHAPTERS = `https://consumers.rudo.video/chapters/all`; //  Permite ver todos los capitulos de un programa
// Detalle - Segment Button
export const RUDO_VOD_DETAIL = `https://consumers.rudo.video/programs/get`; // Permite ver detalle de los programas - componente segment button
// Buscador
export const RUDO_VOD_SEARCH = `https://consumers.rudo.video/programs/all`; // Permite ver todos los programas - buscador
// Destacados 
export const RUDO_VOD_FEATURED = `https://consumers.rudo.video/programs/recommended`; // Permite ver todos lo destacados - vod featured
// Banner
export const RUDO_VOD_BANNER = `https://consumers.rudo.video/programs/slider`; // Permite ver todos lo destacados - vod featured

// Perfiles  ----
export const RUDO_PROFILE = `https://consumers.rudo.video/profile/all` // Permite ver todos los perfiles - profiles all
// Perfiles - Editar
export const RUDO_PROFILE_UPDATE = `https://consumers.rudo.video/profile/update`; // Endpoint to update profiles
// Perfiles - Crear
export const RUDO_PROFILE_CREATE = `https://consumers.rudo.video/profile/add` // Permite crear un perfil - profiles create
// Perfiles - Eliminar
export const RUDO_PROFILE_DELETE = `https://consumers.rudo.video/profile/delete` // Permite eliminar un perfil - profiles delete
// Perfiles - Avatars
export const RUDO_PROFILE_AVATAR = `https://consumers.rudo.video/avatar/all` // Permite ver todos los avatares - profiles avatars
// Time Line
export const RUDO_VOD_TIME_LINE = `https://consumers.rudo.video/history/get` // Permite ver el timeline de un programa - vod time line
// Proximo Capitulo
export const RUDO_VOD_NEXT_CHAPTER = `https://consumers.rudo.video/chapters/get` // Permite ver el proximo capitulo de un programa - vod next chapter

// Publicidad ----
export const RUDO_VOD_ADS = `https://rudo.video/ads/vmap/vod` // Permite consultar la publicidad de un capítulo VOD

// Historial ----
export const RUDO_VOD_HISTORY = `https://consumers.rudo.video/history/all` // Permite ver el historial de reproduccion - vod history
// Tiempo de reproduccion
export const RUDO_VOD_TIME = `https://consumers.rudo.video/history/add` // Permite guardar el momento en el que se dejo de ver un capitulo - vod time
// Sessión
export const RUDO_SESSION = `https://consumers.rudo.video/users/session` // Permite ver la información de la sessión

// Configuración ----
export const RUDO_CONFIG = `https://consumers.rudo.video/config/all` // Permite modificar la configuración de la app - config all

// Registro
export const RUDO_REGISTER = `https://consumers.rudo.video/users/register` // Permite registrar un nuevo usuario - register

// Login
export const RUDO_LOGIN = `https://consumers.rudo.video/users/login` // Permite iniciar sessión - login

// Reset
export const RUDO_RESET_PASSWORD = `https://consumers.rudo.video/users/reset` // Permite rconseguir el codigo de recuperación - recovery

// Cambiar contraseña
export const RUDO_CHANGE_PASSWORD = `https://consumers.rudo.video/users/password` // Permite cambiar la contraseña - change password

// Login - RSS
export const RUDO_LOGIN_RSS = `https://consumers.rudo.video/users/login_rrss` // Permite iniciar sessión con rrss - login rrss

// Favoritos ----
export const RUDO_FAVORITES_ALL = `https://consumers.rudo.video/favorites/all` // Permite ver todos los favoritos
export const RUDO_FAVORITES_ADD = `https://consumers.rudo.video/favorites/add` // Permite agregar un favorito
export const RUDO_FAVORITES_VALIDATE = `https://consumers.rudo.video/favorites/validate` // Permite validar si un programa esta en favoritos
export const RUDO_FAVORITES_DELETE = `https://consumers.rudo.video/favorites/delete` // Permite eliminar un favorito

// Events
export const RUDO_EVENT_ALL = `https://consumers.rudo.video/events/all` // Permite ver todos los eventos
export const RUDO_EVENT_GET = `https://consumers.rudo.video/events/get` // Permite ver el detalle de un evento - event get
