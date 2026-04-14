import { describe, it, expect, vi } from 'vitest';
import LZString from 'lz-string';
import { buildShareUrlWithState, decodePlanStateFromUrl } from './encodeShareUrl';
import type { PersistedPlanState } from '../plan/planSchema';

const sampleState: PersistedPlanState = {
  rawDate: '2026-04-11',
  selectedStore: 'Berlin Taui',
  kpis: {
    dailyTarget: '00.000',
    lastYearDay: '00.000',
    weeklyTarget: '00.000',
    lastYearMonth: '000.000',
    monthlyTarget1: '000.000',
    monthlyTarget2: '000.000',
  },
  team: [
    { id: 1, text: 'Anna', iconIndex: 5 },
    { id: 2, text: 'Boris', iconIndex: 12 },
  ],
  breaks: [{ id: 1, text: 'Anna: 12:00 - 13:00' }],
  todo: [{ id: 1, text: 'Boris – Restock lipsticks' }],
  registers: [{ id: 1, text: 'Kasse A: Anna' }],
  eveningShift: [{ id: 1, text: 'Boris – Cash count' }],
  dailyFocus: [{ id: 1, text: 'Push the new mascara' }],
  notes: [{ id: 1, text: 'Test note' }],
};

describe('buildShareUrlWithState', () => {
  it('appends mode, lang and the encoded data param to the URL', () => {
    const url = new URL(buildShareUrlWithState('http://localhost:5173/', 'de', sampleState));

    expect(url.searchParams.get('mode')).toBe('shared');
    expect(url.searchParams.get('lang')).toBe('de');
    expect(url.searchParams.get('d')).toBeTruthy();
  });

  it('produces a URL that round-trips through decodePlanStateFromUrl', () => {
    const encodedUrl = buildShareUrlWithState('http://localhost:5173/', 'en', sampleState);
    const decoded = decodePlanStateFromUrl(encodedUrl);

    expect(decoded).toEqual(sampleState);
  });

  it('respects the lang param when re-encoding an already-shared URL', () => {
    const first = buildShareUrlWithState('http://localhost:5173/?utm=email', 'de', sampleState);
    const second = buildShareUrlWithState(first, 'en', sampleState);

    const url = new URL(second);
    expect(url.searchParams.get('lang')).toBe('en');
    expect(url.searchParams.get('utm')).toBe('email');
  });

  it('preserves the original path', () => {
    const url = new URL(buildShareUrlWithState('http://localhost:5173/some/route', 'de', sampleState));
    expect(url.pathname).toBe('/some/route');
  });
});

describe('decodePlanStateFromUrl', () => {
  it('returns null when the URL has no d param', () => {
    expect(decodePlanStateFromUrl('http://localhost:5173/?mode=shared&lang=de')).toBeNull();
  });

  it('returns null when the URL is malformed', () => {
    expect(decodePlanStateFromUrl('not a url')).toBeNull();
  });

  it('returns null when the d param contains garbage', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(decodePlanStateFromUrl('http://localhost:5173/?d=this-is-not-lz-compressed')).toBeNull();

    warnSpy.mockRestore();
  });

  it('returns null when the decoded payload has the wrong shape', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Manually craft an invalid payload — missing every required field
    const corrupt = LZString.compressToEncodedURIComponent(JSON.stringify({ rawDate: 42 }));

    expect(decodePlanStateFromUrl(`http://localhost:5173/?d=${corrupt}`)).toBeNull();

    warnSpy.mockRestore();
  });
});
