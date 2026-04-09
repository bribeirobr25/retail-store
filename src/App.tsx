import { useState, useEffect, useRef } from 'react';
import type { Dispatch, SetStateAction, KeyboardEvent } from 'react';
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
  Plus,
  Trash2,
  Layout,
  Star,
  Heart,
  Sparkles,
  Coffee,
  ChevronDown,
  History,
  Rainbow,
  Flower,
  Dog,
  Squirrel,
  Cherry,
  Croissant,
  Gem,
  Rocket,
  Gift,
  Origami,
  ScanFace,
  HatGlasses,
  TreePalm,
  FlameKindling,
  Palette,
  Handbag,
  Award,
  Medal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import svgCat from '../images/svg/cat.svg';
import svgBall from '../images/svg/ball.svg';
import svgPuppy from '../images/svg/puppy.svg';
import svgPrincess from '../images/svg/princess.svg';
import svgPanda from '../images/svg/panda.svg';
import svgUnicorn from '../images/svg/unicorn.svg';
import svgTeacat from '../images/svg/teacat.svg';
import svgCupcakebear from '../images/svg/cupcakebear.svg';
import svgRabbit from '../images/svg/rabbit.svg';
import svgPrinces from '../images/svg/princes.svg';

interface TextItem { id: number; text: string; iconIndex?: number }
type SectionItem = TextItem;

type TeamIcon = { type: 'lucide'; icon: LucideIcon } | { type: 'svg'; src: string };

const TEAM_ICONS: TeamIcon[] = [
  // Custom SVGs
  { type: 'svg', src: svgCat },
  { type: 'svg', src: svgBall },
  { type: 'svg', src: svgPuppy },
  { type: 'svg', src: svgPrincess },
  { type: 'svg', src: svgPanda },
  { type: 'svg', src: svgUnicorn },
  { type: 'svg', src: svgTeacat },
  { type: 'svg', src: svgCupcakebear },
  { type: 'svg', src: svgRabbit },
  { type: 'svg', src: svgPrinces },
  // Lucide icons
  { type: 'lucide', icon: Rainbow },
  { type: 'lucide', icon: Flower },
  { type: 'lucide', icon: Dog },
  { type: 'lucide', icon: Squirrel },
  { type: 'lucide', icon: Cherry },
  { type: 'lucide', icon: Croissant },
  { type: 'lucide', icon: Gem },
  { type: 'lucide', icon: Rocket },
  { type: 'lucide', icon: Gift },
  { type: 'lucide', icon: Origami },
  { type: 'lucide', icon: ScanFace },
  { type: 'lucide', icon: HatGlasses },
  { type: 'lucide', icon: TreePalm },
  { type: 'lucide', icon: FlameKindling },
  { type: 'lucide', icon: Palette },
  { type: 'lucide', icon: Handbag },
  { type: 'lucide', icon: Award },
  { type: 'lucide', icon: Medal },
];

const randomIconIndex = () => Math.floor(Math.random() * TEAM_ICONS.length);

interface EditableInputProps {
  value: string;
  onSave: (val: string) => void;
  className?: string;
  placeholder?: string;
  formatPrefix?: boolean;
  formatDash?: boolean;
  readOnly?: boolean;
}

interface SectionProps {
  title: string;
  icon: LucideIcon;
  items: SectionItem[];
  setItems: Dispatch<SetStateAction<SectionItem[]>>;
  placeholder: Partial<SectionItem>;
  color: string;
  isTeam?: boolean;
  printColumns?: boolean;
  formatDash?: boolean;
  readOnly?: boolean;
}

