import type { Dispatch, SetStateAction } from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2 } from 'lucide-react';

import type { SectionItem } from '../shared/types';
import { addItem, removeItem, updateItem } from '../lib/listOps';
import { getTeamIcon } from '../domains/team/teamIcons';
import { EditableInput } from '../shared/EditableInput';

export interface SectionProps {
  title: string;
  icon: LucideIcon;
  items: SectionItem[];
  setItems: Dispatch<SetStateAction<SectionItem[]>>;
  placeholderText: string;
  color: string;
  isTeam?: boolean;
  printColumns?: boolean;
  formatDash?: boolean;
  readOnly?: boolean;
}

export function Section({
  title,
  icon: Icon,
  items,
  setItems,
  placeholderText,
  color,
  isTeam = false,
  printColumns = false,
  formatDash = false,
  readOnly = false,
}: SectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-5 md:p-6 lg:p-8 rounded-3xl border-2 ${color} relative overflow-hidden group`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-funny flex items-center gap-2 tracking-wide text-gray-800">
          <Icon size={24} className={color.replace('border-', 'text-')} />
          {title}
        </h2>
        {!readOnly && (
          <button
            onClick={() => addItem(items, setItems)}
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
                const teamIcon = getTeamIcon(idx);
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
                placeholder={placeholderText}
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
}
