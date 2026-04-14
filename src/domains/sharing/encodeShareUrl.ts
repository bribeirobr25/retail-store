/**
 * MVP-SHARE-URL: Encodes the entire plan state into the share URL so the
 * receiver — who has empty sessionStorage — sees the sharer's data instead
 * of template defaults.
 *
 * This is a temporary client-side workaround. When Phase 1 cloud sharing
 * lands (see docs/FUTURE_VISION.md, Phase 1 → MVP Cleanup Tasks), this
 * file is one of several to delete:
 *   - this file
 *   - encodeShareUrl.test.ts
 *   - lz-string dependency in package.json
 *   - the URL-hydration block in src/main.tsx
 *   - getPersistableState() in src/domains/plan/planStore.ts (if no other
 *     consumer remains)
 *   - the buildShareUrlWithState call in ShareMenu.tsx (revert to
 *     buildShareUrl from share.ts)
 *
 * Search the codebase for the marker "MVP-SHARE-URL" to find every file
 * that needs cleanup.
 */

import LZString from 'lz-string';
import type { Language } from '../../i18n';
import { PersistedPlanStateSchema, type PersistedPlanState } from '../plan/planSchema';
import { buildShareUrl } from './share';

/** Query param used to carry the compressed plan payload. */
const SHARE_DATA_PARAM = 'd';

/**
 * Builds a share URL that encodes the current plan state. The state is
 * JSON-serialized, compressed with LZ-string, and base64url-encoded into
 * the `d` query parameter.
 */
export function buildShareUrlWithState(
  currentUrl: string,
  lang: Language,
  state: PersistedPlanState,
): string {
  const baseUrl = buildShareUrl(currentUrl, lang);
  const url = new URL(baseUrl);

  const json = JSON.stringify(state);
  const encoded = LZString.compressToEncodedURIComponent(json);
  url.searchParams.set(SHARE_DATA_PARAM, encoded);

  return url.toString();
}

/**
 * Decodes a plan state from a share URL produced by buildShareUrlWithState.
 *
 * Returns null if:
 * - the URL has no `d` param (it's not a shared URL)
 * - decompression or JSON parsing fails (corrupt payload)
 * - the decoded payload fails Zod schema validation (incompatible shape)
 *
 * The receiver always falls back to template defaults on null, so a
 * tampered or outdated share URL degrades gracefully instead of crashing.
 */
export function decodePlanStateFromUrl(currentUrl: string): PersistedPlanState | null {
  let url: URL;
  try {
    url = new URL(currentUrl);
  } catch {
    return null;
  }

  const encoded = url.searchParams.get(SHARE_DATA_PARAM);
  if (!encoded) return null;

  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;

    const parsed: unknown = JSON.parse(json);
    const result = PersistedPlanStateSchema.safeParse(parsed);
    if (!result.success) {
      // eslint-disable-next-line no-console
      console.warn('[encodeShareUrl] decoded payload failed schema validation', result.error);
      return null;
    }
    return result.data;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[encodeShareUrl] failed to decode share URL', err);
    return null;
  }
}
