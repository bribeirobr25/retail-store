import { useState, useEffect, useRef } from 'react';
import { useTranslation } from './i18n';
import { motion, AnimatePresence } from 'motion/react';
import {
  Share2,
  Link,
  MessageCircle,
  Mail,
  Calendar,
  Users,
  Target,
  CheckSquare,
  Moon,
  FileText,
  ShoppingBag,
  Layout,
  Star,
  Heart,
  Sparkles,
  Coffee,
  ChevronDown,
  History,
} from 'lucide-react';

import type { SectionItem, KpiData } from './types';
import { STORAGE_KEY, loadSavedData, type SavedData } from './lib/storage';
import { buildShareUrl } from './lib/share';
import { randomIconIndex } from './lib/teamIcons';
import { Section } from './components/Section';
import { KpiCard } from './components/KpiCard';
import { LanguageToggle } from './components/LanguageToggle';

export default function App() {
  const { t, tArray, lang, locale } = useTranslation();
  const isShared = new URLSearchParams(window.location.search).get('mode') === 'shared';
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showShareMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShareMenu]);
  const [showShareToast, setShowShareToast] = useState(false);

  const getShareUrl = () => buildShareUrl(window.location.href, lang);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    setShowShareMenu(false);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`${t('share.whatsappText')}${getShareUrl()}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowShareMenu(false);
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(t('share.emailSubject'));
    const body = encodeURIComponent(`${t('share.emailBody')}${getShareUrl()}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowShareMenu(false);
  };

  // After trimming the JSON defaults to a single entry per section,
  // tArray(key)[0] is always defined — but TS can't see that. Helper guards it.
  const placeholder = (key: string) => tArray(key)[0] ?? '';

  const saved = loadSavedData();

  const [rawDate, setRawDate] = useState<string>(() => {
    if (saved?.rawDate) return saved.rawDate;
    // toISOString always contains a 'T' so split[0] is guaranteed; ?? '' satisfies the type checker
    return new Date().toISOString().split('T')[0] ?? '';
  });
  const [selectedStore, setSelectedStore] = useState(() => saved?.selectedStore ?? 'Berlin Taui');
  const storeOptions = ["Berlin Taui", "Berlin Alexa", "Mall of Berlin", "Berlin Rosenthal", "Boulevard Berlin", "Dresden", "Leipzig"];
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [notes, setNotes] = useState<SectionItem[]>(() => {
    if (saved?.notes) return saved.notes;
    return [{ id: 1, text: '' }];
  });

  const formattedDate = new Date(rawDate + 'T12:00:00').toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentMonth = new Date(rawDate + 'T12:00:00').toLocaleDateString(locale, {
    month: 'long'
  });

  // KPI States
  const [kpis, setKpis] = useState<KpiData>(() => saved?.kpis ?? {
    vj: '00.000',
    target: '00.000',
    targetWeek: '00.000',
    t1: '000.000',
    t2: '000.000',
    ly: '000.000'
  });

  const [dailyFokus, setDailyFokus] = useState<SectionItem[]>(() => {
    if (saved?.dailyFokus) return saved.dailyFokus;
    return [{ id: 1, text: '' }];
  });

  // Section Item States
  const [team, setTeam] = useState<SectionItem[]>(() => {
    if (saved?.team) return saved.team;
    return [{ id: 1, text: '', iconIndex: randomIconIndex() }];
  });
  const [pausen, setPausen] = useState<SectionItem[]>(() => {
    if (saved?.pausen) return saved.pausen;
    return [{ id: 1, text: '' }];
  });
  const [todo, setTodo] = useState<SectionItem[]>(() => {
    if (saved?.todo) return saved.todo;
    return [{ id: 1, text: '' }];
  });
  const [kassen, setKassen] = useState<SectionItem[]>(() => {
    if (saved?.kassen) return saved.kassen;
    return [{ id: 1, text: '' }];
  });
  const [abend, setAbend] = useState<SectionItem[]>(() => {
    if (saved?.abend) return saved.abend;
    return [{ id: 1, text: '' }];
  });

  // Persist all user data to localStorage
  useEffect(() => {
    const data: SavedData = { team, pausen, todo, kassen, abend, dailyFokus, notes, kpis, rawDate, selectedStore };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [team, pausen, todo, kassen, abend, dailyFokus, notes, kpis, rawDate, selectedStore]);

  return (
    <div className="min-h-screen p-2 md:p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-7xl mx-auto glass-card rounded-[3rem] overflow-hidden border-4 border-white/50 flex flex-col min-h-275 print-container bubbly-shadow"
      >
        {/* Header Section - Colorful & Funny */}
        <header className="relative p-8 bg-linear-to-r from-[#e2d1f9] via-[#fdfcfb] to-[#e2d1f9] z-30">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
            <div className="absolute top-10 left-10">
              <Heart className="w-8 h-8 sm:w-6 sm:h-6 md:w-10 md:h-10" fill="#ff00cc" />
            </div>
            <div className="absolute bottom-10 right-10">
              <Star className="w-8 h-8 sm:w-6 sm:h-6 md:w-10 md:h-10" fill="#3333ff" />
            </div>
            <div className="absolute top-20 right-20">
              <Sparkles className="w-8 h-8 sm:w-6 sm:h-6 md:w-10 md:h-10" fill="#ffcc00" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="text-center md:text-left md:flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-purple-600 mb-6 relative group/date cursor-pointer z-30 w-fit mx-auto md:mx-0">
                <Calendar size={18} className="pointer-events-none" />
                <span className="text-xs font-black uppercase tracking-widest text-purple-600 transition-colors group-hover/date:text-pink-500 pointer-events-none">
                  {formattedDate}
                </span>
                <input 
                  type="date" 
                  value={rawDate} 
                  onChange={(e) => !isShared && setRawDate(e.target.value)}
                  disabled={isShared}
                  onClick={(e) => {
                    try {
                      (e.target as HTMLInputElement).showPicker();
                    } catch (err) {
                      // Fallback
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-50"
                />
                {!isShared && (
                  <ChevronDown size={14} className="opacity-0 group-hover/date:opacity-100 transition-opacity pointer-events-none" />
                )}
              </div>
              <div className={`relative group/store mb-2 ${showStoreDropdown ? 'z-110' : 'z-10'}`}>
                <h1 
                  className="text-[clamp(1.8rem,6vw,4.5rem)] font-funny iridescent-text tracking-tight cursor-pointer flex items-center justify-center md:justify-start gap-3 hover:scale-[1.02] transition-transform"
                  onClick={() => !isShared && setShowStoreDropdown(!showStoreDropdown)}
                >
                  <span className="text-gray-800 uppercase">{selectedStore}</span>
                  {!isShared && (
                    <ChevronDown size={28} className="text-purple-400 group-hover/store:text-pink-500 transition-colors no-print drop-shadow-sm" />
                  )}
                </h1>
                
                {showStoreDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-4xl shadow-2xl border-4 border-purple-50 z-120 overflow-hidden no-print animate-in fade-in zoom-in duration-200">
                    {storeOptions.map((option) => (
                      <div 
                        key={option}
                        className="px-6 py-4 hover:bg-purple-50 cursor-pointer text-lg font-black text-purple-600 transition-colors border-b-2 border-purple-50 last:border-none flex items-center justify-between group/item"
                        onClick={() => {
                          setSelectedStore(option);
                          setShowStoreDropdown(false);
                        }}
                      >
                        {option}
                        <div className={`w-3 h-3 rounded-full transition-all ${selectedStore === option ? 'bg-pink-500 scale-125' : 'bg-gray-100 group-hover/item:bg-purple-200'}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 md:flex-1 relative">
              {!isShared && <LanguageToggle />}
              <div className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] bg-white/50 px-3 py-1 rounded-full border border-purple-100">
                {t('header.month')}: {currentMonth}
              </div>
              <div className="flex gap-3">
                <KpiCard
                  icon={History}
                  iconColor="text-blue-500"
                  valueColor="text-blue-600"
                  value={kpis.ly}
                  onSave={(val) => setKpis({ ...kpis, ly: val })}
                  label={t('kpi.ly')}
                  readOnly={isShared}
                />
                <KpiCard
                  icon={Star}
                  iconColor="text-yellow-500"
                  valueColor="text-yellow-600"
                  value={kpis.t1}
                  onSave={(val) => setKpis({ ...kpis, t1: val })}
                  label={t('kpi.t1')}
                  readOnly={isShared}
                />
                <KpiCard
                  icon={Sparkles}
                  iconColor="text-orange-500"
                  valueColor="text-orange-600"
                  value={kpis.t2}
                  onSave={(val) => setKpis({ ...kpis, t2: val })}
                  label={t('kpi.t2')}
                  readOnly={isShared}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Grid - Two Independent Columns with Mobile Reordering */}
        <main className="px-4 py-6 md:px-6 lg:px-10 md:py-8 lg:py-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-6 lg:gap-x-32 md:gap-y-8 lg:gap-y-16 items-start">
          {/* Left Column: KPIs, Team, Pausen, To Do */}
          <div className="contents md:flex md:flex-col md:gap-6 lg:gap-14">
            <div className="order-1">
              <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                <KpiCard
                  variant="body"
                  icon={Target}
                  iconColor="text-blue-500"
                  valueColor="text-blue-500"
                  value={kpis.target}
                  onSave={(val) => setKpis({ ...kpis, target: val })}
                  label={t('kpi.todaysTarget')}
                  readOnly={isShared}
                />
                <KpiCard
                  variant="body"
                  icon={History}
                  iconColor="text-pink-500"
                  valueColor="text-pink-500"
                  value={kpis.vj}
                  onSave={(val) => setKpis({ ...kpis, vj: val })}
                  label={t('kpi.lastYear')}
                  readOnly={isShared}
                />
                <KpiCard
                  variant="body"
                  icon={Layout}
                  iconColor="text-purple-500"
                  valueColor="text-purple-500"
                  value={kpis.targetWeek}
                  onSave={(val) => setKpis({ ...kpis, targetWeek: val })}
                  label={t('kpi.weeksTarget')}
                  readOnly={isShared}
                />
              </div>
            </div>

            <div className="order-3">
              <Section
                title={t('sections.team')}
                icon={Users}
                items={team}
                setItems={setTeam}
                placeholderText={placeholder('defaults.team')}
                color="border-yellow-200"
                isTeam={true}
                readOnly={isShared}
              />
            </div>
            
            <div className="order-4">
              <Section
                title={t('sections.breaks')}
                icon={Coffee}
                items={pausen}
                setItems={setPausen}
                placeholderText={placeholder('defaults.breaks')}
                color="border-pink-200"
                printColumns
                readOnly={isShared}
              />
            </div>

            <div className="order-6">
              <Section
                title={t('sections.todo')}
                icon={CheckSquare}
                items={todo}
                setItems={setTodo}
                placeholderText={placeholder('defaults.todo')}
                color="border-blue-200"
                formatDash
                readOnly={isShared}
              />
            </div>
          </div>

          {/* Right Column: Daily Fokus, Kassen, Abend, Note */}
          <div className="contents md:flex md:flex-col md:gap-6 lg:gap-14">
            <div className="order-2">
              <Section
                title={t('sections.dailyFocus')}
                icon={Sparkles}
                items={dailyFokus}
                setItems={setDailyFokus}
                placeholderText={placeholder('defaults.focus')}
                color="border-pink-100"
                readOnly={isShared}
              />
            </div>

            <div className="order-5">
              <Section
                title={t('sections.registers')}
                icon={ShoppingBag}
                items={kassen}
                setItems={setKassen}
                placeholderText={placeholder('defaults.registers')}
                color="border-purple-200"
                printColumns
                readOnly={isShared}
              />
            </div>

            <div className="order-7">
              <Section
                title={t('sections.evening')}
                icon={Moon}
                items={abend}
                setItems={setAbend}
                placeholderText={placeholder('defaults.evening')}
                color="border-indigo-200"
                formatDash
                readOnly={isShared}
              />
            </div>

            <div className="order-8">
              <Section
                title={t('sections.notes')}
                icon={FileText}
                items={notes}
                setItems={setNotes}
                placeholderText={placeholder('defaults.notes')}
                color="border-gray-200"
              />
            </div>
          </div>
        </main>
      </motion.div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 flex flex-col items-end gap-3 no-print z-50">
        <div className="relative" ref={shareMenuRef}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="bg-white text-purple-600 border-2 border-purple-200 px-5 py-3 md:px-8 md:py-4 rounded-full shadow-xl transition-all flex items-center gap-2 md:gap-3 font-funny text-base md:text-lg cursor-pointer"
          >
            <Share2 size={20} />
            <span className="hidden md:inline">{t('ui.share')}</span>
          </motion.button>

          <AnimatePresence>
            {showShareMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute bottom-full right-0 mb-2 bg-white rounded-2xl shadow-2xl border-2 border-purple-100 overflow-hidden w-56"
              >
                <button
                  onClick={handleCopyLink}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-purple-50 flex items-center gap-3 transition-colors"
                >
                  <Link size={18} className="text-purple-500" /> {t('ui.copyLink')}
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-green-50 flex items-center gap-3 transition-colors border-t border-gray-100"
                >
                  <MessageCircle size={18} className="text-green-500" /> {t('ui.whatsapp')}
                </button>
                <button
                  onClick={handleShareEmail}
                  className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 flex items-center gap-3 transition-colors border-t border-gray-100"
                >
                  <Mail size={18} className="text-blue-500" /> {t('ui.email')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.print()}
          className="bg-linear-to-r from-pink-500 to-purple-600 text-white px-5 py-3 md:px-8 md:py-4 rounded-full shadow-2xl transition-all flex items-center gap-2 md:gap-3 font-funny text-base md:text-lg cursor-pointer"
        >
          <FileText size={20} />
          <span className="hidden md:inline">{t('ui.generatePdf')}</span>
          <span className="md:hidden">{t('ui.generatePdfShort')}</span>
        </motion.button>
      </div>

      {/* Share toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 md:bottom-28 md:right-8 bg-green-500 text-white px-6 py-3 rounded-full shadow-xl font-medium text-sm z-50 no-print"
          >
            {t('ui.linkCopied')}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
