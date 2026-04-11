import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Link, MessageCircle, Mail } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { buildShareUrl } from './share';

export interface ShareMenuProps {
  /** Called when the link has been copied so a parent can show a toast */
  onCopySuccess?: () => void;
}

export function ShareMenu({ onCopySuccess }: ShareMenuProps) {
  const { t, lang } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const getShareUrl = () => buildShareUrl(window.location.href, lang);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    setShowMenu(false);
    onCopySuccess?.();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`${t('share.whatsappText')}${getShareUrl()}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowMenu(false);
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(t('share.emailSubject'));
    const body = encodeURIComponent(`${t('share.emailBody')}${getShareUrl()}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowMenu(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowMenu(!showMenu)}
        className="bg-white text-purple-600 border-2 border-purple-200 px-5 py-3 md:px-8 md:py-4 rounded-full shadow-xl transition-all flex items-center gap-2 md:gap-3 font-funny text-base md:text-lg cursor-pointer"
      >
        <Share2 size={20} />
        <span className="hidden md:inline">{t('ui.share')}</span>
      </motion.button>

      <AnimatePresence>
        {showMenu && (
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
  );
}
