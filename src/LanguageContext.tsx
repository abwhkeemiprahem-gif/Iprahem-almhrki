import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Language, TranslationDict, translations } from './translations';
import { useAppStore } from './store/appStore';
import { trackEvent } from './lib/analytics';

interface LanguageContextProps {
  lang: Language;
  toggleLang: () => void;
  setLang: (lang: Language) => void;
  t: TranslationDict;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useAppStore((state) => state.locale);
  const toggleLang = useAppStore((state) => state.toggleLocale);
  const setLang = useAppStore((state) => state.setLocale);

  const [generalOverrides, setGeneralOverrides] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('consultant_general');
    if (stored) {
      setGeneralOverrides(JSON.parse(stored));
    }

    const handleStorageUpdate = () => {
      const updated = localStorage.getItem('consultant_general');
      if (updated) {
        setGeneralOverrides(JSON.parse(updated));
      }
    };

    window.addEventListener('storage_update', handleStorageUpdate);
    return () => window.removeEventListener('storage_update', handleStorageUpdate);
  }, []);

  const baseT = translations[lang];
  const t = React.useMemo(() => {
    if (!generalOverrides) return baseT;
    const over = generalOverrides;
    return {
      ...baseT,
      header_title: lang === 'ar' ? (over.nameAr || baseT.header_title) : (over.nameEn || baseT.header_title),
      header_subtitle: lang === 'ar' ? (over.roleAr || baseT.header_subtitle) : (over.roleEn || baseT.header_subtitle),
      hero_badge: lang === 'ar' 
        ? `[SECURE_CORE] ${over.roleAr || baseT.header_subtitle}` 
        : `[SECURE_CORE] ${over.roleEn || baseT.header_subtitle}`,
      hero_title_1: lang === 'ar' ? (over.title1Ar || baseT.hero_title_1) : (over.title1En || baseT.hero_title_1),
      hero_title_2: lang === 'ar' ? (over.title2Ar || baseT.hero_title_2) : (over.title2En || baseT.hero_title_2),
      hero_desc: lang === 'ar' ? (over.descAr || baseT.hero_desc) : (over.descEn || baseT.hero_desc),
      hero_terminal_name_val: lang === 'ar' ? `"${over.nameAr || "م. إبراهيم المحرقي"}"` : `"${over.nameEn || "Eng. Ibrahim Al-Muharqi"}"`,
      hero_terminal_role_val: lang === 'ar' ? `"${over.roleAr || "مستشار تقني وهندسة نظم سيادية"}"` : `"${over.roleEn || "Sovereign Systems & Technical Consultant"}"`,
    };
  }, [baseT, lang, generalOverrides]);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    trackEvent('lang_switch', undefined, { lang });
  }, [lang]);

  useEffect(() => {
    // Sync with HTML element
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
