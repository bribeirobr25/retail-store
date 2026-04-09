import { useState, useEffect, useRef } from 'react';
import type { Dispatch, SetStateAction, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
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
interface TaskItem { id: number; name: string; task: string }
type SectionItem = TextItem | TaskItem;

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
}

interface SectionProps {
  title: string;
  icon: LucideIcon;
  items: SectionItem[];
  setItems: Dispatch<SetStateAction<SectionItem[]>>;
  placeholder: Partial<SectionItem>;
  color: string;
  isTask?: boolean;
  isTeam?: boolean;
}

export default function App() {
  const [rawDate, setRawDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStore, setSelectedStore] = useState('Kiko Taui');
  const storeOptions = ["Kiko Taui", "Kiko Alexa", "Kiko Mall", "Kiko Rosenthal", "Kiko Boulevard"];
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [notes, setNotes] = useState<SectionItem[]>([
    { id: 1, text: 'Kundenfeedback: Die Kundin hat den Service von [Name] heute sehr gelobt' },
    { id: 2, text: 'Kundenfeedback: Mehrere Kundinnen fragen nach der Nachlieferung des Lippenstifts [Farbe/Modell].' },
    { id: 3, text: 'Operative Erinnerungen: Die Lampe in Lager austauschen.' },
    { id: 4, text: 'Operative Erinnerungen: Bei der nächsten Bestellung mehr mittelgroße Tüten anfordern.' },
    { id: 5, text: 'Produkt-Highlights: Produkt des Tages: [Produktname] die Vorteile der Feuchtigkeitsversorgung erklären.' },
    { id: 6, text: 'Ziele und Motivation: Es fehlen nur noch 200 €, um unser zusätzliches Wochenziel zu erreichen!' },
    { id: 7, text: 'Kommunikation zwischen den Schichten: Achtung: Die Schublade an Kasse 1 klemmt etwas.' },
    { id: 8, text: 'Kurzes Training: Technischer Tipp: Die neue Mascara sollte in Zickzack-Bewegungen aufgetragen werden, um mehr Volumen zu erzielen.' },
  ]);
  useEffect(() => {
    // A4 portrait: 210x297mm. @page margin: 0, wrapper padding: 10mm each side.
    // Full page at 96dpi: 210/25.4*96 ≈ 793px, 297/25.4*96 ≈ 1123px
    // Content area (minus 10mm padding each side): 190/25.4*96 ≈ 718px, 277/25.4*96 ≈ 1047px
    const A4_CONTENT_WIDTH = 718;
    const A4_CONTENT_HEIGHT = 1047;

    const handleBeforePrint = () => {
      const container = document.querySelector('.print-container') as HTMLElement;
      if (!container) return;

      // Reset zoom to measure natural height
      container.style.zoom = '1';

      // Constrain to A4 width to get accurate print-layout height
      document.documentElement.style.width = A4_CONTENT_WIDTH + 'px';
      document.documentElement.style.overflow = 'visible';
      const contentHeight = container.scrollHeight;
      document.documentElement.style.width = '';
      document.documentElement.style.overflow = '';

      // Apply zoom only if content overflows the page
      if (contentHeight > A4_CONTENT_HEIGHT) {
        container.style.zoom = String(A4_CONTENT_HEIGHT / contentHeight);
      } else {
        container.style.zoom = '';
      }
    };

    const handleAfterPrint = () => {
      document.documentElement.style.width = '';
      document.documentElement.style.overflow = '';
      const container = document.querySelector('.print-container') as HTMLElement;
      if (container) {
        container.style.zoom = '';
      }
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);
  
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

  const [dailyFokus, setDailyFokus] = useState<SectionItem[]>([
    { id: 1, text: 'KPIs: KikoME > 35%; CR > 33%; UPT > 2.5%' },
    { id: 2, text: 'Erhöhung des durchschnittlichen Bonwerts: Zu jedem verkauften Lippenstift einen Lipliner anbieten.' },
    { id: 3, text: 'Zusatzverkauf (Cross-Selling): Nach jedem Verkauf von Foundation oder Puder einen Make-up-Fixierer empfehlen.' },
    { id: 4, text: 'Fokus auf Neuheiten: Die neue Kollektion [Name der Kollektion] allen Kundinnen vorstellen.' },
    { id: 5, text: 'Star-Produkt: Heute liegt der Fokus auf der Mascara [Name] – Ziel: 15 Stück.' },
    { id: 6, text: 'Skincare: Das feuchtigkeitsspendende Serum bei jeder Kundin auf dem Handrücken demonstrieren.' },
    { id: 7, text: 'Aktive Demonstration: Heute mindestens 5 Flash-Make-ups durchführen.' },
    { id: 8, text: 'Kundenbindung: Sicherstellen, dass 100 % der Kundinnen über das Treueprogramm Kiko Rewards informiert sind.' },
    { id: 9, text: 'Premium-Service: Voller Fokus auf eine personalisierte Beratung bei der Wahl des richtigen Foundation-Tons.' },
  ]);

  // Section Item States
  const [team, setTeam] = useState<SectionItem[]>([
    { id: 1, text: 'Name', iconIndex: randomIconIndex() },
    { id: 2, text: 'Name', iconIndex: randomIconIndex() },
    { id: 3, text: 'Name', iconIndex: randomIconIndex() },
  ]);
  const [pausen, setPausen] = useState<SectionItem[]>([{ id: 1, text: 'Name: 12:00 - 13:00' }]);
  const [todo, setTodo] = useState<SectionItem[]>([
    { id: 1, name: 'Name', task: 'Strategische Warenauffüllung: Die Lippenstiftschubladen während der Nachmittagsspitze immer gut gefüllt halten.' },
    { id: 2, name: 'Name', task: 'Tester-Check: Sicherstellen, dass alle Tester sauber sind und ausreichend Produkt enthalten.' },
    { id: 3, name: 'Name', task: 'Eröffnungsroutine (Opening): Das Licht und das Soundsystem im Geschäft einschalten. Den Kassenanfangsbestand prüfen (Kasse 1 und 2). Spiegel und Make-up-Tische reinigen. Alle Testpinsel und Applikatoren hygienisch reinigen.' },
    { id: 4, name: 'Name', task: 'Wartung und Lagerbestand (Maintenance): Die Lippenstifte der Linie [Name der Linie], die gestern ausverkauft waren, wieder auffüllen.' },
    { id: 5, name: 'Name', task: 'Visual Merchandising (VM): Die Preise im Bereich „Last Chance" aktualisieren. Das Hauptschaufenster reinigen (Fingerabdrücke entfernen). Die Produkte der neuen Kollektion gemäß dem VM-Leitfaden neu platzieren. Das Werbebanner am Eingang austauschen.' },
    { id: 6, name: 'Name', task: 'Administration und Team: Die E-Mails des Regionalmanagements prüfen. Die kurze 5-Minuten-Schulung zu [Neues Produkt] durchführen.' },
  ]);
  const [kassen, setKassen] = useState<SectionItem[]>([{ id: 1, text: 'Kasse A: Name' }]);
  const [abend, setAbend] = useState<SectionItem[]>([
    { id: 1, name: 'Name', task: 'Den Kassenabschluss durchführen. Die Geldtasche für die Bankeinzahlung vorbereiten. PowerBi und Stunde Produktivität' },
    { id: 2, name: 'Name', task: 'Pflege der Tester und Hygiene: Alle Tester von Lippenstiften und Lidschatten reinigen und desinfizieren. Die benutzten Augen- und Lippenstifte anspitzen. Die Make-up-Tische und Spiegel im Geschäft reinigen. Die Demonstrationsschwämme und -pinsel waschen oder austauschen.' },
    { id: 3, name: 'Name', task: 'Strategische Warenauffüllung (Restock): Die 10 meistverkauften Produkte (Best Seller) in den Regalen auffüllen. Die Schnellzugriffsschubladen unter den Verkaufstheken auffüllen. Prüfen, ob der Bereich „Neuheiten" vollständig und ordentlich ist. Beschädigte Produkte oder Produkte mit verschmutzter Verpackung aus dem Verkaufsbereich entfernen.' },
    { id: 4, name: 'Name', task: 'Visual Merchandising (VM): Alle Produkte in den Regalen sauber ausrichten (Facing machen). Die Impulszone an der Kasse ordentlich auffüllen und organisieren. Sicherstellen, dass Preise und Etiketten sichtbar und korrekt sind.' },
    { id: 5, name: 'Name', task: 'Sicherheit und operativer Ablauf: Die Innenbeleuchtung ausschalten, nur die notwendige Beleuchtung bzw. Schaufensterbeleuchtung eingeschaltet lassen. Prüfen, ob alle Lagerschubladen und Schränke abgeschlossen sind. Den Müll aus dem Geschäft und aus dem Pausenraum entsorgen. Die Alarmanlage aktivieren und die Haupteingangstür abschließen.' },
    { id: 6, name: 'Name', task: 'Kommunikation (Handover): Eine Notiz für die Frühschichtleitung zu besonderen Vorkommnissen hinterlassen. Den finalen KPI des Tages festhalten, zum Beispiel: Wir haben das Ziel für den durchschnittlichen Bonwert erreicht!' },
  ]);

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


  const EditableInput = ({ value, onSave, className, placeholder, formatPrefix = false }: EditableInputProps) => {
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
      const colonIndex = displayValue.indexOf(':');
      const hasPrefix = formatPrefix && colonIndex > 0;
      return (
        <div
          onClick={() => setIsEditing(true)}
          className={`${className} cursor-text leading-tight whitespace-pre-wrap`}
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

  const Section = ({ title, icon: Icon, items, setItems, placeholder, color, isTask = false, isTeam = false }: SectionProps) => (
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
          {items.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex items-center gap-3 group/item relative ${isTeam ? 'bg-white/50 p-2 rounded-xl border border-white/50 shadow-sm min-w-30' : ''}`}
            >
              {isTeam && (() => {
                const idx = 'iconIndex' in item && typeof item.iconIndex === 'number' ? item.iconIndex : 0;
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

              {isTask && 'name' in item ? (
                <div className="flex flex-1 gap-2 task-name-row">
                  <EditableInput
                    placeholder="Nome"
                    value={item.name}
                    onSave={(val: string) => updateItem(items, setItems, item.id, 'name', val)}
                    className="shrink-0 bg-transparent border-none p-0 text-sm font-black text-pink-500 uppercase tracking-widest focus:ring-0"
                  />
                  <EditableInput
                    placeholder="Tarefa"
                    value={item.task}
                    onSave={(val: string) => updateItem(items, setItems, item.id, 'task', val)}
                    className="flex-1 bg-transparent border-none p-0 text-sm font-medium focus:ring-0 text-gray-700"
                    formatPrefix
                  />
                </div>
              ) : 'text' in item ? (
                <EditableInput
                  value={item.text}
                  onSave={(val: string) => updateItem(items, setItems, item.id, 'text', val)}
                  className="flex-1 bg-transparent border-none p-0 text-sm font-medium focus:ring-0 text-gray-700"
                  formatPrefix={!isTeam}
                />
              ) : null}

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
              <div className={`relative group/store mb-2 ${showStoreDropdown ? 'z-110' : 'z-10'}`}>
                <h1 
                  className="text-[clamp(1.8rem,6vw,4.5rem)] font-funny iridescent-text tracking-tight cursor-pointer flex items-center justify-center md:justify-start gap-3 hover:scale-[1.02] transition-transform"
                  onClick={() => setShowStoreDropdown(!showStoreDropdown)}
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

            <div className="flex flex-col items-center gap-2">
              <div className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] bg-white/50 px-3 py-1 rounded-full border border-purple-100">
                Monat: {currentMonth}
              </div>
              <div className="flex gap-3">
                <div className="glass-card p-3 rounded-2xl border-purple-200 flex flex-col items-center min-w-20">
                  <History className="text-blue-500 mb-1" size={18} />
                  <EditableInput 
                    value={kpis.ly}
                    onSave={(val: string) => setKpis({ ...kpis, ly: val })}
                    className="w-full text-center bg-transparent border-none p-0 text-base font-funny focus:ring-0 text-blue-600"
                  />
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">LY</span>
                </div>
                <div className="glass-card p-3 rounded-2xl border-purple-200 flex flex-col items-center min-w-20">
                  <Star className="text-yellow-500 mb-1" size={18} />
                  <EditableInput 
                    value={kpis.t1}
                    onSave={(val: string) => setKpis({ ...kpis, t1: val })}
                    className="w-full text-center bg-transparent border-none p-0 text-base font-funny focus:ring-0 text-yellow-600"
                  />
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">T1</span>
                </div>
                <div className="glass-card p-3 rounded-2xl border-purple-200 flex flex-col items-center min-w-20">
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
                placeholder={{ text: 'Name' }}
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
                placeholder={{ text: 'Name: 13:00 - 14:00' }}
                color="border-pink-200"
              />
            </div>

            <div className="order-6">
              <Section 
                title="To Do" 
                icon={CheckSquare} 
                items={todo} 
                setItems={setTodo} 
                placeholder={{ name: 'Name', task: 'Task' }}
                color="border-blue-200"
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
                placeholder={{ text: 'Was ist der Fokus heute?' }}
                color="border-pink-100"
              />
            </div>

            <div className="order-5">
              <Section 
                title="Kassen" 
                icon={ShoppingBag} 
                items={kassen} 
                setItems={setKassen} 
                placeholder={{ text: 'Kasse A/B: Name' }}
                color="border-purple-200"
              />
            </div>

            <div className="order-7">
              <Section 
                title="Abend" 
                icon={Moon} 
                items={abend} 
                setItems={setAbend} 
                placeholder={{ name: 'Name', task: 'Task' }}
                color="border-indigo-200"
                isTask={true}
              />
            </div>

            <div className="order-8">
              <Section 
                title="Note" 
                icon={FileText} 
                items={notes} 
                setItems={setNotes} 
                placeholder={{ text: 'Thema: Information' }}
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
          onClick={() => window.print()}
          className="bg-linear-to-r from-pink-500 to-purple-600 text-white px-5 py-3 md:px-8 md:py-4 rounded-full shadow-2xl transition-all flex items-center gap-2 md:gap-3 font-funny text-base md:text-lg cursor-pointer"
        >
          <FileText size={20} />
          <span className="hidden md:inline">PDF generieren</span>
          <span className="md:hidden">PDF</span>
        </motion.button>
      </div>
    </div>
  );
}
