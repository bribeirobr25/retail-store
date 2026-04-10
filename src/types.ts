import type { LucideIcon } from 'lucide-react';

export interface TextItem {
  id: number;
  text: string;
  iconIndex?: number;
}

export type SectionItem = TextItem;

export type TeamIcon =
  | { type: 'lucide'; icon: LucideIcon }
  | { type: 'svg'; src: string };

export interface KpiData {
  vj: string;
  target: string;
  targetWeek: string;
  t1: string;
  t2: string;
  ly: string;
}
