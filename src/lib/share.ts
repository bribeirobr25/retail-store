import type { Language } from '../i18n';

export function buildShareUrl(currentUrl: string, lang: Language): string {
  const url = new URL(currentUrl);
  url.searchParams.set('mode', 'shared');
  url.searchParams.set('lang', lang);
  return url.toString();
}
