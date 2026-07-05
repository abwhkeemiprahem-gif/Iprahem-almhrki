import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { trackEvent } from '../lib/analytics';

export default function ShareFloatingButton() {
  const { lang, dir } = useLanguage();
  const [showToast, setShowToast] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareTitle = lang === 'ar'
    ? 'موقع المهندس إبراهيم المحرقي | مستشار هندسة النظم السيادية'
    : 'Eng. Ibrahim Al-Muharqi | Sovereign Systems Consultant';
    
  const shareText = lang === 'ar'
    ? 'أنصحك بزيارة الموقع الرسمي للمستشار التقني م. إبراهيم المحرقي للحلول البرمجية المستقلة، هندسة النظم السيادية، ومراجعة أمان الأكواد وقواعد البيانات.'
    : 'I recommend visiting the official portfolio of Eng. Ibrahim Al-Muharqi for high-end sovereign systems engineering, code security audits, and robust SaaS solutions.';

  const handleShareClick = async () => {
    const shareUrl = window.location.origin + window.location.pathname;

    trackEvent('share_click', undefined, {
      method: navigator.share ? 'native_share_api' : 'clipboard_copy',
      lang
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or share failed, fallback quietly
        console.log('Share was cancelled or failed:', error);
      }
    } else {
      // Fallback: Clipboard Copy
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setShowToast(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      } catch (err) {
        console.error('Could not copy site link to clipboard:', err);
      }
    }
  };

  return (
    <div className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'left-6'} z-50 font-mono print:hidden flex items-center gap-3`}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            className="bg-slate-900 border border-cyan-500/30 px-3.5 py-2 shadow-2xl text-xs text-cyan-400 font-bold flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>
              {lang === 'ar' ? 'تم نسخ رابط الموقع بنجاح!' : 'Website link copied successfully!'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Share Button */}
      <motion.button
        onClick={handleShareClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-slate-900 border-2 border-cyan-500 text-cyan-400 flex flex-col items-center justify-center cursor-pointer relative group shadow-[0_0_20px_rgba(6,182,212,0.15)] overflow-hidden"
        title={lang === 'ar' ? 'شارك موقع المهندس' : 'Share Consultant Website'}
      >
        <span className="absolute -inset-1 bg-cyan-500/10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full" />
        
        {copied ? (
          <Check className="w-5 h-5 text-emerald-400 z-10" />
        ) : (
          <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 z-10" />
        )}
        
        <span className="text-[7px] font-bold text-slate-400 uppercase mt-1 tracking-tighter leading-none z-10 px-1 text-center">
          {lang === 'ar' ? 'شارك' : 'SHARE'}
        </span>
      </motion.button>

    </div>
  );
}
