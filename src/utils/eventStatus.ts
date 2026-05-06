import type { Event } from "@/interfaces/catalog.interface";

interface EventStatusResult {
  label: string;
  colorVar: string;
}

export function getEventStatus(event: Event): EventStatusResult | null {
  const isLive = !!event.live_associated?.key;
  if (!event.is_unlocked) return { label: "Próximamente", colorVar: "--foc-primary" };

  if (isLive) return { label: "En vivo", colorVar: "--foc-tertiary" }

  return null

}
