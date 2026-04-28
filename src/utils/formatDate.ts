/**
 * Formatea un string de fecha tipo "2026-04-30 19:00:00"
 * a un formato legible en español.
 *
 * @example
 * formatDate("2026-04-30 19:00:00")
 * // → "Miércoles 30 de Abril, 2026"
 *
 * formatDate("2026-04-30 19:00:00", { includeTime: true })
 * // → "Miércoles 30 de Abril, 2026 · 19:00 hrs"
 *
 * formatDate("2026-04-30 19:00:00", { short: true })
 * // → "30 Abr 2026"
 *
 * // Para campos GMT+0 como gmt0_unlocked, convierte a hora local:
 * formatDate("2026-04-30 19:00:00", { utc: true, includeTime: true })
 * // → "Miércoles 30 de Abril, 2026 · 15:00 hrs" (en GMT-4)
 */

interface FormatDateOptions {
  /** Incluir la hora en el resultado (default: false) */
  includeTime?: boolean;
  /** Formato corto: "30 Abr 2026" (default: false) */
  short?: boolean;
  /** Indica que la fecha viene en GMT+0 y debe convertirse a hora local (default: false) */
  utc?: boolean;
}

const DAYS = [
  "Domingo", "Lunes", "Martes", "Miércoles",
  "Jueves", "Viernes", "Sábado",
];

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril",
  "Mayo", "Junio", "Julio", "Agosto",
  "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const MONTHS_SHORT = [
  "Ene", "Feb", "Mar", "Abr",
  "May", "Jun", "Jul", "Ago",
  "Sep", "Oct", "Nov", "Dic",
];

export function formatDate(
  dateString: string,
  options: FormatDateOptions = {},
): string {
  const { includeTime = false, short = false, utc = false } = options;

  // Reemplazar el espacio por 'T' para parseo correcto.
  // Si utc=true, agregar 'Z' para que el navegador interprete como GMT+0 y convierta a hora local.
  const normalized = dateString.replace(" ", "T");
  const date = new Date(utc ? `${normalized}Z` : normalized);

  if (isNaN(date.getTime())) return dateString;

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  if (short) {
    return `${day} ${MONTHS_SHORT[month]} ${year}`;
  }

  const dayName = DAYS[date.getDay()];
  let result = `${dayName} ${day} de ${MONTHS[month]}, ${year}`;

  if (includeTime) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    result += ` · ${hours}:${minutes} hrs`;
  }

  return result;
}
