import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface StoreSelectorProps {
  selectedStore: string;
  storeOptions: readonly string[];
  onSelect: (store: string) => void;
  readOnly?: boolean;
}

export function StoreSelector({
  selectedStore,
  storeOptions,
  onSelect,
  readOnly = false,
}: StoreSelectorProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className={`relative group/store mb-2 ${showDropdown ? 'z-110' : 'z-10'}`}>
      <h1
        className="text-[clamp(1.8rem,6vw,4.5rem)] font-funny iridescent-text tracking-tight cursor-pointer flex items-center justify-center md:justify-start gap-3 hover:scale-[1.02] transition-transform"
        onClick={() => !readOnly && setShowDropdown(!showDropdown)}
      >
        <span className="text-gray-800 uppercase">{selectedStore}</span>
        {!readOnly && (
          <ChevronDown
            size={28}
            className="text-purple-400 group-hover/store:text-pink-500 transition-colors no-print drop-shadow-sm"
          />
        )}
      </h1>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-4xl shadow-2xl border-4 border-purple-50 z-120 overflow-hidden no-print animate-in fade-in zoom-in duration-200">
          {storeOptions.map((option) => (
            <div
              key={option}
              className="px-6 py-4 hover:bg-purple-50 cursor-pointer text-lg font-black text-purple-600 transition-colors border-b-2 border-purple-50 last:border-none flex items-center justify-between group/item"
              onClick={() => {
                onSelect(option);
                setShowDropdown(false);
              }}
            >
              {option}
              <div
                className={`w-3 h-3 rounded-full transition-all ${
                  selectedStore === option
                    ? 'bg-pink-500 scale-125'
                    : 'bg-gray-100 group-hover/item:bg-purple-200'
                }`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
