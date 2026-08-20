import type { Event } from "@/interfaces/catalog.interface";

interface EventStatusResult {
  label: string;
  bgColor: string;
  textColor: string;
}

export function getEventStatus(event: Event): EventStatusResult | null {
  // Determinar estado por fecha: si gmt0_unlocked es futuro → Próximamente, si pasado → En vivo
  if (event.gmt0_unlocked) {
    const unlockDate = new Date(event.gmt0_unlocked.replace(" ", "T") + "Z");
    const now = new Date();

    if (unlockDate > now) {
      return { label: "Próximamente", bgColor: 'var(--foc-tertiary)', textColor: 'var(--clr-text-tertiary-button)' };
    }
    // Fecha pasada: el evento ya inició
    return { label: "En vivo", bgColor: 'var(--foc-primary)', textColor: 'var(--clr-primary-title)' };
  }

  // Fallback: usar is_unlocked y live_associated
  if (!event.is_unlocked) return { label: "Próximamente", bgColor: 'var(--foc-tertiary)', textColor: 'var(--clr-text-tertiary-button)' };

  const isLive = !!event.live_associated?.key;
  if (isLive) return { label: "En vivo", bgColor: 'var(--foc-primary)', textColor: 'var(--clr-primary-title)' };

  return null;
}
