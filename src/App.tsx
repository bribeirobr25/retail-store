/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Store, 
  Users,
  User,
  Target, 
  CheckSquare, 
  TrendingUp, 
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
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  History
} from 'lucide-react';

export default function App() {
  const [rawDate, setRawDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStore, setSelectedStore] = useState('Kiko Taui');
  const storeOptions = ["Kiko Taui", "Kiko Alexa", "Kiko Mall", "Kiko Rosenthal", "Kiko Boulevard"];
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [notes, setNotes] = useState([{ id: 1, text: 'Notizen hier schreiben...' }]);
  
  const formattedDate = new Date(rawDate + 'T12:00:00').toLocaleDateString('de-DE', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const currentMonth = new Date(rawDate + 'T12:00:00').toLocaleDateString('de-DE', { 
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

  const [dailyFokus, setDailyFokus] = useState([{ id: 1, text: 'Lançamento Nova Coleção' }]);

  // Section Item States
  const [team, setTeam] = useState([{ id: 1, text: 'Simone' }, { id: 2, text: 'Tara' }]);
  const [pausen, setPausen] = useState([{ id: 1, text: 'Tara: 12:00 - 12:30' }]);
  const [todo, setTodo] = useState([{ id: 1, name: 'Simone', task: 'Reposição de Batons', checked: false }]);
  const [kassen, setKassen] = useState([{ id: 1, text: 'Kasse A: Simone' }]);
  const [abend, setAbend] = useState([{ id: 1, name: 'Tara', task: 'Fechamento de Caixa', checked: false }]);

  const addItem = (list: any[], setList: Function, placeholder: any) => {
    const newItem = { id: Date.now(), ...placeholder, checked: false };
    setList([...list, newItem]);
  };

  const removeItem = (list: any[], setList: Function, id: number) => {
    setList(list.filter(item => item.id !== id));
  };

  const updateItem = (list: any[], setList: Function, id: number, field: string, value: string) => {
    setList(list.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const toggleCheck = (list: any[], setList: Function, id: number) => {
    setList(list.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const EditableInput = ({ value, onSave, className, placeholder }: any) => {
    const [tempValue, setTempValue] = useState(value);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      setTempValue(value);
    }, [value]);

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = '0px';
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = scrollHeight + 'px';
      }
    }, [tempValue]);

    const handleKeyDown = (e: any) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSave(tempValue);
        e.currentTarget.blur();
      }
    };

    return (
      <textarea
        ref={textareaRef}
        value={tempValue}
        placeholder={placeholder}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={() => onSave(tempValue)}
        onKeyDown={handleKeyDown}
        rows={1}
        className={`${className} resize-none overflow-hidden block leading-tight`}
      />
    );
  };

  const Section = ({ title, icon: Icon, items, setItems, placeholder, color, isChecklist = false, isTask = false, isTeam = false }: any) => (
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
        <button 
          onClick={() => addItem(items, setItems, placeholder)}
          className={`p-2 rounded-full hover:scale-110 transition-all no-print ${color.replace('border-', 'bg-').replace('border-', 'text-white')}`}
        >
          <Plus size={18} />
        </button>
      </div>
      <div className={`${isTeam ? 'flex flex-wrap gap-3' : 'space-y-3'}`}>
        <AnimatePresence>
          {items.map((item: any) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex items-center gap-3 group/item relative ${isTeam ? 'bg-white/50 p-2 rounded-xl border border-white/50 shadow-sm min-w-[120px]' : ''}`}
            >
              {isChecklist && (
                <button 
                  onClick={() => toggleCheck(items, setItems, item.id)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${item.checked ? 'bg-green-400 border-green-400' : 'border-gray-300'}`}
                >
                  {item.checked && <CheckCircle2 size={12} className="text-white" />}
                </button>
              )}
              
              {isTeam && (
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
                  <User size={16} />
                </div>
              )}

              {isTask ? (
                <div className="flex flex-1 gap-2">
                  <EditableInput 
                    placeholder="Nome"
                    value={item.name}
                    onSave={(val: string) => updateItem(items, setItems, item.id, 'name', val)}
                    className={`w-1/3 bg-transparent border-none p-0 text-sm font-black text-pink-500 uppercase tracking-widest focus:ring-0 ${item.checked ? 'text-gray-300' : ''}`}
                  />
                  <EditableInput 
                    placeholder="Tarefa"
                    value={item.task}
                    onSave={(val: string) => updateItem(items, setItems, item.id, 'task', val)}
                    className={`flex-1 bg-transparent border-none p-0 text-sm font-medium focus:ring-0 ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}
                  />
                </div>
              ) : (
                <EditableInput 
                  value={item.text}
                  onSave={(val: string) => updateItem(items, setItems, item.id, 'text', val)}
                  className={`flex-1 bg-transparent border-none p-0 text-sm font-medium focus:ring-0 ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}
                />
              )}

              <button 
                onClick={() => removeItem(items, setItems, item.id)}
                className={`p-1 text-gray-300 hover:text-red-400 transition-all no-print z-10 ${isTeam ? 'absolute -top-2 -right-2 bg-white rounded-full shadow-md opacity-100' : 'opacity-0 group-hover/item:opacity-100'}`}
              >
                <Trash2 size={14} />
              </button>
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
        className="max-w-7xl mx-auto glass-card rounded-[3rem] overflow-hidden border-4 border-white/50 flex flex-col min-h-[1100px] print-container bubbly-shadow"
      >
        {/* Header Section - Colorful & Funny */}
        <header className="relative p-8 bg-gradient-to-r from-[#e2d1f9] via-[#fdfcfb] to-[#e2d1f9] z-30">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden no-print">
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

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-purple-600 mb-6 relative group/date cursor-pointer z-30 w-fit mx-auto md:mx-0">
                <Calendar size={18} className="pointer-events-none" />
                <span className="text-xs font-black uppercase tracking-widest text-purple-600 transition-colors group-hover/date:text-pink-500 pointer-events-none">
                  {formattedDate}
                </span>
                <input 
                  type="date" 
                  value={rawDate} 
                  onChange={(e) => setRawDate(e.target.value)}
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
              <div className={`relative group/store mb-2 ${showStoreDropdown ? 'z-[110]' : 'z-10'}`}>
                <h1 
                  className="text-[clamp(1.8rem,6vw,4.5rem)] font-funny iridescent-text tracking-tight cursor-pointer flex items-center justify-center md:justify-start gap-3 hover:scale-[1.02] transition-transform"
                  onClick={() => setShowStoreDropdown(!showStoreDropdown)}
                >
                  KIKO <span className="text-gray-800 uppercase">{selectedStore.split(' ')[1] || 'MILANO'}</span>
                  <ChevronDown size={28} className="text-gray-300 group-hover/store:text-purple-400 transition-colors no-print" />
                </h1>
                
                {showStoreDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-[2rem] shadow-2xl border-4 border-purple-50 z-[120] overflow-hidden no-print animate-in fade-in zoom-in duration-200">
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

            <div className="flex flex-col items-center gap-2">
              <div className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] bg-white/50 px-3 py-1 rounded-full border border-purple-100">
                Monat: {currentMonth}
              </div>
              <div className="flex gap-3">
                <div className="glass-card p-3 rounded-2xl border-purple-200 flex flex-col items-center min-w-[80px]">
                  <History className="text-blue-500 mb-1" size={18} />
                  <EditableInput 
                    value={kpis.ly}
                    onSave={(val: string) => setKpis({ ...kpis, ly: val })}
                    className="w-full text-center bg-transparent border-none p-0 text-base font-funny focus:ring-0 text-blue-600"
                  />
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">LY</span>
                </div>
                <div className="glass-card p-3 rounded-2xl border-purple-200 flex flex-col items-center min-w-[80px]">
                  <Star className="text-yellow-500 mb-1" size={18} />
                  <EditableInput 
                    value={kpis.t1}
                    onSave={(val: string) => setKpis({ ...kpis, t1: val })}
                    className="w-full text-center bg-transparent border-none p-0 text-base font-funny focus:ring-0 text-yellow-600"
                  />
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">T1</span>
                </div>
                <div className="glass-card p-3 rounded-2xl border-purple-200 flex flex-col items-center min-w-[80px]">
                  <Sparkles className="text-orange-500 mb-1" size={18} />
                  <EditableInput 
                    value={kpis.t2}
                    onSave={(val: string) => setKpis({ ...kpis, t2: val })}
                    className="w-full text-center bg-transparent border-none p-0 text-base font-funny focus:ring-0 text-orange-600"
                  />
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">T2</span>
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
                  { label: 'Today\'s Target', value: kpis.target, key: 'target', icon: Target, color: 'text-blue-500' },
                  { label: 'LY', value: kpis.vj, key: 'vj', icon: History, color: 'text-pink-500' },
                  { label: 'Week\'s Target', value: kpis.targetWeek, key: 'targetWeek', icon: Layout, color: 'text-purple-500' },
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
                    />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-tight">{kpi.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="order-3">
              <Section 
                title="Team" 
                icon={Users} 
                items={team} 
                setItems={setTeam} 
                placeholder={{ text: 'Nome' }} 
                color="border-yellow-200"
                isTeam={true}
              />
            </div>
            
            <div className="order-4">
              <Section 
                title="Pausen" 
                icon={Coffee} 
                items={pausen} 
                setItems={setPausen} 
                placeholder={{ text: 'Nome: 00:00 - 00:00' }} 
                color="border-pink-200"
              />
            </div>

            <div className="order-6">
              <Section 
                title="To Do" 
                icon={CheckSquare} 
                items={todo} 
                setItems={setTodo} 
                placeholder={{ name: 'Nome', task: 'Tarefa' }} 
                color="border-blue-200"
                isChecklist={true}
                isTask={true}
              />
            </div>
          </div>

          {/* Right Column: Daily Fokus, Kassen, Abend, Note */}
          <div className="contents md:flex md:flex-col md:gap-14">
            <div className="order-2">
              <Section 
                title="Daily Fokus" 
                icon={Sparkles} 
                items={dailyFokus} 
                setItems={setDailyFokus} 
                placeholder={{ text: 'Was ist der Fokus hoje?' }} 
                color="border-pink-100"
              />
            </div>

            <div className="order-5">
              <Section 
                title="Kassen" 
                icon={ShoppingBag} 
                items={kassen} 
                setItems={setKassen} 
                placeholder={{ text: 'Kasse: Nome' }} 
                color="border-purple-200"
              />
            </div>

            <div className="order-7">
              <Section 
                title="Abend" 
                icon={Moon} 
                items={abend} 
                setItems={setAbend} 
                placeholder={{ name: 'Nome', task: 'Tarefa' }} 
                color="border-indigo-200"
                isChecklist={true}
                isTask={true}
              />
            </div>

            <div className="order-8">
              <Section 
                title="Note" 
                icon={FileText} 
                items={notes} 
                setItems={setNotes} 
                placeholder={{ text: 'Notizen hier schreiben...' }} 
                color="border-gray-200"
              />
            </div>
          </div>
        </main>
      </motion.div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 flex flex-col items-end gap-2 no-print z-50">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setTimeout(() => {
              window.print();
            }, 100);
          }}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-3 md:px-8 md:py-4 rounded-full shadow-2xl transition-all flex items-center gap-2 md:gap-3 font-funny text-base md:text-lg cursor-pointer"
        >
          <FileText size={20} />
          <span className="hidden md:inline">PDF generieren</span>
          <span className="md:hidden">PDF</span>
        </motion.button>
      </div>
    </div>
  );
}
