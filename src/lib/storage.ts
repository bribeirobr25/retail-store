import type { SectionItem } from '../types';

export const STORAGE_KEY = 'retail-store-data';

export interface SavedData {
  team: SectionItem[];
  pausen: SectionItem[];
  todo: SectionItem[];
  kassen: SectionItem[];
  abend: SectionItem[];
  dailyFokus: SectionItem[];
  notes: SectionItem[];
  kpis: Record<string, string>;
  rawDate: string;
  selectedStore: string;
}

export function loadSavedData(): SavedData | null {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}
