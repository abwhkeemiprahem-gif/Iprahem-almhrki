import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Code, Sparkles, Globe, Lock, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import { useAppStore } from '../store/appStore';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Header({ activeSection, setActiveSection }: HeaderProps) {
  const { lang, toggleLang, t, dir } = useLanguage();
  const { isFocusMode, toggleFocusMode } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('site_theme');
      return saved === 'light' ? 'light' : 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem('site_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: t.nav_hero },
    { id: 'portfolio', label: t.nav_portfolio },
    { id: 'services', label: t.nav_services },
    { id: 'testimonials', label: t.nav_testimonials },
    { id: 'payments', label: t.nav_payments },
    { id: 'contact', label: t.nav_contact },
  ];

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      id="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800 py-3 shadow-lg shadow-black/40'
          : 'bg-transparent border-b border-slate-900/30 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('hero')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Geometric Balance Rotate-45 Logo */}
            <div className="w-8 h-8 bg-cyan-500 rounded-sm rotate-45 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:rotate-135 transition-transform duration-500 shrink-0">
              <div className="w-4 h-4 bg-slate-950 rounded-sm" />
            </div>
            <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
              <span className="text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-400 tracking-tight block">
                {t.header_title}
              </span>
              <span className="block text-[9px] sm:text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
                {t.header_subtitle}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  id={`nav-btn-${item.id}`}
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2.5 py-1.5 rounded-sm text-xs sm:text-sm font-medium transition-all duration-300 relative ${
                    isActive
                      ? 'text-cyan-400 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-[-14px] left-0 right-0 h-0.5 bg-cyan-400"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Status Indicator / Call to Action / Language Toggle */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Focus Mode Toggle Desktop */}
            <button
              id="focus-mode-toggle-desktop"
              onClick={toggleFocusMode}
              className={`border transition-all flex items-center justify-center cursor-pointer rounded-none p-2.5 ${
                isFocusMode
                  ? 'border-cyan-400 bg-cyan-500/10 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)] animate-pulse'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-cyan-400 hover:text-cyan-400'
              }`}
              title={lang === 'ar' ? 'نمط التركيز (إخفاء المشتتات)' : 'Focus Mode (Hide Distractions)'}
            >
              {isFocusMode ? (
                <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Theme Toggle Desktop */}
            <button
              id="theme-toggle-desktop"
              onClick={toggleTheme}
              className="border border-slate-800 bg-slate-900/60 hover:border-cyan-400 text-slate-300 hover:text-white p-2.5 transition-all flex items-center justify-center cursor-pointer rounded-none"
              title={lang === 'ar' ? 'تبديل المظهر' : 'Toggle Theme'}
            >
              {theme === 'light' ? (
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
              )}
            </button>

            {/* Language Selector Desktop */}
            <button
              id="lang-toggle-desktop"
              onClick={toggleLang}
              className="border border-slate-800 bg-slate-900/60 hover:border-cyan-400 text-slate-300 hover:text-white px-2.5 py-1.5 font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer rounded-none animate-fade-in"
              title={lang === 'ar' ? 'Switch to English' : 'تغيير اللغة للعربية'}
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
              <span>{lang === 'ar' ? 'EN' : 'العربية'}</span>
            </button>

            {/* Admin Portal Button */}
            <button
              id="admin-portal-trigger-desktop"
              onClick={() => window.dispatchEvent(new Event('open_admin_dashboard'))}
              className="border border-slate-800 bg-slate-900/60 hover:border-cyan-400 hover:text-cyan-400 text-slate-400 p-2 transition-all flex items-center justify-center cursor-pointer rounded-none"
              title={lang === 'ar' ? 'لوحة التحكم الإدارية' : 'Admin Dashboard Portal'}
            >
              <Lock className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">
                {lang === 'ar' ? 'متاح للعمل' : 'STATUS: AVAILABLE'}
              </span>
            </div>
            
            <button
              id="cta-header-contact"
              onClick={() => handleNavClick('contact')}
              className="bg-white text-slate-950 hover:bg-cyan-400 hover:text-slate-950 font-bold text-xs px-4 py-2 rounded-sm transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <span>{t.header_cta}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle & Lang & Status */}
          <div className="md:hidden flex items-center gap-2">
            
            {/* Focus Mode Toggle Mobile */}
            <button
              id="focus-mode-toggle-mobile"
              onClick={toggleFocusMode}
              className={`border text-slate-300 p-2 flex items-center justify-center cursor-pointer rounded-none ${
                isFocusMode
                  ? 'border-cyan-400 bg-cyan-500/15 text-cyan-400'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
              title={lang === 'ar' ? 'نمط التركيز' : 'Focus Mode'}
            >
              {isFocusMode ? (
                <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Theme Toggle Mobile */}
            <button
              id="theme-toggle-mobile"
              onClick={toggleTheme}
              className="border border-slate-800 bg-slate-900/60 text-slate-300 p-2 flex items-center justify-center cursor-pointer rounded-none"
              title={lang === 'ar' ? 'تبديل المظهر' : 'Toggle Theme'}
            >
              {theme === 'light' ? (
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-yellow-400" />
              )}
            </button>

            {/* Language Selector Mobile Toggle */}
            <button
              id="lang-toggle-mobile"
              onClick={toggleLang}
              className="border border-slate-800 bg-slate-900/60 text-slate-300 px-2 py-1.5 font-mono text-[10px] font-bold flex items-center gap-1 cursor-pointer rounded-none"
            >
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Admin trigger mobile */}
            <button
              id="admin-portal-trigger-mobile"
              onClick={() => window.dispatchEvent(new Event('open_admin_dashboard'))}
              className="border border-slate-800 bg-slate-900/60 text-slate-400 p-2 flex items-center justify-center cursor-pointer rounded-none"
              title={lang === 'ar' ? 'لوحة التحكم الإدارية' : 'Admin Portal'}
            >
              <Lock className="w-3 h-3" />
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-sm bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-[#020617] border-b border-slate-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    id={`mobile-nav-btn-${item.id}`}
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full ${dir === 'rtl' ? 'text-right border-r-2 pl-4' : 'text-left border-l-2 pr-4'} px-4 py-3 rounded-none text-sm font-medium transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-slate-900 text-cyan-400 border-cyan-400'
                        : 'text-slate-300 hover:bg-slate-900/50 hover:text-white border-transparent'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <div className="w-1.5 h-1.5 bg-cyan-400" />}
                  </button>
                );
              })}
              <div className="pt-4 border-t border-slate-800">
                <button
                  id="mobile-cta-contact"
                  onClick={() => handleNavClick('contact')}
                  className="w-full bg-white text-slate-950 font-bold text-sm py-3 rounded-none text-center shadow-lg flex items-center justify-center gap-2"
                >
                  <span>{t.header_cta}</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Glassmorphic Language Switcher (Bottom Left) */}
      <motion.button
        id="floating-lang-switcher"
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleLang}
        className={`fixed bottom-6 ${dir === 'rtl' ? 'right-6 sm:right-auto sm:left-24' : 'left-6 sm:left-auto sm:right-24'} md:left-6 md:right-auto z-40 bg-slate-950/95 backdrop-blur-md border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 hover:text-white px-3.5 py-3 shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all flex items-center gap-2 font-mono text-xs font-bold cursor-pointer rounded-none`}
        title={lang === 'ar' ? 'Switch to English' : 'تغيير اللغة للعربية'}
      >
        <Globe className="w-4 h-4 animate-spin-slow text-cyan-400" />
        <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
      </motion.button>
    </header>
  );
}
