import { describe, it, expect, beforeEach } from 'vitest';
import { getNestedValue, getNestedArray, getInitialLang } from './index';

describe('getNestedValue', () => {
  const obj = {
    sections: {
      team: 'Team',
      breaks: 'Breaks',
    },
    deeply: {
      nested: {
        value: 'found it',
      },
    },
  };

  it('returns a top-level string by single-key path', () => {
    expect(getNestedValue({ greeting: 'hello' }, 'greeting')).toBe('hello');
  });

  it('returns a nested string by dot-separated path', () => {
    expect(getNestedValue(obj, 'sections.team')).toBe('Team');
  });

  it('walks deeply nested paths', () => {
    expect(getNestedValue(obj, 'deeply.nested.value')).toBe('found it');
  });

  it('returns the path itself when the key is missing', () => {
    expect(getNestedValue(obj, 'sections.missing')).toBe('sections.missing');
  });

  it('returns the path itself when an intermediate key is missing', () => {
    expect(getNestedValue(obj, 'missing.team')).toBe('missing.team');
  });

  it('returns the path when the resolved value is not a string', () => {
    expect(getNestedValue(obj, 'sections')).toBe('sections');
  });
});

describe('getNestedArray', () => {
  const obj = {
    defaults: {
      team: ['Anna', 'Boris'],
      breaks: [],
    },
    sections: {
      team: 'Team',
    },
  };

  it('returns the array at the given path', () => {
    expect(getNestedArray(obj, 'defaults.team')).toEqual(['Anna', 'Boris']);
  });

  it('returns an empty array when the path resolves to an empty array', () => {
    expect(getNestedArray(obj, 'defaults.breaks')).toEqual([]);
  });

  it('returns an empty array when the path is missing', () => {
    expect(getNestedArray(obj, 'defaults.missing')).toEqual([]);
  });

  it('returns an empty array when the value is not an array', () => {
    expect(getNestedArray(obj, 'sections.team')).toEqual([]);
  });
});

describe('getInitialLang', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset URL to a clean state
    window.history.replaceState({}, '', '/');
  });

  it('returns "de" by default when no URL or storage value is set', () => {
    expect(getInitialLang()).toBe('de');
  });

  it('reads "en" from the URL ?lang query param', () => {
    window.history.replaceState({}, '', '/?lang=en');
    expect(getInitialLang()).toBe('en');
  });

  it('reads "de" from the URL ?lang query param', () => {
    window.history.replaceState({}, '', '/?lang=de');
    expect(getInitialLang()).toBe('de');
  });

  it('falls back to localStorage when URL has no lang param', () => {
    localStorage.setItem('lang', 'en');
    expect(getInitialLang()).toBe('en');
  });

  it('prefers URL param over localStorage', () => {
    localStorage.setItem('lang', 'de');
    window.history.replaceState({}, '', '/?lang=en');
    expect(getInitialLang()).toBe('en');
  });

  it('ignores invalid URL lang values and falls back to default', () => {
    window.history.replaceState({}, '', '/?lang=fr');
    expect(getInitialLang()).toBe('de');
  });

  it('ignores invalid localStorage values and falls back to default', () => {
    localStorage.setItem('lang', 'fr');
    expect(getInitialLang()).toBe('de');
  });
});
