import { describe, it, expect, beforeEach, vi } from 'vitest';
import { STORAGE_KEY, loadSavedData, type SavedData } from './storage';

const sampleData: SavedData = {
  team: [{ id: 1, text: 'Anna' }],
  pausen: [{ id: 1, text: 'Name: 12:00 - 13:00' }],
  todo: [{ id: 1, text: '' }],
  kassen: [{ id: 1, text: 'Kasse A' }],
  abend: [{ id: 1, text: '' }],
  dailyFokus: [{ id: 1, text: '' }],
  notes: [{ id: 1, text: '' }],
  kpis: { vj: '00.000', target: '00.000', targetWeek: '00.000', t1: '000.000', t2: '000.000', ly: '000.000' },
  rawDate: '2026-04-10',
  selectedStore: 'Berlin Taui',
};

describe('storage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe('loadSavedData', () => {
    it('returns null when sessionStorage is empty', () => {
      expect(loadSavedData()).toBeNull();
    });

    it('returns parsed data when valid JSON is stored', () => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));

      const loaded = loadSavedData();

      expect(loaded).toEqual(sampleData);
    });

    it('returns null when stored JSON is malformed', () => {
      sessionStorage.setItem(STORAGE_KEY, '{not valid json');

      expect(loadSavedData()).toBeNull();
    });

    it('returns null when sessionStorage.getItem throws', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('storage disabled');
      });

      expect(loadSavedData()).toBeNull();

      spy.mockRestore();
    });
  });

  describe('STORAGE_KEY', () => {
    it('uses a stable key so previous sessions can be located', () => {
      expect(STORAGE_KEY).toBe('retail-store-data');
    });
  });
});
