import { describe, it, expect, vi } from 'vitest';
import { analytics } from './analytics';

describe('analytics service', () => {
  it('track() does not throw with just an event name', () => {
    expect(() => analytics.track('language_switched')).not.toThrow();
  });

  it('track() does not throw with properties', () => {
    expect(() => analytics.track('language_switched', { to: 'en' })).not.toThrow();
  });

  it('track() is spy-able via vi.spyOn', () => {
    const spy = vi.spyOn(analytics, 'track');

    analytics.track('pdf_generated');

    expect(spy).toHaveBeenCalledWith('pdf_generated');
    spy.mockRestore();
  });

  it('identify() is spy-able via vi.spyOn', () => {
    const spy = vi.spyOn(analytics, 'identify');

    analytics.identify('user-123', { plan: 'pro' });

    expect(spy).toHaveBeenCalledWith('user-123', { plan: 'pro' });
    spy.mockRestore();
  });
});
