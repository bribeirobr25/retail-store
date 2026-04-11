/**
 * Strongly-typed event names. Adding a new tracked event means extending
 * this union — typos in component code become compile errors instead of
 * silent data quality bugs.
 */
export type AnalyticsEvent =
  | 'language_switched'
  | 'pdf_generated'
  | 'link_copied'
  | 'whatsapp_shared'
  | 'email_shared';

export interface AnalyticsService {
  track(event: AnalyticsEvent, properties?: Record<string, unknown>): void;
  identify(userId: string, traits?: Record<string, unknown>): void;
}

/**
 * Default implementation: no-op in production, console.debug in dev.
 *
 * Phase 1 will swap this for a real provider (PostHog, Mixpanel, etc.).
 * Component code calls `analytics.track('event_name', { ... })` directly
 * — tests can spy via `vi.spyOn(analytics, 'track')`.
 */
export const analytics: AnalyticsService = {
  track(event, properties) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[analytics]', event, properties ?? {});
    }
  },
  identify(userId, traits) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[analytics:identify]', userId, traits ?? {});
    }
  },
};
