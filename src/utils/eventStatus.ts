import type { Event } from "@/interfaces/catalog.interface";

interface EventStatusResult {
  label: string;
  colorVar: string;
}

export function getEventStatus(event: Event): EventStatusResult | null {
  const isLive = !!event.live_associated?.key;
  const eventDate = new Date(event.gmt0_unlocked?.replace(" ", "T") + "Z");
  const now = new Date();

  if (now < eventDate) {
    return { label: "Próximamente", colorVar: "--foc-primary" };
  }

  if (isLive) {
    return { label: "En vivo", colorVar: "--foc-tertiary" };
  }

  return null;
}
