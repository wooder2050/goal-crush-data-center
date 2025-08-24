import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Remove leading brand phrase from season names, keep trimmed label
export function shortenSeasonName(label: string): string {
  return label.replace(/골때리는 그녀들|골 때리는 그녀들/g, '').trim();
}

// Normalize season name to a coarse league bucket used across the app
export function inferLeague(
  seasonName: string | null
): 'super' | 'challenge' | 'playoff' | 'cup' | 'g-league' | 'other' {
  if (!seasonName) return 'other';
  const name = seasonName.toLowerCase();
  if (name.includes('super') || name.includes('슈퍼')) return 'super';
  if (name.includes('challenge') || name.includes('챌린지')) return 'challenge';
  if (name.includes('playoff') || name.includes('플레이오프')) return 'playoff';
  // Champion matches are treated as cup
  if (name.includes('champion') || name.includes('챔피언')) return 'cup';
  if (name.includes('sbs') || name.includes('cup') || name.includes('컵'))
    return 'cup';
  // "g-league" is not a primary bucket in UI; map to other for now
  if (
    name.includes('g-league') ||
    name.includes('g리그') ||
    name.includes('G리그')
  ) {
    return 'g-league';
  }
  return 'other';
}