export default function App() {
  const { t, tArray, lang, setLang, locale } = useTranslation();
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

  const getShareUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('mode', 'shared');
    return url.toString();
  };

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

  const [rawDate, setRawDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStore, setSelectedStore] = useState('Kiko Taui');
  const storeOptions = ["Kiko Taui", "Kiko Alexa", "Kiko Mall", "Kiko Rosenthal", "Kiko Boulevard"];
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [notes, setNotes] = useState<SectionItem[]>(() =>
    tArray('defaults.notes').map((text, i) => ({ id: i + 1, text }))
  );

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
  const [kpis, setKpis] = useState({
    vj: '3.878',
    target: '3.977',
    targetWeek: '29.782',
    t1: '128.000',
    t2: '135.680',
    ly: '121.000'
  });

  const [dailyFokus, setDailyFokus] = useState<SectionItem[]>(() =>
    tArray('defaults.focus').map((text, i) => ({ id: i + 1, text }))
  );

  // Section Item States
  const [team, setTeam] = useState<SectionItem[]>(() =>
    tArray('defaults.team').map((text, i) => ({ id: i + 1, text, iconIndex: randomIconIndex() }))
  );
  const [pausen, setPausen] = useState<SectionItem[]>(() =>
    tArray('defaults.breaks').map((text, i) => ({ id: i + 1, text }))
  );
  const [todo, setTodo] = useState<SectionItem[]>(() =>
    tArray('defaults.todo').map((text, i) => ({ id: i + 1, text }))
  );
  const [kassen, setKassen] = useState<SectionItem[]>(() =>
    tArray('defaults.registers').map((text, i) => ({ id: i + 1, text }))
  );
  const [abend, setAbend] = useState<SectionItem[]>(() =>
    tArray('defaults.evening').map((text, i) => ({ id: i + 1, text }))
  );

  const addItem = (list: SectionItem[], setList: Dispatch<SetStateAction<SectionItem[]>>, placeholder: Partial<SectionItem>) => {
    const newItem = { id: Date.now(), ...placeholder, iconIndex: randomIconIndex() } as SectionItem;
    setList([...list, newItem]);
  };

  const removeItem = (list: SectionItem[], setList: Dispatch<SetStateAction<SectionItem[]>>, id: number) => {
    setList(list.filter(item => item.id !== id));
  };

  const updateItem = (list: SectionItem[], setList: Dispatch<SetStateAction<SectionItem[]>>, id: number, field: string, value: string) => {
    setList(list.map(item => item.id === id ? { ...item, [field]: value } : item));
  };


  const EditableInput = ({ value, onSave, className, placeholder, formatPrefix = false, formatDash = false, readOnly = false }: EditableInputProps) => {
    const [tempValue, setTempValue] = useState(value);
    const [isEditing, setIsEditing] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      setTempValue(value);
    }, [value]);

    useEffect(() => {
      if (isEditing && textareaRef.current) {
        textareaRef.current.style.height = '0px';
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = scrollHeight + 'px';
        textareaRef.current.focus();
      }
    }, [tempValue, isEditing]);

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSave(tempValue);
        setIsEditing(false);
      }
    };

    const handleBlur = () => {
      onSave(tempValue);
      setIsEditing(false);
    };

    // Always render as <div> when not editing — avoids Chromium PDF textarea bug
    if (!isEditing) {
      const displayValue = tempValue || '';

      // Format dash: "NAME – content" with NAME in pink uppercase bold
      if (formatDash) {
        const dashIndex = displayValue.indexOf(' – ');
        const hasDash = dashIndex > 0;
        return (
          <div
            onClick={() => !readOnly && setIsEditing(true)}
            className={`${className} ${readOnly ? '' : 'cursor-text'} leading-tight whitespace-pre-wrap`}
          >
            {hasDash ? (
              <>
                <span className="font-black text-pink-500 uppercase tracking-widest">{displayValue.slice(0, dashIndex)}</span>
                <span> – </span>
                {(() => {
                  const content = displayValue.slice(dashIndex + 3);
                  const colonIdx = content.indexOf(':');
                  if (colonIdx > 0) {
                    return (
                      <>
                        <span className="font-bold" style={{ fontSize: '1.05em' }}>{content.slice(0, colonIdx + 1)}</span>
                        {content.slice(colonIdx + 1)}
                      </>
                    );
                  }
                  return content;
                })()}
              </>
            ) : (
              displayValue || <span className="text-gray-400">{placeholder}</span>
            )}
          </div>
        );
      }

      // Format prefix: "Label: content" with label in bold
      const colonIndex = displayValue.indexOf(':');
      const hasPrefix = formatPrefix && colonIndex > 0;
      return (
        <div
          onClick={() => !readOnly && setIsEditing(true)}
          className={`${className} ${readOnly ? '' : 'cursor-text'} leading-tight whitespace-pre-wrap`}
        >
          {hasPrefix ? (
            <>
              <span className="font-bold" style={{ fontSize: '1.05em' }}>{displayValue.slice(0, colonIndex + 1)}</span>
              {displayValue.slice(colonIndex + 1)}
            </>
          ) : (
            displayValue || <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
      );
    }

    return (
      <textarea
        ref={textareaRef}
        value={tempValue}
        placeholder={placeholder}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        rows={1}
        className={`${className} resize-none overflow-hidden block leading-tight`}
      />
    );
  };

  const Section = ({ title, icon: Icon, items, setItems, placeholder, color, isTeam = false, printColumns = false, formatDash = false, readOnly = false }: SectionProps) => (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-5 md:p-8 rounded-3xl border-2 ${color} relative overflow-hidden group`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-funny flex items-center gap-2 tracking-wide text-gray-800">
          <Icon size={24} className={color.replace('border-', 'text-')} />
          {title}
        </h2>
        {!readOnly && (
          <button
            onClick={() => addItem(items, setItems, placeholder)}
            className={`p-2 rounded-full hover:scale-110 transition-all no-print ${color.replace('border-', 'bg-').replace('border-', 'text-white')}`}
          >
            <Plus size={18} />
          </button>
        )}
      </div>
      <div className={`${isTeam ? 'flex flex-wrap gap-3' : 'space-y-3'} ${printColumns ? 'print-columns' : ''}`}>
        <AnimatePresence>
          {items.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex items-center gap-3 group/item relative ${isTeam ? 'bg-white/50 p-2 rounded-xl border border-white/50 shadow-sm min-w-30' : ''}`}
            >
              {isTeam && (() => {
                const idx = typeof item.iconIndex === 'number' ? item.iconIndex : 0;
                const teamIcon = TEAM_ICONS[idx % TEAM_ICONS.length];
                return (
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 overflow-hidden">
                    {teamIcon.type === 'svg' ? (
                      <img src={teamIcon.src} alt="" className="w-6 h-6 object-contain" />
                    ) : (
                      <teamIcon.icon size={16} />
                    )}
                  </div>
                );
              })()}

              <EditableInput
                value={item.text}
                onSave={(val: string) => updateItem(items, setItems, item.id, 'text', val)}
                className="flex-1 bg-transparent border-none p-0 text-sm font-medium focus:ring-0 text-gray-700"
                formatPrefix={!isTeam && !formatDash}
                formatDash={formatDash}
                readOnly={readOnly}
              />

              {!readOnly && (
                <button
                  onClick={() => removeItem(items, setItems, item.id)}
                  className={`p-1 text-gray-300 hover:text-red-400 transition-all no-print z-10 ${isTeam ? 'absolute -top-2 -right-2 bg-white rounded-full shadow-md opacity-100' : 'opacity-0 group-hover/item:opacity-100'}`}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );

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
                <ChevronDown size={14} className="opacity-0 group-hover/date:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <div className={`relative group/store mb-2 ${showStoreDropdown ? 'z-110' : 'z-10'}`}>
                <h1 
                  className="text-[clamp(1.8rem,6vw,4.5rem)] font-funny iridescent-text tracking-tight cursor-pointer flex items-center justify-center md:justify-start gap-3 hover:scale-[1.02] transition-transform"
                  onClick={() => !isShared && setShowStoreDropdown(!showStoreDropdown)}
                >
                  KIKO <span className="text-gray-800 uppercase">{selectedStore.split(' ')[1] || 'MILANO'}</span>
                  <ChevronDown size={28} className="text-gray-300 group-hover/store:text-purple-400 transition-colors no-print" />
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
              <div className="flex rounded-full border border-purple-200 overflow-hidden no-print md:absolute md:top-0 md:right-0">
                <button
                  onClick={() => setLang('de')}
                  className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider transition-colors ${lang === 'de' ? 'bg-purple-500 text-white' : 'bg-white/50 text-purple-400 hover:bg-purple-50'}`}
                >
                  DE
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider transition-colors ${lang === 'en' ? 'bg-purple-500 text-white' : 'bg-white/50 text-purple-400 hover:bg-purple-50'}`}
                >
                  EN
                </button>
              </div>
              <div className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] bg-white/50 px-3 py-1 rounded-full border border-purple-100">
                {t('header.month')}: {currentMonth}
              </div>
              <div className="flex gap-3">
                <div className="glass-card p-3 rounded-2xl border-purple-200 flex flex-col items-center min-w-20 md:min-w-[110px]">
                  <History className="text-blue-500 mb-1" size={18} />
                  <EditableInput
                    value={kpis.ly}
                    onSave={(val: string) => setKpis({ ...kpis, ly: val })}
                    className="w-full text-center bg-transparent border-none p-0 text-base font-funny focus:ring-0 text-blue-600"
                    readOnly={isShared}
                  />
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('kpi.ly')}</span>
                </div>
                <div className="glass-card p-3 rounded-2xl border-purple-200 flex flex-col items-center min-w-20 md:min-w-[110px]">
                  <Star className="text-yellow-500 mb-1" size={18} />
                  <EditableInput
                    value={kpis.t1}
                    onSave={(val: string) => setKpis({ ...kpis, t1: val })}
                    className="w-full text-center bg-transparent border-none p-0 text-base font-funny focus:ring-0 text-yellow-600"
                    readOnly={isShared}
                  />
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('kpi.t1')}</span>
                </div>
                <div className="glass-card p-3 rounded-2xl border-purple-200 flex flex-col items-center min-w-20 md:min-w-[110px]">
                  <Sparkles className="text-orange-500 mb-1" size={18} />
                  <EditableInput
                    value={kpis.t2}
                    onSave={(val: string) => setKpis({ ...kpis, t2: val })}
                    className="w-full text-center bg-transparent border-none p-0 text-base font-funny focus:ring-0 text-orange-600"
                    readOnly={isShared}
                  />
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{t('kpi.t2')}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Grid - Two Independent Columns with Mobile Reordering */}
        <main className="px-4 py-6 md:px-10 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-32 md:gap-y-16 items-start">
          {/* Left Column: KPIs, Team, Pausen, To Do */}
          <div className="contents md:flex md:flex-col md:gap-14">
            <div className="order-1">
              <div className="grid grid-cols-3 gap-3 md:gap-6">
                {[
                  { label: t('kpi.todaysTarget'), value: kpis.target, key: 'target', icon: Target, color: 'text-blue-500' },
                  { label: t('kpi.lastYear'), value: kpis.vj, key: 'vj', icon: History, color: 'text-pink-500' },
                  { label: t('kpi.weeksTarget'), value: kpis.targetWeek, key: 'targetWeek', icon: Layout, color: 'text-purple-500' },
                ].map((kpi) => (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    key={kpi.label} 
                    className="glass-card p-3 rounded-2xl border-2 border-white flex flex-col items-center text-center"
                  >
                    <kpi.icon size={18} className={`${kpi.color} mb-1`} />
                    <EditableInput
                      value={kpi.value}
                      onSave={(val: string) => setKpis({ ...kpis, [kpi.key]: val })}
                      className={`w-full text-center bg-transparent border-none p-0 text-lg font-funny focus:ring-0 ${kpi.color}`}
                      readOnly={isShared}
                    />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-tight">{kpi.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="order-3">
              <Section 
                title={t('sections.team')}
                icon={Users}
                items={team}
                setItems={setTeam}
                placeholder={{ text: t('placeholders.name') }}
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
                placeholder={{ text: t('placeholders.breakTime') }}
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
                placeholder={{ text: t('placeholders.task') }}
                color="border-blue-200"
                formatDash
                readOnly={isShared}
              />
            </div>
          </div>

          {/* Right Column: Daily Fokus, Kassen, Abend, Note */}
          <div className="contents md:flex md:flex-col md:gap-14">
            <div className="order-2">
              <Section 
                title={t('sections.dailyFocus')}
                icon={Sparkles}
                items={dailyFokus}
                setItems={setDailyFokus}
                placeholder={{ text: t('placeholders.focusToday') }}
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
                placeholder={{ text: t('placeholders.registerName') }}
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
                placeholder={{ text: t('placeholders.task') }}
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
                placeholder={{ text: t('placeholders.noteInfo') }}
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
