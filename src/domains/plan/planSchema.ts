import { z } from 'zod';

/**
 * Zod schemas for the persisted plan state. Used by planStore's `merge`
 * callback to validate data coming out of sessionStorage so corrupt or
 * outdated payloads fall back to defaults instead of crashing the app.
 */

export const SectionItemSchema = z.object({
  id: z.number(),
  text: z.string(),
  iconIndex: z.number().optional(),
});

export const KpiDataSchema = z.object({
  dailyTarget: z.string(),
  lastYearDay: z.string(),
  weeklyTarget: z.string(),
  lastYearMonth: z.string(),
  monthlyTarget1: z.string(),
  monthlyTarget2: z.string(),
});

/**
 * Schema for the persisted plan state. Mirrors the plain-data fields of
 * PlanState — actions are not persisted by Zustand, so they're absent here.
 */
export const PersistedPlanStateSchema = z.object({
  rawDate: z.string(),
  selectedStore: z.string(),
  kpis: KpiDataSchema,
  team: z.array(SectionItemSchema),
  breaks: z.array(SectionItemSchema),
  todo: z.array(SectionItemSchema),
  registers: z.array(SectionItemSchema),
  eveningShift: z.array(SectionItemSchema),
  dailyFocus: z.array(SectionItemSchema),
  notes: z.array(SectionItemSchema),
});

export type PersistedPlanState = z.infer<typeof PersistedPlanStateSchema>;
