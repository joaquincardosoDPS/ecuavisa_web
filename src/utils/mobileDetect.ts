/**
 * Detecta el sistema operativo móvil del usuario.
 * Retorna 'android', 'ios', o 'unknown'.
 */
export function getMobileOS(): 'android' | 'ios' | 'unknown' {
  const ua = navigator.userAgent;

  // iOS: iPhone, iPad, iPod
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';

  // iPadOS 13+ se identifica como "Macintosh" pero tiene touch
  if (
    ua.includes('Mac') &&
    'maxTouchPoints' in navigator &&
    navigator.maxTouchPoints > 2
  ) {
    return 'ios';
  }

  // Android
  if (/Android/i.test(ua)) return 'android';

  return 'unknown';
}

/**
 * Asegura que una URL tenga protocolo (https://).
 * Las URLs de la API pueden venir sin protocolo (ej: "play.google.com/...").
 */
function ensureAbsoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

/**
 * Redirige al store correspondiente según el OS detectado.
 * Retorna `true` si se inició la redirección, `false` si no hay URL disponible.
 */
export function redirectToStore(
  androidLink?: string,
  iosLink?: string
): boolean {
  const os = getMobileOS();

  if (os === 'android' && androidLink) {
    window.location.replace(ensureAbsoluteUrl(androidLink));
    return true;
  }

  if (os === 'ios' && iosLink) {
    window.location.replace(ensureAbsoluteUrl(iosLink));
    return true;
  }

  return false;
}
