const VOLUME_STORAGE_KEY = "rudo_player_volume";
const DEFAULT_VOLUME = 0.5;

export function getStoredVolume(): number {
  try {
    const stored = localStorage.getItem(VOLUME_STORAGE_KEY);
    if (stored !== null) {
      const parsed = parseFloat(stored);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) return parsed;
    }
  } catch { /* localStorage not available */ }
  return DEFAULT_VOLUME;
}

export function setStoredVolume(vol: number): void {
  try {
    localStorage.setItem(VOLUME_STORAGE_KEY, String(vol));
  } catch { /* localStorage not available */ }
}
