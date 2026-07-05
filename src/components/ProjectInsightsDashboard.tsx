import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  AreaChart, 
  Area,
  ComposedChart,
  Line
} from 'recharts';
import { useLanguage } from '../LanguageContext';
import { 
  TrendingUp, 
  PieChart as PieIcon, 
  BarChart2, 
  Users, 
  CheckSquare, 
  Sparkles,
  Layers,
  Activity,
  DollarSign
} from 'lucide-react';

interface ProjectInsightsDashboardProps {
  projects: any[];
  inquiries: any[];
}

export default function ProjectInsightsDashboard({ projects = [], inquiries = [] }: ProjectInsightsDashboardProps) {
  const { lang, dir } = useLanguage();

  // 1. DYNAMIC INSIGHTS: Distribution of Project Types
  const projectTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach(p => {
      const cat = lang === 'ar' 
        ? (p.categoryAr || p.categoryEn || 'غير مصنف')
        : (p.categoryEn || p.categoryAr || 'Uncategorized');
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const colors = ['#06b6d4', '#6366f1', '#14b8a6', '#f43f5e', '#e2e8f0', '#fbbf24'];
    return Object.entries(counts).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  }, [projects, lang]);

  // 2. DYNAMIC INSIGHTS: Client Engagement by Service Type
  const serviceEngagementData = useMemo(() => {
    const counts: Record<string, { total: number; audits: number }> = {};
    
    // Initialize standard categories in English and Arabic
    const serviceNamesMap: Record<string, { ar: string; en: string }> = {
      'sovereign-solutions': { ar: 'حلول سيادية', en: 'Sovereign Sol.' },
      'ui-ux-design': { ar: 'تصميم تجربة', en: 'UI/UX Design' },
      'qa-audit': { ar: 'تدقيق جودة', en: 'QA & Audit' },
      'other': { ar: 'أخرى', en: 'Others' }
    };

    Object.keys(serviceNamesMap).forEach(key => {
      counts[key] = { total: 0, audits: 0 };
    });

    // Populate with real Firebase database inquiry records
    inquiries.forEach(inq => {
      const srvKey = inq.service || 'other';
      if (!counts[srvKey]) {
        counts[srvKey] = { total: 0, audits: 0 };
      }
      counts[srvKey].total += 1;
      if (inq.requestedAudit || inq.technicalAudit) {
        counts[srvKey].audits += 1;
      }
    });

    return Object.entries(counts).map(([key, data]) => {
      const names = serviceNamesMap[key] || { ar: key, en: key };
      return {
        service: lang === 'ar' ? names.ar : names.en,
        [lang === 'ar' ? 'إجمالي الطلبات' : 'Total Requests']: data.total,
        [lang === 'ar' ? 'طلبات الفحص التقني' : 'Audit Reports Requested']: data.audits
      };
    });
  }, [inquiries, lang]);

  // 3. DYNAMIC INSIGHTS: Engagement by Budget Levels
  const budgetEngagementData = useMemo(() => {
    const counts: Record<string, number> = {};
    const budgetLabelsMap: Record<string, { ar: string; en: string }> = {
      'under-1000': { ar: 'أقل من $1K', en: 'Under $1K' },
      '1000-2000': { ar: '$1K - $2.5K', en: '$1K - $2.5K' },
      '2500-5000': { ar: '$2.5K - $5K', en: '$2.5K - $5K' },
      'above-5000': { ar: 'أكثر من $5K', en: 'Above $5K' }
    };

    Object.keys(budgetLabelsMap).forEach(key => {
      counts[key] = 0;
    });

    inquiries.forEach(inq => {
      const bKey = inq.budget || '1000-2000';
      if (counts[bKey] !== undefined) {
        counts[bKey] += 1;
      } else {
        counts[bKey] = (counts[bKey] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([key, value]) => {
      const labels = budgetLabelsMap[key] || { ar: key, en: key };
      return {
        budget: lang === 'ar' ? labels.ar : labels.en,
        [lang === 'ar' ? 'العملاء المهتمون' : 'Leads Count']: value,
      };
    });
  }, [inquiries, lang]);

  // 4. Client Conversion Rate (KPIs)
  const totalInquiries = inquiries.length;
  const auditRequests = inquiries.filter(i => i.requestedAudit || i.technicalAudit).length;
  const auditRatePercent = totalInquiries > 0 ? Math.round((auditRequests / totalInquiries) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Header and Sync Badge */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>{lang === 'ar' ? 'تحليلات المشاريع وتفاعل العملاء' : 'Project Insights & Client Engagement Matrix'}</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider block uppercase mt-1">
            {lang === 'ar' ? 'تحليلات حية مستخرجة ومحسوبة مباشرة من قاعدة بيانات فيربايس' : 'Live calculated insights directly from Firestore and Local Registries'}
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
          <span>{lang === 'ar' ? 'تحديث تلقائي مفعّل' : 'REAL-TIME METRICS'}</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-slate-950/40 border border-slate-900 p-4 relative group hover:border-cyan-500/20 transition-all">
          <div className="absolute top-4 right-4 text-cyan-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-[9px] text-slate-500 uppercase block">{lang === 'ar' ? 'إجمالي المشاريع بالمعرض' : 'TOTAL PROJECTS'}</span>
          <span className="text-xl sm:text-2xl font-bold text-white mt-2 block">{projects.length}</span>
          <span className="text-[9px] text-slate-400 block mt-1">
            {lang === 'ar' ? 'معرض مصنف حياً' : 'Live portfolio items'}
          </span>
        </div>

        <div className="bg-slate-950/40 border border-slate-900 p-4 relative group hover:border-indigo-500/20 transition-all">
          <div className="absolute top-4 right-4 text-indigo-500/20">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[9px] text-slate-500 uppercase block">{lang === 'ar' ? 'طلبات العملاء الحية' : 'TOTAL LIVE INQUIRIES'}</span>
          <span className="text-xl sm:text-2xl font-bold text-white mt-2 block">{totalInquiries}</span>
          <span className="text-[9px] text-emerald-400 block mt-1">
            {lang === 'ar' ? 'مسترجع بالكامل' : 'Synced from Cloud'}
          </span>
        </div>

        <div className="bg-slate-950/40 border border-slate-900 p-4 relative group hover:border-teal-500/20 transition-all">
          <div className="absolute top-4 right-4 text-teal-500/20">
            <CheckSquare className="w-4 h-4" />
          </div>
          <span className="text-[9px] text-slate-500 uppercase block">{lang === 'ar' ? 'طلبات تقارير الفحص' : 'TECHNICAL AUDITS'}</span>
          <span className="text-xl sm:text-2xl font-bold text-white mt-2 block">{auditRequests}</span>
          <span className="text-[9px] text-cyan-400 block mt-1">
            {lang === 'ar' ? `${auditRatePercent}% من إجمالي العملاء` : `${auditRatePercent}% of total leads`}
          </span>
        </div>

        <div className="bg-slate-950/40 border border-slate-900 p-4 relative group hover:border-rose-500/20 transition-all">
          <div className="absolute top-4 right-4 text-rose-500/20">
            <DollarSign className="w-4 h-4" />
          </div>
          <span className="text-[9px] text-slate-500 uppercase block">{lang === 'ar' ? 'مؤشر الاهتمام التجاري' : 'COMMERCIAL INTEREST'}</span>
          <span className="text-xl sm:text-2xl font-bold text-white mt-2 block">
            {inquiries.filter(i => i.budget === 'above-5000' || i.budget === '2500-5000').length}
          </span>
          <span className="text-[9px] text-rose-400 block mt-1">
            {lang === 'ar' ? 'ميزانية تفوق $2,500' : 'Budget >= $2.5K'}
          </span>
        </div>
      </div>

      {/* Charts Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Project Types Distribution */}
        <div className="bg-slate-950/30 border border-slate-900 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'توزيع المشاريع حسب التصنيف الفني' : 'Distribution of Project Types'}</span>
            </h3>
            <span className="text-[9px] text-slate-500 font-mono">DYNAMIC PORTFOLIO RANGES</span>
          </div>
          
          {projectTypeData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500 font-mono text-xs">
              {lang === 'ar' ? 'لا توجد بيانات مشاريع متاحة حالياً.' : 'No projects available for categorization.'}
            </div>
          ) : (
            <div className="h-72 flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="w-full md:w-1/2 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {projectTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '0px' }}
                      itemStyle={{ fontSize: '11px', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends container */}
              <div className="w-full md:w-1/2 space-y-2 font-mono">
                {projectTypeData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-1.5 border border-slate-950 hover:bg-slate-900/40 transition-colors">
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-2.5 h-2.5 shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300 truncate">{item.name}</span>
                    </div>
                    <span className="text-cyan-400 font-bold px-2">{item.value} {lang === 'ar' ? 'مشاريع' : 'items'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Lead Budgets Distribution */}
        <div className="bg-slate-950/30 border border-slate-900 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'توزيع ميزانيات مشاريع العملاء' : 'Client Engagement Budgets'}</span>
            </h3>
            <span className="text-[9px] text-slate-500 font-mono">LEAD TARGETS</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetEngagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="budget" stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '0px' }}
                  labelStyle={{ color: '#ffffff', fontFamily: 'monospace', fontSize: '11px' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Bar 
                  name={lang === 'ar' ? 'العملاء المهتمون' : 'Interests / Leads'} 
                  dataKey={lang === 'ar' ? 'العملاء المهتمون' : 'Leads Count'} 
                  fill="#6366f1"
                >
                  {budgetEngagementData.map((entry, index) => {
                    const colors = ['#818cf8', '#6366f1', '#4f46e5', '#3730a3'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Client Engagement and Audits */}
      <div className="bg-slate-950/30 border border-slate-900 p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-900 pb-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'ar' ? 'مؤشرات التفاعل والتقارير التقنية المطلوبة' : 'Client Engagement & Technical Audit Demand'}</span>
          </h3>
          <span className="text-[9px] text-slate-500 font-mono">FIRESTORE METRIC CORRELATIONS</span>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={serviceEngagementData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="service" stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '10px', fontFamily: 'monospace' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '0px' }}
                labelStyle={{ color: '#ffffff', fontFamily: 'monospace', fontSize: '11px' }}
                itemStyle={{ fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '10px' }} />
              <Bar 
                name={lang === 'ar' ? 'إجمالي طلبات الاستشارة' : 'Total Requests'} 
                dataKey={lang === 'ar' ? 'إجمالي الطلبات' : 'Total Requests'} 
                fill="#06b6d4" 
              />
              <Line 
                type="monotone" 
                name={lang === 'ar' ? 'طلب فحص تقني' : 'Audit Reports Requested'} 
                dataKey={lang === 'ar' ? 'طلبات الفحص التقني' : 'Audit Reports Requested'} 
                stroke="#f43f5e" 
                strokeWidth={3} 
                dot={{ r: 4 }} 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
