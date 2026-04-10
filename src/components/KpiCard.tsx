import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { EditableInput } from './EditableInput';

export interface KpiCardProps {
  icon: LucideIcon;
  /** Tailwind text-* class for the icon and value (e.g. 'text-blue-500'/'text-blue-600') */
  iconColor: string;
  valueColor: string;
  value: string;
  onSave: (val: string) => void;
  label: string;
  readOnly?: boolean;
  /** 'header' = top banner KPIs (LY/T1/T2). 'body' = main grid KPIs. */
  variant?: 'header' | 'body';
}

export function KpiCard({
  icon: Icon,
  iconColor,
  valueColor,
  value,
  onSave,
  label,
  readOnly = false,
  variant = 'header',
}: KpiCardProps) {
  if (variant === 'body') {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="glass-card p-3 rounded-2xl border-2 border-white flex flex-col items-center text-center"
      >
        <Icon size={18} className={`${iconColor} mb-1`} />
        <EditableInput
          value={value}
          onSave={onSave}
          className={`w-full text-center bg-transparent border-none p-0 text-lg font-funny focus:ring-0 ${valueColor}`}
          readOnly={readOnly}
        />
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-tight">
          {label}
        </span>
      </motion.div>
    );
  }

  // header variant
  return (
    <div className="glass-card p-3 rounded-2xl border-purple-200 flex flex-col items-center min-w-20 md:min-w-[90px] lg:min-w-[110px]">
      <Icon className={`${iconColor} mb-1`} size={18} />
      <EditableInput
        value={value}
        onSave={onSave}
        className={`w-full text-center bg-transparent border-none p-0 text-base font-funny focus:ring-0 ${valueColor}`}
        readOnly={readOnly}
      />
      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}
