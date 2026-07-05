import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { useLanguage } from '../LanguageContext';
import { Cpu, Zap, Database, ArrowDown, ArrowUp, BarChart2, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PerformanceMetrics() {
  const { lang, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<'latency' | 'memory' | 'throughput'>('latency');

  // 1. Latency Data (Before vs After)
  const latencyData = [
    {
      system: lang === 'ar' ? 'بوابة الـ API' : 'API Gateway',
      [lang === 'ar' ? 'قبل الاستشارة (ملي ثانية)' : 'Before Consulting (ms)']: 280,
      [lang === 'ar' ? 'بعد الاستشارة (ملي ثانية)' : 'After Optimization (ms)']: 35,
    },
    {
      system: lang === 'ar' ? 'استعلامات قاعدة البيانات' : 'DB Queries',
      [lang === 'ar' ? 'قبل الاستشارة (ملي ثانية)' : 'Before Consulting (ms)']: 450,
      [lang === 'ar' ? 'بعد الاستشارة (ملي ثانية)' : 'After Optimization (ms)']: 42,
    },
    {
      system: lang === 'ar' ? 'بوابة الدفع' : 'Payment Engine',
      [lang === 'ar' ? 'قبل الاستشارة (ملي ثانية)' : 'Before Consulting (ms)']: 780,
      [lang === 'ar' ? 'بعد الاستشارة (ملي ثانية)' : 'After Optimization (ms)']: 90,
    },
    {
      system: lang === 'ar' ? 'محرك المصادقة' : 'Auth Core Node',
      [lang === 'ar' ? 'قبل الاستشارة (ملي ثانية)' : 'Before Consulting (ms)']: 190,
      [lang === 'ar' ? 'بعد الاستشارة (ملي ثانية)' : 'After Optimization (ms)']: 15,
    },
  ];

  // 2. Memory Usage Data (Before vs After)
  const memoryData = [
    {
      node: lang === 'ar' ? 'خادم الخلفية الرئيسي' : 'Core Backend',
      [lang === 'ar' ? 'استهلاك الذاكرة السابق (ميغابايت)' : 'Previous Memory (MB)']: 1024,
      [lang === 'ar' ? 'الاستهلاك الحالي المحسن (ميغابايت)' : 'Optimized Memory (MB)']: 180,
    },
    {
      node: lang === 'ar' ? 'محرك التقارير الدورية' : 'Audit Scheduler',
      [lang === 'ar' ? 'استهلاك الذاكرة السابق (ميغابايت)' : 'Previous Memory (MB)']: 512,
      [lang === 'ar' ? 'الاستهلاك الحالي المحسن (ميغابايت)' : 'Optimized Memory (MB)']: 64,
    },
    {
      node: lang === 'ar' ? 'قنوات الويب سوكيت' : 'Real-time Hub',
      [lang === 'ar' ? 'استهلاك الذاكرة السابق (ميغابايت)' : 'Previous Memory (MB)']: 768,
      [lang === 'ar' ? 'الاستهلاك الحالي المحسن (ميغابايت)' : 'Optimized Memory (MB)']: 110,
    },
  ];

  // 3. Throughput Data (Requests per second)
  const throughputData = [
    {
      milestone: lang === 'ar' ? 'التهيئة الأساسية' : 'Baseline',
      [lang === 'ar' ? 'الطلبات في الثانية (Req/s)' : 'Throughput (Req/s)']: 1500,
    },
    {
      milestone: lang === 'ar' ? 'تعديل الفهارس' : 'DB Indexing',
      [lang === 'ar' ? 'الطلبات في الثانية (Req/s)' : 'Throughput (Req/s)']: 3200,
    },
    {
      milestone: lang === 'ar' ? 'التخزين المؤقت' : 'Edge Caching',
      [lang === 'ar' ? 'الطلبات في الثانية (Req/s)' : 'Throughput (Req/s)']: 8900,
    },
    {
      milestone: lang === 'ar' ? 'الأتمتة وتوزيع الأحمال' : 'Load Balancing',
      [lang === 'ar' ? 'الطلبات في الثانية (Req/s)' : 'Throughput (Req/s)']: 18400,
    },
  ];

  return (
    <section id="metrics" className="py-24 bg-slate-950 border-b border-slate-800 relative">
      {/* Decorative ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className={`max-w-3xl mb-16 space-y-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'قياسات كفاءة وسرعة النظم' : 'SOVEREIGN PERFORMANCE TELEMETRY'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            {lang === 'ar' ? 'إثبات تحسين الأداء بلغة الأرقام والبيانات' : 'Data-Driven Infrastructure Optimization'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {lang === 'ar' 
              ? 'مقارنة حقيقية توضح تحسن أداء الأنظمة البرمجية، سرعة الاستجابة، وتخفيض استهلاك الذاكرة بعد تطبيق المعايير الاستشارية للمهندس إبراهيم.'
              : 'Real-world benchmarks showing massive response speedups, server resource consolidation, and scalable database optimization post-consultation.'}
          </p>
        </div>

        {/* Tab Controls and KPI Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Controls Sidebar */}
          <div className="space-y-4 flex flex-col justify-start">
            <button
              onClick={() => setActiveTab('latency')}
              className={`w-full p-4 rounded-none border text-left font-mono transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'latency'
                  ? 'bg-slate-900 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4" />
                <div className="text-xs sm:text-sm">
                  <span className="block font-bold">{lang === 'ar' ? 'زمن الاستجابة' : 'Response Latency'}</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">{lang === 'ar' ? 'أسرع بـ 10 أضعاف' : '10x Faster Response'}</span>
                </div>
              </div>
              <ArrowDown className={`w-4 h-4 ${activeTab === 'latency' ? 'text-cyan-400' : 'text-slate-600'}`} />
            </button>

            <button
              onClick={() => setActiveTab('memory')}
              className={`w-full p-4 rounded-none border text-left font-mono transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'memory'
                  ? 'bg-slate-900 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4" />
                <div className="text-xs sm:text-sm">
                  <span className="block font-bold">{lang === 'ar' ? 'استهلاك الذاكرة RAM' : 'Memory Footprint'}</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">{lang === 'ar' ? 'تخفيض بنسبة 85%' : '85% RAM Reduction'}</span>
                </div>
              </div>
              <ArrowDown className={`w-4 h-4 ${activeTab === 'memory' ? 'text-cyan-400' : 'text-slate-600'}`} />
            </button>

            <button
              onClick={() => setActiveTab('throughput')}
              className={`w-full p-4 rounded-none border text-left font-mono transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'throughput'
                  ? 'bg-slate-900 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : 'bg-slate-950/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4" />
                <div className="text-xs sm:text-sm">
                  <span className="block font-bold">{lang === 'ar' ? 'معدل المعالجة (QPS)' : 'Throughput Scaling'}</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">{lang === 'ar' ? 'تضاعف لـ 12 مرة' : '12x Concurrency Boost'}</span>
                </div>
              </div>
              <ArrowUp className={`w-4 h-4 ${activeTab === 'throughput' ? 'text-cyan-400' : 'text-slate-600'}`} />
            </button>

            <div className="p-4 border border-slate-900 bg-slate-950/20 space-y-3 font-mono">
              <span className="text-[10px] text-slate-500 block uppercase tracking-wider">{lang === 'ar' ? 'نتيجة التدقيق النهائي' : 'FINAL AUDIT IMPACT'}</span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300">
                  {lang === 'ar' ? 'خوادم مستقرة 100%' : '100% Autonomous Infrastructure'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs text-slate-300">
                  {lang === 'ar' ? 'توفير 70% من تكاليف الاستضافة' : '70% Server Cost Savings'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Chart Visualizer Panel */}
          <div className="lg:col-span-3 bg-slate-950/40 border border-slate-900 p-6 flex flex-col justify-between min-h-[420px] relative">
            
            {/* Top Stats Label bar */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  {activeTab === 'latency' && (lang === 'ar' ? 'تحسين زمن الاستجابة (الأقل هو الأفضل)' : 'Latency Optimization Benchmarks (Lower is Better)')}
                  {activeTab === 'memory' && (lang === 'ar' ? 'تقليل استهلاك الذاكرة (الأقل هو الأفضل)' : 'RAM Allocation Consolidation (Lower is Better)')}
                  {activeTab === 'throughput' && (lang === 'ar' ? 'مقياس زيادة طلبات العرض (الأعلى هو الأفضل)' : 'Throughput Scaling & Concurrency (Higher is Better)')}
                </span>
                <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                  {lang === 'ar' ? 'قياسات موثقة من بيئة تشغيل حقيقية' : 'Benchmarked using standard load-testing frameworks'}
                </span>
              </div>
            </div>

            {/* Recharts Render Stage */}
            <div className="flex-1 h-72">
              {activeTab === 'latency' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={latencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="system" stroke="#64748b" style={{ fontSize: '11px', fontFamily: 'monospace' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '11px', fontFamily: 'monospace' }} unit="ms" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '0px' }}
                      labelStyle={{ color: '#ffffff', fontFamily: 'monospace', fontSize: '12px' }}
                      itemStyle={{ fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} />
                    <Bar name={lang === 'ar' ? 'قبل تدخل المستشار' : 'Before Optimization'} dataKey={lang === 'ar' ? 'قبل الاستشارة (ملي ثانية)' : 'Before Consulting (ms)'} fill="#64748b" />
                    <Bar name={lang === 'ar' ? 'بعد التدخل والتحسين' : 'Optimized Engine'} dataKey={lang === 'ar' ? 'بعد الاستشارة (ملي ثانية)' : 'After Optimization (ms)'} fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {activeTab === 'memory' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={memoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="node" stroke="#64748b" style={{ fontSize: '11px', fontFamily: 'monospace' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '11px', fontFamily: 'monospace' }} unit="MB" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '0px' }}
                      labelStyle={{ color: '#ffffff', fontFamily: 'monospace', fontSize: '12px' }}
                      itemStyle={{ fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} />
                    <Bar name={lang === 'ar' ? 'قبل إعادة الهيكلة' : 'Original RAM Use'} dataKey={lang === 'ar' ? 'استهلاك الذاكرة السابق (ميغابايت)' : 'Previous Memory (MB)'} fill="#ef4444" opacity={0.7} />
                    <Bar name={lang === 'ar' ? 'بعد التحويل والضغط' : 'Sovereign RAM Core'} dataKey={lang === 'ar' ? 'الاستهلاك الحالي المحسن (ميغابايت)' : 'Optimized Memory (MB)'} fill="#14b8a6" />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {activeTab === 'throughput' && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={throughputData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="milestone" stroke="#64748b" style={{ fontSize: '11px', fontFamily: 'monospace' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '11px', fontFamily: 'monospace' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '0px' }}
                      labelStyle={{ color: '#ffffff', fontFamily: 'monospace', fontSize: '12px' }}
                      itemStyle={{ fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} />
                    <Area 
                      type="monotone" 
                      name={lang === 'ar' ? 'معدل نقل ومعالجة البيانات' : 'Queries Processed / Sec'} 
                      dataKey={lang === 'ar' ? 'الطلبات في الثانية (Req/s)' : 'Throughput (Req/s)'} 
                      stroke="#6366f1" 
                      fillOpacity={1} 
                      fill="url(#colorThroughput)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Explanatory summary bottom card */}
            <div className="mt-6 pt-4 border-t border-slate-900 bg-slate-950/20 text-xs text-slate-400 font-mono flex items-start gap-2.5">
              <span className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-none text-[9px] shrink-0 font-bold uppercase">
                {lang === 'ar' ? 'استنتاج تقني' : 'TECH SUMMARY'}
              </span>
              <p>
                {activeTab === 'latency' && (
                  lang === 'ar'
                    ? 'بعد إزالة قفل الموردين الخارجيين وإعادة كتابة الأكواد وتفعيل التخزين المؤقت، انخفض زمن استجابة العمليات الأساسية من 425 مللي ثانية في المتوسط إلى 45 مللي ثانية فقط.'
                    : 'Replacing bloated architectures with bespoke, slimline sovereign frameworks dropped transaction overhead from a 425ms baseline average to a lightning-fast 45ms.'
                )}
                {activeTab === 'memory' && (
                  lang === 'ar'
                    ? 'تخفيض استهلاك الذاكرة العشوائية بمقدار 8.5 مرات بفضل تبسيط معمارية الاستدعاء، والتخلص من التبعات غير المستخدمة، وحزم البيانات الزائدة.'
                    : 'Achieved an 8.5x consolidation of server memory footprints by replacing generic visual frame layers with highly cached structures.'
                )}
                {activeTab === 'throughput' && (
                  lang === 'ar'
                    ? 'زيادة قدرة تحمل خادم الاستعلامات المتوازنة بمعدل 12 مرة ليصل إلى 18,400 استعلام بالثانية دون انقطاع بفضل ضبط معالجة النظم السيادية.'
                    : 'System load concurrency scaled exponentially to 18,400 queries per second without service degradation under severe load-testing simulators.'
                )}
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
