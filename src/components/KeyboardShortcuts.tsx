import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import { Keyboard, HelpCircle, X } from 'lucide-react';

interface KeyboardShortcutsProps {
  onToggleAdmin: () => void;
}

export default function KeyboardShortcuts({ onToggleAdmin }: KeyboardShortcutsProps) {
  const { lang, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      let isTyping = false;
      if (activeEl) {
        const tagName = activeEl.tagName.toLowerCase();
        if (
          tagName === 'input' || 
          tagName === 'textarea' || 
          tagName === 'select' || 
          activeEl.getAttribute('contenteditable') === 'true'
        ) {
          isTyping = true;
        }
      }

      const key = e.key.toLowerCase();

      // Global hotkey: Ctrl + K or Cmd + K (Quick Search)
      if ((e.ctrlKey || e.metaKey) && key === 'k') {
        e.preventDefault();
        const input = document.getElementById('portfolio-search');
        if (input) {
          (input as HTMLInputElement).focus();
          const section = document.getElementById('portfolio');
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }
        return;
      }

      // Global hotkey: Alt + D (Toggle Dashboard)
      if (e.altKey && key === 'd') {
        e.preventDefault();
        onToggleAdmin();
        return;
      }

      // Ignore single letter shortcuts if the user is typing
      if (isTyping) {
        return;
      }

      // Help menu trigger: "?" (Shift + /)
      if (e.key === '?') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        return;
      }

      // Escape close help modal
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        return;
      }

      // Section Navigation
      if (key === 'h') {
        const target = document.getElementById('hero');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (key === 'p') {
        const target = document.getElementById('portfolio');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (key === 's') {
        const target = document.getElementById('services');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (key === 'c') {
        const target = document.getElementById('contact');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (key === 'a') {
        e.preventDefault();
        onToggleAdmin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleAdmin, isOpen]);

  const shortcutList = [
    { key: 'Ctrl + K', descAr: 'البحث الفوري والوصول السريع للمشاريع', descEn: 'Quick search portfolio projects' },
    { key: 'Alt + D', descAr: 'فتح / إغلاق لوحة التحكم السحابية', descEn: 'Toggle Admin Cloud Dashboard' },
    { key: 'H', descAr: 'الانتقال إلى البداية / الواجهة الترحيبية', descEn: 'Navigate to Hero / Home' },
    { key: 'P', descAr: 'الانتقال إلى معرض المشاريع والبحث', descEn: 'Navigate to Projects Portfolio' },
    { key: 'S', descAr: 'الانتقال إلى الخدمات والاستشارات التقنية', descEn: 'Navigate to Services & Consulting' },
    { key: 'C', descAr: 'الانتقال إلى نموذج التواصل والدفع الرقمي', descEn: 'Navigate to Contact & Payments' },
    { key: 'A', descAr: 'فتح / إغلاق لوحة تحكم الإدارة (Kernel)', descEn: 'Toggle Admin Dashboard (Kernel)' },
    { key: '?', descAr: 'عرض / إخفاء قائمة المساعدة الذكية هذه', descEn: 'Toggle this keyboard help menu' },
  ];

  return (
    <>
      {/* Sleek Floating Key Indicator (Bottom-Left) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-slate-950/80 hover:bg-white text-slate-400 hover:text-slate-950 border border-slate-800 hover:border-white p-3 rounded-none transition-all duration-300 group shadow-lg shadow-black/50 flex items-center justify-center cursor-pointer"
        title={lang === 'ar' ? 'اختصارات لوحة المفاتيح (?)' : 'Keyboard Shortcuts (?)'}
      >
        <Keyboard className="w-4 h-4" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-24 group-hover:ml-2 text-[10px] font-mono font-bold transition-all duration-500 whitespace-nowrap">
          {lang === 'ar' ? 'اختصارات' : 'SHORTCUTS'}
        </span>
      </button>

      {/* Help Overlay Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="w-full max-w-md bg-slate-950 border border-slate-800 p-6 relative shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title Header */}
              <div className={`flex items-center gap-2 mb-6 border-b border-slate-900 pb-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <Keyboard className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-sm sm:text-base font-mono">
                  {lang === 'ar' ? 'نظام الملاحة الذكي بلوحة المفاتيح' : 'SOVEREIGN KEYBOARD NAVIGATION'}
                </h3>
              </div>

              {/* List of shortcuts */}
              <div className="space-y-4 font-sans text-xs">
                {shortcutList.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between gap-4 p-2 hover:bg-slate-900/40 transition-colors ${
                      dir === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'
                    }`}
                  >
                    <span className="text-slate-300 leading-relaxed font-medium">
                      {lang === 'ar' ? item.descAr : item.descEn}
                    </span>
                    <kbd className="px-2.5 py-1 bg-slate-900 border border-slate-700 text-cyan-400 font-mono font-black text-xs min-w-8 text-center shadow">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>

              {/* Footer status line */}
              <div className="mt-6 border-t border-slate-900 pt-3 text-[9px] font-mono text-slate-500 text-center uppercase tracking-wider">
                {lang === 'ar' 
                  ? 'انقر على أي حرف ملاحة في أي وقت للتنقل السريع' 
                  : 'Press any navigation hotkey at any time to traverse'}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
