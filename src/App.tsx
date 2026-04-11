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

import { Section } from './components/Section';
import { Header } from './components/Header';
import { KpiCard } from './components/KpiCard';
import { FloatingActions } from './domains/sharing/FloatingActions';
import { usePlanStore } from './store/planStore';

export default function App() {
  const { t, tArray, locale } = useTranslation();
  const isShared = new URLSearchParams(window.location.search).get('mode') === 'shared';

  // After trimming the JSON defaults to a single entry per section,
  // tArray(key)[0] is always defined — but TS can't see that. Helper guards it.
  const placeholder = (key: string) => tArray(key)[0] ?? '';

  // Plan state from the Zustand store. rawDate is also read here so the
  // formattedDate calculation can use it; the Header reads it directly too.
  const rawDate = usePlanStore((s) => s.rawDate);
  const kpis = usePlanStore((s) => s.kpis);
  const setKpi = usePlanStore((s) => s.setKpi);
  const team = usePlanStore((s) => s.team);
  const setTeam = usePlanStore((s) => s.setTeam);
  const pausen = usePlanStore((s) => s.pausen);
  const setPausen = usePlanStore((s) => s.setPausen);
  const todo = usePlanStore((s) => s.todo);
  const setTodo = usePlanStore((s) => s.setTodo);
  const kassen = usePlanStore((s) => s.kassen);
  const setKassen = usePlanStore((s) => s.setKassen);
  const abend = usePlanStore((s) => s.abend);
  const setAbend = usePlanStore((s) => s.setAbend);
  const dailyFokus = usePlanStore((s) => s.dailyFokus);
  const setDailyFokus = usePlanStore((s) => s.setDailyFokus);
  const notes = usePlanStore((s) => s.notes);
  const setNotes = usePlanStore((s) => s.setNotes);

  const formattedDate = new Date(rawDate + 'T12:00:00').toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const currentMonth = new Date(rawDate + 'T12:00:00').toLocaleDateString(locale, {
    month: 'long',
  });

  return (
    <div className="min-h-screen p-2 md:p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-7xl mx-auto glass-card rounded-[3rem] overflow-hidden border-4 border-white/50 flex flex-col min-h-275 print-container bubbly-shadow"
      >
        <Header
          formattedDate={formattedDate}
          currentMonth={currentMonth}
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
                  onSave={(val) => setKpi('target', val)}
                  label={t('kpi.todaysTarget')}
                  readOnly={isShared}
                />
                <KpiCard
                  variant="body"
                  icon={History}
                  iconColor="text-pink-500"
                  valueColor="text-pink-500"
                  value={kpis.vj}
                  onSave={(val) => setKpi('vj', val)}
                  label={t('kpi.lastYear')}
                  readOnly={isShared}
                />
                <KpiCard
                  variant="body"
                  icon={Layout}
                  iconColor="text-purple-500"
                  valueColor="text-purple-500"
                  value={kpis.targetWeek}
                  onSave={(val) => setKpi('targetWeek', val)}
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
