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
  /** Body KPI: today's daily target */
  dailyTarget: string;
  /** Body KPI: last year's sales for the same calendar day */
  lastYearDay: string;
  /** Body KPI: this week's target */
  weeklyTarget: string;
  /** Header KPI: last year's monthly sales */
  lastYearMonth: string;
  /** Header KPI: this year's monthly target 1 */
  monthlyTarget1: string;
  /** Header KPI: this year's monthly target 2 */
  monthlyTarget2: string;
}
