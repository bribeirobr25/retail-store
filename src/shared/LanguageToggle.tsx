import { useTranslation } from '../i18n';

export function LanguageToggle() {
  const { lang, setLang } = useTranslation();

  return (
    <div className="flex rounded-full border border-purple-200 overflow-hidden no-print md:absolute md:top-0 md:right-0">
      <button
        onClick={() => setLang('de')}
        className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider transition-colors ${
          lang === 'de'
            ? 'bg-purple-500 text-white'
            : 'bg-white/50 text-purple-400 hover:bg-purple-50'
        }`}
      >
        DE
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider transition-colors ${
          lang === 'en'
            ? 'bg-purple-500 text-white'
            : 'bg-white/50 text-purple-400 hover:bg-purple-50'
        }`}
      >
        EN
      </button>
    </div>
  );
}
