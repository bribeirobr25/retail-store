import { describe, it, expect } from 'vitest';
import { SectionItemSchema, KpiDataSchema, PersistedPlanStateSchema } from './planSchema';

const validKpis = {
  dailyTarget: '00.000',
  lastYearDay: '00.000',
  weeklyTarget: '00.000',
  lastYearMonth: '000.000',
  monthlyTarget1: '000.000',
  monthlyTarget2: '000.000',
};

const validPersistedState = {
  rawDate: '2026-04-11',
  selectedStore: 'Berlin Taui',
  kpis: validKpis,
  team: [{ id: 1, text: 'Anna' }],
  breaks: [{ id: 1, text: '' }],
  todo: [{ id: 1, text: '' }],
  registers: [{ id: 1, text: '' }],
  eveningShift: [{ id: 1, text: '' }],
  dailyFocus: [{ id: 1, text: '' }],
  notes: [{ id: 1, text: '' }],
};

describe('SectionItemSchema', () => {
  it('accepts an item with id and text', () => {
    expect(SectionItemSchema.safeParse({ id: 1, text: 'hello' }).success).toBe(true);
  });

  it('accepts an item with optional iconIndex', () => {
    expect(SectionItemSchema.safeParse({ id: 1, text: 'hello', iconIndex: 5 }).success).toBe(true);
  });

  it('rejects an item missing id', () => {
    expect(SectionItemSchema.safeParse({ text: 'hello' }).success).toBe(false);
  });

  it('rejects an item with wrong-typed id', () => {
    expect(SectionItemSchema.safeParse({ id: '1', text: 'hello' }).success).toBe(false);
  });
});

describe('KpiDataSchema', () => {
  it('accepts a complete KPI object', () => {
    expect(KpiDataSchema.safeParse(validKpis).success).toBe(true);
  });

  it('rejects a KPI object missing a field', () => {
    const incomplete = { ...validKpis } as Partial<typeof validKpis>;
    delete incomplete.dailyTarget;
    expect(KpiDataSchema.safeParse(incomplete).success).toBe(false);
  });
});

describe('PersistedPlanStateSchema', () => {
  it('accepts a valid persisted state', () => {
    expect(PersistedPlanStateSchema.safeParse(validPersistedState).success).toBe(true);
  });

  it('rejects a state missing a section field', () => {
    const incomplete = { ...validPersistedState } as Partial<typeof validPersistedState>;
    delete incomplete.team;
    expect(PersistedPlanStateSchema.safeParse(incomplete).success).toBe(false);
  });

  it('rejects a state with a wrong-type field (kpis: string)', () => {
    expect(
      PersistedPlanStateSchema.safeParse({ ...validPersistedState, kpis: 'not an object' }).success,
    ).toBe(false);
  });

  it('accepts empty section arrays', () => {
    expect(
      PersistedPlanStateSchema.safeParse({
        ...validPersistedState,
        team: [],
        breaks: [],
      }).success,
    ).toBe(true);
  });

  it('ignores unknown extra fields (forward compatibility)', () => {
    expect(
      PersistedPlanStateSchema.safeParse({
        ...validPersistedState,
        somethingFromTheFuture: 'hello',
      }).success,
    ).toBe(true);
  });

  it('rejects null', () => {
    expect(PersistedPlanStateSchema.safeParse(null).success).toBe(false);
  });

  it('rejects a string payload', () => {
    expect(PersistedPlanStateSchema.safeParse('garbage').success).toBe(false);
  });
});
