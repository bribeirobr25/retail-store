import { describe, it, expect } from 'vitest';
import { buildShareUrl } from './share';

describe('buildShareUrl', () => {
  it('appends mode=shared and the language to a clean URL', () => {
    const result = buildShareUrl('http://localhost:5173/', 'de');

    const url = new URL(result);
    expect(url.searchParams.get('mode')).toBe('shared');
    expect(url.searchParams.get('lang')).toBe('de');
  });

  it('uses lang=en when called with the English language', () => {
    const result = buildShareUrl('http://localhost:5173/', 'en');

    expect(new URL(result).searchParams.get('lang')).toBe('en');
  });

  it('overwrites an existing lang query param', () => {
    const result = buildShareUrl('http://localhost:5173/?mode=shared&lang=de', 'en');

    const url = new URL(result);
    expect(url.searchParams.get('mode')).toBe('shared');
    expect(url.searchParams.get('lang')).toBe('en');
  });

  it('preserves unrelated query params', () => {
    const result = buildShareUrl('http://localhost:5173/?utm=email&ref=abc', 'de');

    const url = new URL(result);
    expect(url.searchParams.get('utm')).toBe('email');
    expect(url.searchParams.get('ref')).toBe('abc');
    expect(url.searchParams.get('mode')).toBe('shared');
    expect(url.searchParams.get('lang')).toBe('de');
  });

  it('preserves the path of the original URL', () => {
    const result = buildShareUrl('http://localhost:5173/some/path', 'de');

    expect(new URL(result).pathname).toBe('/some/path');
  });
});
