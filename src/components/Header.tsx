import { Calendar, ChevronDown, Heart, Star, Sparkles, History } from 'lucide-react';
import { useTranslation } from '../i18n';
import { usePlanStore, STORE_OPTIONS } from '../domains/plan/planStore';
import { StoreSelector } from '../domains/store-location/StoreSelector';
import { LanguageToggle } from '../shared/LanguageToggle';
import { KpiCard } from '../domains/plan/KpiCard';

export interface HeaderProps {
  formattedDate: string;
  currentMonth: string;
  isShared: boolean;
}

export function Header({ formattedDate, currentMonth, isShared }: HeaderProps) {
  const { t } = useTranslation();

  const rawDate = usePlanStore((s) => s.rawDate);
  const setRawDate = usePlanStore((s) => s.setRawDate);
  const selectedStore = usePlanStore((s) => s.selectedStore);
  const setSelectedStore = usePlanStore((s) => s.setSelectedStore);
  const kpis = usePlanStore((s) => s.kpis);
  const setKpi = usePlanStore((s) => s.setKpi);

  return (
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
                } catch {
                  // Fallback when showPicker isn't supported
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-50"
            />
            {!isShared && (
              <ChevronDown
                size={14}
                className="opacity-0 group-hover/date:opacity-100 transition-opacity pointer-events-none"
              />
            )}
          </div>
          <StoreSelector
            selectedStore={selectedStore}
            storeOptions={STORE_OPTIONS}
            onSelect={setSelectedStore}
            readOnly={isShared}
          />
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
              onSave={(val) => setKpi('ly', val)}
              label={t('kpi.ly')}
              readOnly={isShared}
            />
            <KpiCard
              icon={Star}
              iconColor="text-yellow-500"
              valueColor="text-yellow-600"
              value={kpis.t1}
              onSave={(val) => setKpi('t1', val)}
              label={t('kpi.t1')}
              readOnly={isShared}
            />
            <KpiCard
              icon={Sparkles}
              iconColor="text-orange-500"
              valueColor="text-orange-600"
              value={kpis.t2}
              onSave={(val) => setKpi('t2', val)}
              label={t('kpi.t2')}
              readOnly={isShared}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
