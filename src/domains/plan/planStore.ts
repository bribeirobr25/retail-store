import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Dispatch, SetStateAction } from 'react';
import type { SectionItem, KpiData } from '../../shared/types';
import { sessionStorageService } from '../../shared/services/storage';

const STORAGE_KEY = 'retail-store';

export const STORE_OPTIONS = [
  'Berlin Taui',
  'Berlin Alexa',
  'Mall of Berlin',
  'Berlin Rosenthal',
  'Boulevard Berlin',
  'Dresden',
  'Leipzig',
] as const;

const DEFAULT_KPIS: KpiData = {
  vj: '00.000',
  target: '00.000',
  targetWeek: '00.000',
  t1: '000.000',
  t2: '000.000',
  ly: '000.000',
};

const emptyItems = (): SectionItem[] => [{ id: 1, text: '' }];

type SectionKey = 'team' | 'breaks' | 'todo' | 'registers' | 'eveningShift' | 'dailyFocus' | 'notes';

export interface PlanState {
  // Data
  rawDate: string;
  selectedStore: string;
  kpis: KpiData;
  team: SectionItem[];
  breaks: SectionItem[];
  todo: SectionItem[];
  registers: SectionItem[];
  eveningShift: SectionItem[];
  dailyFocus: SectionItem[];
  notes: SectionItem[];

  // Actions
  setRawDate: (date: string) => void;
  setSelectedStore: (store: string) => void;
  setKpi: (key: keyof KpiData, value: string) => void;
  setTeam: Dispatch<SetStateAction<SectionItem[]>>;
  setBreaks: Dispatch<SetStateAction<SectionItem[]>>;
  setTodo: Dispatch<SetStateAction<SectionItem[]>>;
  setRegisters: Dispatch<SetStateAction<SectionItem[]>>;
  setEveningShift: Dispatch<SetStateAction<SectionItem[]>>;
  setDailyFocus: Dispatch<SetStateAction<SectionItem[]>>;
  setNotes: Dispatch<SetStateAction<SectionItem[]>>;
}

// Builds a Dispatch<SetStateAction<SectionItem[]>>-shaped setter so the
// existing Section component prop API stays unchanged.
function makeSectionSetter(
  set: (
    partial: PlanState | Partial<PlanState> | ((state: PlanState) => PlanState | Partial<PlanState>),
  ) => void,
  key: SectionKey,
): Dispatch<SetStateAction<SectionItem[]>> {
  return (action) =>
    set((state) => ({
      [key]: typeof action === 'function' ? (action as (prev: SectionItem[]) => SectionItem[])(state[key]) : action,
    }));
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      rawDate: new Date().toISOString().split('T')[0] ?? '',
      selectedStore: 'Berlin Taui',
      kpis: DEFAULT_KPIS,
      team: emptyItems(),
      breaks: emptyItems(),
      todo: emptyItems(),
      registers: emptyItems(),
      eveningShift: emptyItems(),
      dailyFocus: emptyItems(),
      notes: emptyItems(),

      setRawDate: (date) => set({ rawDate: date }),
      setSelectedStore: (store) => set({ selectedStore: store }),
      setKpi: (key, value) =>
        set((state) => ({ kpis: { ...state.kpis, [key]: value } })),
      setTeam: makeSectionSetter(set, 'team'),
      setBreaks: makeSectionSetter(set, 'breaks'),
      setTodo: makeSectionSetter(set, 'todo'),
      setRegisters: makeSectionSetter(set, 'registers'),
      setEveningShift: makeSectionSetter(set, 'eveningShift'),
      setDailyFocus: makeSectionSetter(set, 'dailyFocus'),
      setNotes: makeSectionSetter(set, 'notes'),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorageService),
    },
  ),
);
