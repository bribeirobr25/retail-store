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
