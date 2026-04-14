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

import { Section } from './domains/plan/Section';
import { Header } from './shared/Header';
import { KpiCard } from './domains/plan/KpiCard';
import { FloatingActions } from './domains/sharing/FloatingActions';
import { usePlanStore } from './domains/plan/planStore';

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
  const breaks = usePlanStore((s) => s.breaks);
  const setBreaks = usePlanStore((s) => s.setBreaks);
  const todo = usePlanStore((s) => s.todo);
  const setTodo = usePlanStore((s) => s.setTodo);
  const registers = usePlanStore((s) => s.registers);
  const setRegisters = usePlanStore((s) => s.setRegisters);
  const eveningShift = usePlanStore((s) => s.eveningShift);
  const setEveningShift = usePlanStore((s) => s.setEveningShift);
  const dailyFocus = usePlanStore((s) => s.dailyFocus);
  const setDailyFocus = usePlanStore((s) => s.setDailyFocus);
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
          {/* Left Column: KPIs, Team, Breaks, Tasks */}
          <div className="contents md:flex md:flex-col md:gap-6 lg:gap-14">
            <div className="order-1">
              <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                <KpiCard
                  variant="body"
                  icon={Target}
                  iconColor="text-blue-500"
                  valueColor="text-blue-500"
                  value={kpis.dailyTarget}
                  onSave={(val) => setKpi('dailyTarget', val)}
                  label={t('kpi.todaysTarget')}
                  readOnly={isShared}
                />
                <KpiCard
                  variant="body"
                  icon={History}
                  iconColor="text-pink-500"
                  valueColor="text-pink-500"
                  value={kpis.lastYearDay}
                  onSave={(val) => setKpi('lastYearDay', val)}
                  label={t('kpi.lastYear')}
                  readOnly={isShared}
                />
                <KpiCard
                  variant="body"
                  icon={Layout}
                  iconColor="text-purple-500"
                  valueColor="text-purple-500"
                  value={kpis.weeklyTarget}
                  onSave={(val) => setKpi('weeklyTarget', val)}
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
                items={breaks}
                setItems={setBreaks}
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

          {/* Right Column: Daily Focus, Registers, Evening Shift, Notes */}
          <div className="contents md:flex md:flex-col md:gap-6 lg:gap-14">
            <div className="order-2">
              <Section
                title={t('sections.dailyFocus')}
                icon={Sparkles}
                items={dailyFocus}
                setItems={setDailyFocus}
                placeholderText={placeholder('defaults.focus')}
                color="border-pink-100"
                readOnly={isShared}
              />
            </div>

            <div className="order-5">
              <Section
                title={t('sections.registers')}
                icon={ShoppingBag}
                items={registers}
                setItems={setRegisters}
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
                items={eveningShift}
                setItems={setEveningShift}
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
