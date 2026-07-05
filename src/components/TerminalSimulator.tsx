import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import { Terminal, Play, RotateCcw, HelpCircle, Briefcase, Cpu, Phone, Sparkles, Activity, User } from 'lucide-react';
import { motion } from 'motion/react';

interface HistoryLine {
  text: string;
  type: 'input' | 'output' | 'error';
}

export default function TerminalSimulator() {
  const { lang, dir } = useLanguage();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryLine[]>([
    { text: lang === 'ar' ? 'جاري الاتصال بالنظام السيادي...' : 'Establishing connection to sovereign network...', type: 'output' },
    { text: lang === 'ar' ? 'تم الاتصال بنجاح. اكتب "help" لعرض الأوامر المتاحة.' : 'Connection secured. Type "help" to see available commands.', type: 'output' },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when history changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const runCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    // Add input line to history
    const newHistory = [...history, { text: `ibrahim@sovereign:~$ ${cmd}`, type: 'input' as const }];

    let response: HistoryLine[] = [];

    switch (trimmed) {
      case 'help':
        response = [
          { text: lang === 'ar' ? 'الأوامر المتاحة:' : 'Available Commands:', type: 'output' },
          { text: '  about      ' + (lang === 'ar' ? '- نبذة تعريفية عن المستشار إبراهيم' : '- Overview of Consultant Ibrahim'), type: 'output' },
          { text: '  skills     ' + (lang === 'ar' ? '- عرض المهارات البرمجية والخبرات التقنية' : '- Display programming skills & tech stack'), type: 'output' },
          { text: '  experience ' + (lang === 'ar' ? '- السيرة المهنية وأبرز الإنجازات' : '- Professional milestone summary'), type: 'output' },
          { text: '  status     ' + (lang === 'ar' ? '- فحص كفاءة أنظمة المستشار وحالة الخوادم' : '- Audit consultant system health & latency'), type: 'output' },
          { text: '  whoami     ' + (lang === 'ar' ? '- تفاصيل جلسة الزائر وصلاحياتها الأمنية' : '- Display visitor profile & authorization token'), type: 'output' },
          { text: '  contact    ' + (lang === 'ar' ? '- طرق الاتصال السريعة' : '- Direct contact channels'), type: 'output' },
          { text: '  clear      ' + (lang === 'ar' ? '- مسح الشاشة' : '- Clear the console history'), type: 'output' },
        ];
        break;

      case 'status':
        response = [
          { text: lang === 'ar' ? '--- تقرير حالة النظام والشبكة السيادية ---' : '--- SOVEREIGN SYSTEM STATUS REPORT ---', type: 'output' },
          { text: '  [DB Node]    Sovereign Database: SECURED (No external lock / 100% Owner Owned)', type: 'output' },
          { text: '  [Engine]     Operational Latency: 12ms (Lean cache edge-routing)', type: 'output' },
          { text: '  [Memory]     Allocated Memory: 42.1MB / 512MB (Optimized memory allocation)', type: 'output' },
          { text: '  [Uptime]     Continuous Uptime: 99.998% (SLA Guaranteed)', type: 'output' },
          { text: '  [Consult]    Ibrahim Availability: ACTIVE (Accepting high-end consulting contracts)', type: 'output' },
        ];
        break;

      case 'whoami':
        response = [
          { text: lang === 'ar' ? '--- تفاصيل جلسة الاتصال الآمن للمستخدم ---' : '--- CLIENT SESSION IDENTITY VERIFICATION ---', type: 'output' },
          { text: '  Guest IP:     Dynamic Encrypted Hub Node', type: 'output' },
          { text: '  Role Assigned: Prospective Institutional Partner / Valued Guest Client', type: 'output' },
          { text: '  Access Token:  SOV-CLIENT-' + Math.floor(Math.random() * 90000 + 10000), type: 'output' },
          { text: '  Permissions:   READ_SECURE_METRICS, DISPATCH_INQUIRY, BOOK_CONSULTATION', type: 'output' },
          { text: '  Trust Index:   100% (Sovereign End-to-End Cryptography Connection)', type: 'output' },
        ];
        break;

      case 'about':
        response = [
          { text: lang === 'ar' ? '--- نبذة عن المستشار ---' : '--- ABOUT ENG. IBRAHIM ---', type: 'output' },
          { text: lang === 'ar' 
            ? 'المهندس إبراهيم المحرقي: مستشار أول في هندسة نظم البرمجيات وحلول الأتمتة والأنظمة السيادية المستقلة. يتمتع بأكثر من 8 سنوات من الخبرة العملية في بناء منصات SaaS وتأمين قواعد البيانات وتطوير تطبيقات المؤسسات الكبرى.'
            : 'Lead Software Architect & Sovereign Systems Consultant with over 8 years of experience designing and implementing resilient, enterprise-grade automated structures, securing critical core engines, and scaling SaaS platforms.',
            type: 'output' },
        ];
        break;

      case 'skills':
        response = [
          { text: lang === 'ar' ? '--- مصفوفة المهارات واللغات البرمجية ---' : '--- TECHNICAL SKILLS MATRIX ---', type: 'output' },
          { text: '  TypeScript / React / Next.js     [██████████] 100%', type: 'output' },
          { text: '  Node.js / Express Backend        [█████████░] 90%', type: 'output' },
          { text: '  Sovereign Core Systems & PWA     [█████████░] 90%', type: 'output' },
          { text: '  PostgreSQL / Cloud SQL / NoSQL   [████████░░] 80%', type: 'output' },
          { text: '  Cybersecurity / Auth Hardening  [█████████░] 90%', type: 'output' },
          { text: '  Docker / Cloud Architecture      [████████░░] 80%', type: 'output' },
        ];
        break;

      case 'experience':
        response = [
          { text: lang === 'ar' ? '--- السيرة المهنية والإنجازات ---' : '--- PROFESSIONAL EXPERIENCE ---', type: 'output' },
          { text: '  • ' + (lang === 'ar' ? 'أكثر من 8 سنوات من العمل الاستشاري في الشرق الأوسط وأوروبا.' : '8+ years of dedicated consulting across MENA and EU regions.'), type: 'output' },
          { text: '  • ' + (lang === 'ar' ? 'تطوير وهيكلة نظام "سياج السيادي" لتأمين وإدارة الكيانات الحساسة.' : 'Led architecture of "Siyaj Sovereign System" securing sensitive government-adjacent nodes.'), type: 'output' },
          { text: '  • ' + (lang === 'ar' ? 'أتمتة أكثر من 300 عملية تشغيلية معقدة لعملاء SaaS التجاريين.' : 'Automated 300+ critical operations for commercial high-traffic SaaS partners.'), type: 'output' },
          { text: '  • ' + (lang === 'ar' ? 'تأسيس بنية تحتية مقاومة للاختراقات مع تدقيق جودة الكود البرمجي.' : 'Built bulletproof infrastructure architectures and performed deep code-quality audits.'), type: 'output' },
        ];
        break;

      case 'contact':
        response = [
          { text: lang === 'ar' ? '--- قنوات الاتصال ---' : '--- CONTACT CHANNEL ---', type: 'output' },
          { text: '  Email: abwkreemiprahem@gmail.com', type: 'output' },
          { text: '  Phone: +20 102 345 6789', type: 'output' },
          { text: '  Location: Cairo, Egypt (Available Globally for Remote Consultation)', type: 'output' },
        ];
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        response = [
          { text: lang === 'ar' ? `خطأ: الأمر "${cmd}" غير معروف. اكتب "help" لمعرفة الخيارات المتاحة.` : `Command not recognized: "${cmd}". Type "help" for a list of commands.`, type: 'error' },
        ];
    }

    setHistory([...newHistory, ...response]);
    setCommandHistory([cmd, ...commandHistory]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const quickCommands = [
    { id: 'help', label: lang === 'ar' ? 'المساعدة' : 'Help', icon: HelpCircle },
    { id: 'status', label: lang === 'ar' ? 'حالة النظام' : 'Sys Status', icon: Activity },
    { id: 'whoami', label: lang === 'ar' ? 'هويتي' : 'Whoami', icon: User },
    { id: 'skills', label: lang === 'ar' ? 'المهارات' : 'Skills', icon: Cpu },
    { id: 'experience', label: lang === 'ar' ? 'الخبرات' : 'Experience', icon: Briefcase },
    { id: 'about', label: lang === 'ar' ? 'النبذة' : 'About', icon: Sparkles },
    { id: 'contact', label: lang === 'ar' ? 'الاتصال' : 'Contact', icon: Phone },
  ];

  return (
    <section id="terminal" className="py-24 bg-slate-950 border-b border-slate-800 relative">
      {/* Glow decorative */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Module Header */}
        <div className={`max-w-3xl mb-12 space-y-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider">
            <Terminal className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'محاكي سطر الأوامر التفاعلي' : 'INTERACTIVE TERMINAL SYSTEM'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            {lang === 'ar' ? 'سطر الأوامر التفاعلي لتقييم المهارات' : 'Sovereign Skill Verification Terminal'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {lang === 'ar'
              ? 'استخدم المحاكي التفاعلي أدناه لاستكشاف المهارات البرمجية والخبرات الاستشارية للمهندس إبراهيم المحرقي بطريقة مباشرة وسريعة.'
              : 'Interact with our developer-first terminal emulator below to audit Eng. Ibrahim’s technical stack, sovereign expertise, and consulting history.'}
          </p>
        </div>

        {/* Terminal Container */}
        <div className="bg-slate-950 border border-slate-800 rounded-none overflow-hidden shadow-2xl flex flex-col h-[450px]">
          {/* Custom OS Bar */}
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            </div>
            <div className="text-slate-400 font-bold select-none text-[10px] tracking-wide flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'ar' ? 'جلسة_مؤمنة_للعميل@سيادي.محلي' : 'secured_client_session@sovereign.local'}</span>
            </div>
            <div className="text-slate-500 text-[10px] hidden sm:block">80x24</div>
          </div>

          {/* Quick-Action Command Buttons */}
          <div className="bg-slate-900/50 border-b border-slate-850 px-4 py-2 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">{lang === 'ar' ? 'اختصارات سريعة:' : 'Quick Run:'}</span>
            {quickCommands.map((qc) => {
              const Icon = qc.icon;
              return (
                <button
                  id={`quick-cmd-btn-${qc.id}`}
                  key={qc.id}
                  onClick={() => runCommand(qc.id)}
                  className="px-2.5 py-1 text-slate-400 hover:text-cyan-400 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-[11px] font-mono transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Icon className="w-3 h-3" />
                  <span>{qc.label}</span>
                </button>
              );
            })}
            <button
              id="clear-cmd-btn"
              onClick={() => {
                setHistory([]);
                setInput('');
              }}
              className="px-2.5 py-1 text-slate-500 hover:text-red-400 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-red-500/50 text-[11px] font-mono transition-all ml-auto flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{lang === 'ar' ? 'مسح' : 'Clear'}</span>
            </button>
          </div>

          {/* Console Area */}
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto font-mono text-xs sm:text-sm space-y-2 text-left bg-slate-950 scrollbar-thin select-text">
            {history.map((line, idx) => (
              <div
                key={idx}
                className={
                  line.type === 'input'
                    ? 'text-cyan-400'
                    : line.type === 'error'
                    ? 'text-red-400 font-bold'
                    : 'text-slate-300 font-light'
                }
                style={{ direction: 'ltr', whiteSpace: 'pre-wrap' }}
              >
                {line.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input Prompt Bar */}
          <div className="bg-slate-900/60 p-3 sm:p-4 border-t border-slate-800 flex items-center gap-2 font-mono">
            <span className="text-cyan-400 text-xs sm:text-sm select-none shrink-0" style={{ direction: 'ltr' }}>
              ibrahim@sovereign:~$
            </span>
            <input
              id="terminal-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={lang === 'ar' ? 'اكتب أمرًا هنا مثل help, skills...' : 'Type a command here like help, skills...'}
              className="flex-1 bg-transparent border-none text-white focus:outline-none focus:ring-0 text-xs sm:text-sm font-mono placeholder-slate-600 caret-cyan-400 min-w-0"
              autoComplete="off"
              autoCapitalize="off"
            />
            <button
              id="execute-command-btn"
              onClick={() => runCommand(input)}
              className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500/30 hover:border-cyan-500 text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Play className="w-3 h-3" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'تشغيل' : 'Run'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
