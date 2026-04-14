import { describe, it, expect, beforeEach, vi } from 'vitest';
import { sessionStorageService, createInMemoryStorage } from './storage';

describe('sessionStorageService', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('round-trips a value through sessionStorage', () => {
    sessionStorageService.setItem('foo', 'bar');
    expect(sessionStorageService.getItem('foo')).toBe('bar');
  });

  it('returns null for a missing key', () => {
    expect(sessionStorageService.getItem('missing')).toBeNull();
  });

  it('removes a key', () => {
    sessionStorageService.setItem('foo', 'bar');
    sessionStorageService.removeItem('foo');
    expect(sessionStorageService.getItem('foo')).toBeNull();
  });

  it('returns null when sessionStorage.getItem throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('disabled');
    });

    expect(sessionStorageService.getItem('foo')).toBeNull();

    spy.mockRestore();
  });

  it('swallows errors when setItem throws (quota, disabled storage)', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });

    expect(() => sessionStorageService.setItem('foo', 'bar')).not.toThrow();

    spy.mockRestore();
  });
});

describe('createInMemoryStorage', () => {
  it('round-trips a value', () => {
    const storage = createInMemoryStorage();
    storage.setItem('foo', 'bar');
    expect(storage.getItem('foo')).toBe('bar');
  });

  it('returns null for a missing key', () => {
    const storage = createInMemoryStorage();
    expect(storage.getItem('missing')).toBeNull();
  });

  it('removes a key', () => {
    const storage = createInMemoryStorage();
    storage.setItem('foo', 'bar');
    storage.removeItem('foo');
    expect(storage.getItem('foo')).toBeNull();
  });

  it('isolates state between separate instances', () => {
    const a = createInMemoryStorage();
    const b = createInMemoryStorage();

    a.setItem('foo', 'a-value');

    expect(a.getItem('foo')).toBe('a-value');
    expect(b.getItem('foo')).toBeNull();
  });
});
