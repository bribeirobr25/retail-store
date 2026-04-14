/**
 * Abstract storage layer that matches the Web Storage API shape.
 * Zustand's createJSONStorage() consumes any object with this interface,
 * so swapping the implementation requires no Zustand-specific adapter.
 */
export interface StorageService {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * Default implementation: wraps the browser sessionStorage. All methods are
 * try/catch wrapped so that disabled storage, quota exceeded, or third-party
 * cookie blocking degrades silently instead of crashing the app.
 */
export const sessionStorageService: StorageService = {
  getItem(key) {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // Quota exceeded, storage disabled, etc.
    }
  },
  removeItem(key) {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // Storage disabled
    }
  },
};

/**
 * Test-friendly Map-backed storage. Useful when a test needs storage but
 * shouldn't pollute the real sessionStorage shared with other tests.
 */
export function createInMemoryStorage(): StorageService {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
  };
}
