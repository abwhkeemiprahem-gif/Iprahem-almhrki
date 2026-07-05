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
  PieChart,
  Pie
} from 'recharts';
import { useLanguage } from '../LanguageContext';
import { 
  Eye, 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  TrendingUp, 
  ArrowUpRight, 
  Sparkles,
  Layers,
  Smartphone,
  Cpu,
  RefreshCw
} from 'lucide-react';

interface StatsDashboardProps {
  inquiriesCount?: number;
}

export default function StatsDashboard({ inquiriesCount = 0 }: StatsDashboardProps) {
  const { lang, t, dir } = useLanguage();
  const [refreshKey, setRefreshKey] = useState(0);

  // Simulated live visitor data over 7 days
  const visitorData = [
    { day: lang === 'ar' ? 'السبت' : 'Sat', visitors: 120, pageViews: 340, inquiries: 4 },
    { day: lang === 'ar' ? 'الأحد' : 'Sun', visitors: 145, pageViews: 410, inquiries: 6 },
    { day: lang === 'ar' ? 'الإثنين' : 'Mon', visitors: 190, pageViews: 590, inquiries: 12 },
    { day: lang === 'ar' ? 'الثلاثاء' : 'Tue', visitors: 220, pageViews: 680, inquiries: 15 },
    { day: lang === 'ar' ? 'الأربعاء' : 'Wed', visitors: 260, pageViews: 790, inquiries: 18 },
    { day: lang === 'ar' ? 'الخميس' : 'Thu', visitors: 210, pageViews: 620, inquiries: 14 },
    { day: lang === 'ar' ? 'الجمعة' : 'Fri', visitors: 160, pageViews: 480, inquiries: 8 },
  ];

  // Project engagement data (how many clicks/interactions per project)
  const projectEngagement = [
    { name: lang === 'ar' ? 'سياج السيادي' : 'Siyaj Sovereign', clicks: 450, conversions: 24, fill: '#06b6d4' },
    { name: lang === 'ar' ? 'رحلة الحروف' : 'Letters Journey', clicks: 320, conversions: 18, fill: '#6366f1' },
    { name: lang === 'ar' ? 'درع الـ SaaS' : 'SaaS Shield', clicks: 280, conversions: 15, fill: '#14b8a6' },
    { name: lang === 'ar' ? 'دليل الجودة' : 'QA Audit Hub', clicks: 190, conversions: 10, fill: '#f43f5e' },
  ];

  // Inquiries by category (for donut chart)
  const inquiryCategories = [
    { name: lang === 'ar' ? 'حلول سيادية' : 'Sovereign Sol.', value: 45, color: '#06b6d4' },
    { name: lang === 'ar' ? 'تصميم تجربة' : 'UI/UX Design', value: 25, color: '#6366f1' },
    { name: lang === 'ar' ? 'تدقيق الجودة' : 'QA Audit', value: 20, color: '#14b8a6' },
    { name: lang === 'ar' ? 'أخرى' : 'Others', value: 10, color: '#64748b' },
  ];

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6" key={refreshKey}>
      {/* Dashboard Top Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span>{lang === 'ar' ? 'مركز مراقبة الأداء وتحليلات الأنظمة' : 'Performance Analytics & Telemetry Kernel'}</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider block uppercase mt-1">
            STATUS: ACTIVE // UTC_SYNC_ONLINE // DATABASE_NOMINAL
          </p>
        </div>
        
        <button 
          onClick={triggerRefresh}
          className="self-start sm:self-auto flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-cyan-400 py-2 px-3 hover:text-white transition-all font-mono"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'مزامنة حية' : 'LIVE SYNC'}</span>
        </button>
      </div>

      {/* Summary Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {/* Card 1: Unique Visitors */}
        <div className="bg-slate-950/40 border border-slate-900 p-4 relative group hover:border-cyan-500/20 transition-all">
          <div className="absolute top-4 right-4 text-cyan-500/20 group-hover:text-cyan-400/30 transition-colors">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-[9px] text-slate-500 uppercase block">{lang === 'ar' ? 'الزوار الفريدون' : 'UNIQUE VISITORS'}</span>
          <span className="text-xl sm:text-2xl font-bold text-white mt-2 block">1,305</span>
          <span className="text-[9px] text-emerald-400 flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +18.4% {lang === 'ar' ? 'هذا الأسبوع' : 'this week'}
          </span>
        </div>

        {/* Card 2: Total Page Views */}
        <div className="bg-slate-950/40 border border-slate-900 p-4 relative group hover:border-indigo-500/20 transition-all">
          <div className="absolute top-4 right-4 text-indigo-500/20 group-hover:text-indigo-400/30 transition-colors">
            <Eye className="w-5 h-5" />
          </div>
          <span className="text-[9px] text-slate-500 uppercase block">{lang === 'ar' ? 'إجمالي المشاهدات' : 'TOTAL PAGEVIEWS'}</span>
          <span className="text-xl sm:text-2xl font-bold text-white mt-2 block">4,430</span>
          <span className="text-[9px] text-emerald-400 flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" /> +22.1% {lang === 'ar' ? 'منذ أمس' : 'since yesterday'}
          </span>
        </div>

        {/* Card 3: Consultation Inquiries */}
        <div className="bg-slate-950/40 border border-slate-900 p-4 relative group hover:border-teal-500/20 transition-all">
          <div className="absolute top-4 right-4 text-teal-500/20 group-hover:text-teal-400/30 transition-colors">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-[9px] text-slate-500 uppercase block">{lang === 'ar' ? 'طلبات الاستشارة' : 'CONSULTATION REQS'}</span>
          <span className="text-xl sm:text-2xl font-bold text-white mt-2 block">{inquiriesCount > 0 ? inquiriesCount : 12}</span>
          <span className="text-[9px] text-cyan-400 flex items-center gap-1 mt-1">
            <Sparkles className="w-3 h-3" /> {inquiriesCount > 0 ? (lang === 'ar' ? 'مسترجع حي من فيربايس' : 'live from Firestore') : (lang === 'ar' ? 'قيمة أولية نموذجية' : 'simulated baseline')}
          </span>
        </div>

        {/* Card 4: Audit Reports requested */}
        <div className="bg-slate-950/40 border border-slate-900 p-4 relative group hover:border-rose-500/20 transition-all">
          <div className="absolute top-4 right-4 text-rose-500/20 group-hover:text-rose-400/30 transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-[9px] text-slate-500 uppercase block">{lang === 'ar' ? 'فحوصات الجودة والأمان' : 'AUDITS REQUESTED'}</span>
          <span className="text-xl sm:text-2xl font-bold text-white mt-2 block">{inquiriesCount > 0 ? Math.max(1, Math.round(inquiriesCount * 0.4)) : 4}</span>
          <span className="text-[9px] text-cyan-400 flex items-center gap-1 mt-1">
            <Cpu className="w-3 h-3" /> {inquiriesCount > 0 ? (lang === 'ar' ? 'مرفوع إلى فيربايس' : 'logged in firebase') : (lang === 'ar' ? 'قيمة أولية نموذجية' : 'simulated baseline')}
          </span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Visitor Flow (Area Chart) */}
        <div className="lg:col-span-2 bg-slate-950/30 border border-slate-900 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {lang === 'ar' ? 'تدفق الزوار والمشاهدات اليومي' : 'DAILY TRAFFIC & ENGAGEMENT'}
            </h3>
            <span className="text-[9px] text-slate-500 font-mono">7-DAY RESOLUTION</span>
          </div>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '0px' }}
                  labelStyle={{ color: '#ffffff', fontFamily: 'monospace', fontSize: '11px' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} />
                <Area 
                  type="monotone" 
                  name={lang === 'ar' ? 'مشاهدات الصفحات' : 'Page Views'} 
                  dataKey="pageViews" 
                  stroke="#06b6d4" 
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
                <Area 
                  type="monotone" 
                  name={lang === 'ar' ? 'الزوار الفريدون' : 'Unique Visitors'} 
                  dataKey="visitors" 
                  stroke="#6366f1" 
                  fillOpacity={1} 
                  fill="url(#colorVisitors)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Inquiries Distribution (Pie Chart) */}
        <div className="bg-slate-950/30 border border-slate-900 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {lang === 'ar' ? 'طلب الخدمات والمواضيع' : 'SERVICE DEMAND SHARE'}
            </h3>
            <span className="text-[9px] text-slate-500 font-mono">INQUIRY RATIOS</span>
          </div>
          <div className="h-64 sm:h-72 flex flex-col justify-center items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={inquiryCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {inquiryCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '0px' }}
                  itemStyle={{ fontSize: '11px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-3 w-full text-left font-mono mt-2">
              {inquiryCategories.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-2 h-2 shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-[10px] text-slate-400 truncate">{cat.name} ({cat.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Project Engagement (Bar Chart) */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-slate-950/30 border border-slate-900 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {lang === 'ar' ? 'مستويات التفاعل مع المشاريع في المعرض' : 'PORTFOLIO PROJECTS INTEREST METRICS'}
            </h3>
            <span className="text-[9px] text-slate-500 font-mono">INTERACTION CLICK COUNT</span>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectEngagement} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '0px' }}
                  labelStyle={{ color: '#ffffff', fontFamily: 'monospace', fontSize: '11px' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} />
                <Bar name={lang === 'ar' ? 'زيارات وتفاصيل المشروع' : 'Details view clicks'} dataKey="clicks">
                  {projectEngagement.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
                <Bar name={lang === 'ar' ? 'طلب الاستشارة المرتبط' : 'Direct consulting request'} dataKey="conversions" fill="#ffffff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
