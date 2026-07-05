import React from 'react';
import { Shield, Sparkles, Server, Terminal, ArrowDown, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../LanguageContext';

interface HeroProps {
  onNavigate: (section: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  const { lang, t, dir } = useLanguage();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const terminalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: 'easeOut', delay: 0.3 },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-32 pb-16 flex items-center justify-center overflow-hidden bg-slate-950 border-b border-slate-800"
    >
      {/* Dynamic background ambient glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* Identity Module Label */}
      <div className={`absolute top-24 ${dir === 'rtl' ? 'left-4 sm:left-8' : 'right-4 sm:right-8'} font-mono text-[10px] text-slate-600 tracking-widest hidden sm:block`}>
        {t.hero_module_label}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {/* Hero Content Information */}
          <motion.div 
            className={`lg:col-span-7 space-y-8 text-center ${dir === 'rtl' ? 'lg:text-right' : 'lg:text-left'}`}
            variants={fadeUpVariants}
          >
            
            {/* Sovereign solutions badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] sm:text-xs font-bold tracking-wider font-mono">
              <Shield className="w-3.5 h-3.5 animate-pulse text-cyan-400 shrink-0" />
              <span>{t.hero_badge}</span>
            </div>

            {/* Display Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6.5xl font-black text-white leading-tight tracking-tight">
              {t.hero_title_1}<br />
              <span className="text-cyan-400 block mt-2 lg:mt-4">
                {t.hero_title_2}
              </span>
            </h1>

            {/* Subtext description */}
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t.hero_desc}
            </p>

            {/* Key stats at a glance */}
            <div className={`grid grid-cols-3 gap-3 sm:gap-4 pt-2 max-w-lg mx-auto ${dir === 'rtl' ? 'lg:mr-0 lg:ml-auto' : 'lg:ml-0 lg:mr-auto'} font-mono`}>
              <div className="bg-slate-900/30 border border-slate-800 p-3 rounded-none text-center backdrop-blur-sm">
                <span className="block text-2xl sm:text-3xl font-extrabold text-white">8+</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 mt-1 block tracking-wider uppercase">{t.hero_stat_exp}</span>
              </div>
              <div className="bg-slate-900/30 border border-slate-800 p-3 rounded-none text-center backdrop-blur-sm">
                <span className="block text-2xl sm:text-3xl font-extrabold text-cyan-400">30+</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 mt-1 block tracking-wider uppercase">{t.hero_stat_proj}</span>
              </div>
              <div className="bg-slate-900/30 border border-slate-800 p-3 rounded-none text-center backdrop-blur-sm">
                <span className="block text-2xl sm:text-3xl font-extrabold text-indigo-400">100%</span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 mt-1 block tracking-wider uppercase">{t.hero_stat_core}</span>
              </div>
            </div>

            {/* Buttons / CTA */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center ${dir === 'rtl' ? 'lg:justify-start' : 'lg:justify-start'} pt-2`}>
              <button
                id="hero-cta-portfolio"
                onClick={() => onNavigate('portfolio')}
                className="bg-white text-slate-950 hover:bg-cyan-400 font-bold text-sm px-8 py-4 rounded-none transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-cyan-500/5"
              >
                <span>{t.hero_cta_explore}</span>
                <Sparkles className="w-4 h-4 text-slate-950" />
              </button>
              
              <button
                id="hero-cta-contact"
                onClick={() => onNavigate('contact')}
                className="border border-slate-700 hover:bg-slate-900 text-white font-bold text-sm px-8 py-4 rounded-none transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.hero_cta_consult}</span>
                <Terminal className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

          </motion.div>

          {/* Hero Right (Visual Terminal / Tech Mockup) */}
          <motion.div 
            className="lg:col-span-5 flex justify-center lg:justify-end"
            variants={terminalVariants}
          >
            <div className="relative w-full max-w-md">
              
              {/* Outer sharp ambient glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-tr from-cyan-500 to-indigo-500 opacity-15 blur-md" />
              
              {/* Terminal Box */}
              <div className="relative bg-slate-950 border border-slate-800 rounded-none shadow-2xl shadow-black/80 overflow-hidden font-mono text-[11px] sm:text-xs text-slate-300">
                
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-900/40 border-b border-slate-800">
                  <div className="flex items-center space-x-1.5 space-x-reverse">
                    <span className="w-2.5 h-2.5 rounded-sm bg-slate-800" />
                    <span className="w-2.5 h-2.5 rounded-sm bg-slate-800" />
                    <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" />
                  </div>
                  <span className="text-slate-500 text-[10px] font-mono select-none">system-kernel.ts</span>
                </div>

                {/* Terminal Content */}
                <div className="p-5 space-y-3.5 leading-relaxed text-left" style={{ direction: 'ltr' }}>
                  <div>
                    <span className="text-cyan-400">const</span> <span className="text-indigo-400">consultant</span> = {'{'}
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-500">{t.hero_terminal_name_label}:</span> <span className="text-amber-200">{t.hero_terminal_name_val}</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-500">{t.hero_terminal_role_label}:</span> <span className="text-amber-200">{t.hero_terminal_role_val}</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-500">{t.hero_terminal_spec_label}:</span> <span className="text-cyan-400">[</span>
                    <div className="pl-4">
                      <span className="text-amber-200">{t.hero_terminal_spec_1}</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-amber-200">{t.hero_terminal_spec_2}</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-amber-200">{t.hero_terminal_spec_3}</span>
                    </div>
                    <span className="text-cyan-400">]</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-500">{t.hero_terminal_safe_label}:</span> <span className="text-cyan-400">true</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-500">{t.hero_terminal_audit_label}:</span> <span className="text-amber-200">{t.hero_terminal_audit_val}</span>
                  </div>
                  <div>{'};'}</div>

                  <div className={`border-t border-slate-800 pt-3 text-cyan-400 text-right font-sans flex items-center justify-end gap-1.5`} style={{ direction: dir }}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t.hero_terminal_footer_ok}</span>
                  </div>
                </div>

                {/* Additional floating credential element */}
                <div className="bg-slate-900/50 border-t border-slate-800 px-5 py-4 flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-slate-500">{t.hero_terminal_status}</span>
                  </div>
                  <span className="text-cyan-400 font-bold">{t.hero_terminal_ratings}</span>
                </div>

              </div>

            </div>
          </motion.div>

        </motion.div>

        {/* Scroll Indicator */}
        <div className="mt-12 text-center animate-bounce">
          <button
            id="scroll-to-portfolio"
            onClick={() => onNavigate('portfolio')}
            className="inline-flex p-2 rounded-none bg-slate-900 border border-slate-800 text-cyan-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            aria-label="Scroll down"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
