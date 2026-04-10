import { useState, useEffect } from 'react';
import { useTranslation } from './i18n';
import { motion } from 'motion/react';
import {
  Users,
  Target,
  CheckSquare,
  Moon,
  FileText,
  ShoppingBag,
  Layout,
  Sparkles,
  Coffee,
  History,
} from 'lucide-react';

import type { SectionItem, KpiData } from './types';
import { STORAGE_KEY, loadSavedData, type SavedData } from './lib/storage';
import { randomIconIndex } from './lib/teamIcons';
import { Section } from './components/Section';
import { Header } from './components/Header';
import { KpiCard } from './components/KpiCard';
import { FloatingActions } from './components/FloatingActions';

export default function App() {
  const { t, tArray, locale } = useTranslation();
  const isShared = new URLSearchParams(window.location.search).get('mode') === 'shared';

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
        <Header
          rawDate={rawDate}
          onDateChange={setRawDate}
          formattedDate={formattedDate}
          currentMonth={currentMonth}
          selectedStore={selectedStore}
          storeOptions={storeOptions}
          onStoreSelect={setSelectedStore}
          kpis={kpis}
          onKpiChange={(key, val) => setKpis({ ...kpis, [key]: val })}
          isShared={isShared}
        />

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

      <FloatingActions />
    </div>
  );
}
