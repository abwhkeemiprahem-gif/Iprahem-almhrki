import React, { useState } from 'react';
import { Shield, ExternalLink, Globe, Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { CONTACT_INFO } from '../data';
import { useLanguage } from '../LanguageContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Footer() {
  const { lang, t, dir } = useLanguage();
  const currentYear = new Date().getFullYear();

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage(lang === 'ar' ? 'الرجاء إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    let docId = '';
    try {
      const emailClean = email.trim().toLowerCase();
      // Safe ID matching rules: ^[a-zA-Z0-9_-]+$
      docId = emailClean.replace(/[^a-zA-Z0-9_-]/g, '_');
      
      const docRef = doc(db, 'newsletter_subscriptions', docId);
      await setDoc(docRef, {
        id: docId,
        email: emailClean,
        subscribedAt: serverTimestamp()
      });

      setStatus('success');
      setEmail('');
    } catch (err: any) {
      console.error('Newsletter error:', err);
      setStatus('error');
      setErrorMessage(
        lang === 'ar' 
          ? 'حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.' 
          : 'An unexpected error occurred. Please try again.'
      );
      handleFirestoreError(err, OperationType.CREATE, `newsletter_subscriptions/${docId}`);
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-slate-800">
          
          {/* Logo & Bio Column */}
          <div className={`md:col-span-4 space-y-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <div 
              className={`flex items-center space-x-2 cursor-pointer ${dir === 'rtl' ? 'space-x-reverse justify-start' : 'justify-start'}`} 
              onClick={() => handleScrollTo('hero')}
            >
              <div className="w-8 h-8 rounded-none bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center -rotate-3 hover:rotate-0 transition-transform duration-300 shrink-0">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-base font-black text-white">{t.header_title}</span>
            </div>
            <p className="text-slate-450 text-xs sm:text-sm leading-relaxed font-normal">
              {t.footer_desc}
            </p>
          </div>

          {/* Quick links Column */}
          <div className={`md:col-span-2 space-y-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase font-mono">{t.footer_quick_links}</h4>
            <div className="grid grid-cols-1 gap-2.5 text-xs sm:text-sm">
              <button onClick={() => handleScrollTo('hero')} className={`text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t.nav_hero}</button>
              <button onClick={() => handleScrollTo('portfolio')} className={`text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t.nav_portfolio}</button>
              <button onClick={() => handleScrollTo('services')} className={`text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t.nav_services}</button>
              <button onClick={() => handleScrollTo('payments')} className={`text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t.nav_payments}</button>
            </div>
          </div>

          {/* Contact and Networks Column */}
          <div className={`md:col-span-3 space-y-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase font-mono">{t.footer_networks}</h4>
            <div className="flex flex-col gap-3 text-xs sm:text-sm">
              <a
                href={CONTACT_INFO.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-2 font-mono ${dir === 'rtl' ? 'flex-row-reverse justify-end' : 'justify-start'}`}
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>t.me/consultant_tech</span>
              </a>
              <a
                href={CONTACT_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-2 font-mono ${dir === 'rtl' ? 'flex-row-reverse justify-end' : 'justify-start'}`}
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>github.com/tech-sovereign</span>
              </a>
              <a
                href={CONTACT_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-2 font-mono ${dir === 'rtl' ? 'flex-row-reverse justify-end' : 'justify-start'}`}
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>linkedin/in/tech-sovereign</span>
              </a>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className={`md:col-span-3 space-y-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase font-mono">
              {lang === 'ar' ? 'النشرة الهندسية الآمنة' : 'Secure Intelligence Feed'}
            </h4>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              {lang === 'ar' 
                ? 'اشترك لتلقي تحديثات الأمان، تقارير الأنظمة، والمقالات التقنية والسيادية.' 
                : 'Get periodic threat intelligence, sovereign design paradigms, and architectural logs.'}
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'consultant@domain.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading' || status === 'success'}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/50 outline-none text-white text-xs px-3.5 py-2.5 font-mono rounded-none transition-all placeholder:text-slate-700 disabled:opacity-50"
                />
              </div>

              {status === 'idle' && (
                <button
                  type="submit"
                  className="w-full bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 text-[10px] font-mono font-bold tracking-wider uppercase py-2 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'اشترك الآن' : 'SUBSCRIBE'}</span>
                </button>
              )}

              {status === 'loading' && (
                <button
                  type="button"
                  disabled
                  className="w-full bg-slate-900/50 border border-slate-800 text-slate-500 text-[10px] font-mono font-bold tracking-wider uppercase py-2 flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>{lang === 'ar' ? 'جاري التسجيل...' : 'SUBSCRIBING...'}</span>
                </button>
              )}

              {status === 'success' && (
                <div className="p-2 border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 text-[10px] font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{lang === 'ar' ? 'تم الاشتراك بنجاح!' : 'Successfully subscribed!'}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="space-y-1.5">
                  <div className="p-2 border border-red-500/30 bg-red-950/20 text-red-400 text-[10px] font-mono flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="text-[9px] font-mono text-cyan-400 hover:underline cursor-pointer"
                  >
                    {lang === 'ar' ? 'إعادة المحاولة' : 'Retry subscription'}
                  </button>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Lower credit bar */}
        <div className={`pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 ${dir === 'rtl' ? 'sm:flex-row-reverse' : ''}`}>
          <p>© {currentYear} {t.header_title}. {t.footer_rights}</p>
          
          <button 
            id="admin-footer-btn"
            onClick={() => window.dispatchEvent(new Event('open_admin_dashboard'))}
            className="hover:text-cyan-400 transition-colors cursor-pointer font-mono text-[10px] uppercase border border-slate-900 px-2 py-1 hover:border-cyan-500/30 rounded-none bg-transparent"
          >
            {lang === 'ar' ? 'بوابة الإدارة // ADMIN' : 'ADMIN_PORTAL //'}
          </button>

          <div className="flex items-center gap-1 font-mono">
            <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{t.footer_mobile_ok}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
