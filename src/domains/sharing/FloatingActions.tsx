import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { analytics } from '../../shared/services/analytics';
import { ShareMenu } from './ShareMenu';

export function FloatingActions() {
  const { t } = useTranslation();
  const [showToast, setShowToast] = useState(false);

  const handleCopySuccess = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 flex flex-col items-end gap-3 no-print z-50">
        <ShareMenu onCopySuccess={handleCopySuccess} />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            analytics.track('pdf_generated');
            window.print();
          }}
          className="bg-linear-to-r from-pink-500 to-purple-600 text-white px-5 py-3 md:px-8 md:py-4 rounded-full shadow-2xl transition-all flex items-center gap-2 md:gap-3 font-funny text-base md:text-lg cursor-pointer"
        >
          <FileText size={20} />
          <span className="hidden md:inline">{t('ui.generatePdf')}</span>
          <span className="md:hidden">{t('ui.generatePdfShort')}</span>
        </motion.button>
      </div>

      {/* Share toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 md:bottom-28 md:right-8 bg-green-500 text-white px-6 py-3 rounded-full shadow-xl font-medium text-sm z-50 no-print"
          >
            {t('ui.linkCopied')}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
