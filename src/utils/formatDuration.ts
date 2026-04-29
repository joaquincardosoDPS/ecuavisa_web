/**
 * Convierte una duración en formato "hh:mm:ss" a formato legible "1h 22m".
 * Si la duración es menor a 1 hora, muestra solo minutos: "45m".
 * Si la duración es menor a 1 minuto, muestra "1m".
 */
export function formatDuration(duration: string): string {
    if (!duration) return '';

    const parts = duration.split(':').map(Number);
    if (parts.length < 2) return '';

    const hours = parts[0] || 0;
    const minutes = parts[1] || 0;

    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return '1m';
}
