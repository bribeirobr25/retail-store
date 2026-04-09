import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import en from './en.json';
import de from './de.json';

export type Language = 'en' | 'de';

const translations: Record<Language, Record<string, unknown>> = { en, de };

const locales: Record<Language, string> = {
  en: 'en-US',
  de: 'de-DE',
};

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // fallback: return the key itself
    }
  }
  return typeof current === 'string' ? current : path;
}

function getNestedArray(obj: Record<string, unknown>, path: string): string[] {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return [];
    }
  }
  return Array.isArray(current) ? current as string[] : [];
}

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  tArray: (key: string) => string[];
  locale: string;
}

const I18nContext = createContext<I18nContextType | null>(null);

function getInitialLang(): Language {
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  if (urlLang === 'en' || urlLang === 'de') return urlLang;
  const stored = localStorage.getItem('lang');
  if (stored === 'en' || stored === 'de') return stored;
  return 'de';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getInitialLang);

  const setLang = useCallback((newLang: Language) => {
    localStorage.setItem('lang', newLang);
    setLangState(newLang);
  }, []);

  const t = useCallback((key: string) => {
    return getNestedValue(translations[lang], key);
  }, [lang]);

  const tArray = useCallback((key: string) => {
    return getNestedArray(translations[lang], key);
  }, [lang]);

  const locale = locales[lang];

  return (
    <I18nContext value={{ lang, setLang, t, tArray, locale }}>
      {children}
    </I18nContext>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider');
  return ctx;
}
