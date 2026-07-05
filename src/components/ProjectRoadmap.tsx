import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { 
  Milestone, 
  Map, 
  Clock, 
  CheckCircle, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Rocket, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';

interface RoadmapStep {
  id: number;
  titleAr: string;
  titleEn: string;
  durationAr: string;
  durationEn: string;
  icon: React.ReactNode;
  descAr: string;
  descEn: string;
  deliverablesAr: string[];
  deliverablesEn: string[];
  status: 'completed' | 'current' | 'upcoming';
}

export default function ProjectRoadmap() {
  const { lang, dir } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps: RoadmapStep[] = [
    {
      id: 1,
      titleAr: 'المخطط الهيكلي والاكتشاف',
      titleEn: 'Discovery & Architectural Blueprint',
      durationAr: 'المنظور: 5-7 أيام',
      durationEn: 'Timeline: 5-7 Days',
      icon: <Layers className="w-5 h-5 text-cyan-400" />,
      descAr: 'المرحلة التحضيرية لبناء النظام. نقوم بتحليل شامل لمتطلبات الأمان السيادية، وتحديد هيكلية البيانات، وتخطيط هندسة الخوادم وقاعدة البيانات.',
      descEn: 'The initial strategic phase. We conduct a comprehensive analysis of sovereign security requirements, map out the data structures, and draft the server & database architecture.',
      deliverablesAr: [
        'مخطط هيكلي معتمد ومفصل لقاعدة البيانات والأمان',
        'مستند النطاق التقني ومواصفات النظام المتكامل',
        'تخطيط الميزانية والموارد التقديرية بالكامل'
      ],
      deliverablesEn: [
        'Approved system architecture & security blueprint',
        'Complete technical scope document and API mappings',
        'Full resource estimation & transparent milestone budgeting'
      ],
      status: 'completed'
    },
    {
      id: 2,
      titleAr: 'التطوير الهندسي الأساسي والمنطق الآمن',
      titleEn: 'Core Engineering & Secure Logic',
      durationAr: 'المنظور: 14-21 يوم',
      durationEn: 'Timeline: 14-21 Days',
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
      descAr: 'بناء الواجهات والمنطق البرمجي السحابي والـ Backend. نقوم بكتابة أكواد معزولة بلغة TypeScript آمنة كلياً، وتأمين تدفق البيانات وحلقات الحماية.',
      descEn: 'Building user interfaces and backend cloud logic. Writing sandboxed clean-room TypeScript code, securing API pipelines, and establishing database persistence layers.',
      deliverablesAr: [
        'تطوير الواجهات المتجاوبة بالكامل والـ Widgets التفاعلية',
        'ربط خوادم Express.js وقاعدة البيانات السحابية الحية',
        'تنصيب بروتوكولات الأمان والحلقات المضادة للاختراق'
      ],
      deliverablesEn: [
        'Fully responsive visual interfaces and dashboard views',
        'Express.js backend server API & Firestore DB synchronization',
        'Establish secure token-based authorization and session state'
      ],
      status: 'current'
    },
    {
      id: 3,
      titleAr: 'التحصين السيادي واختبارات الجودة',
      titleEn: 'Sovereign Hardening & Auditing',
      durationAr: 'المنظور: 4-6 أيام',
      durationEn: 'Timeline: 4-6 Days',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      descAr: 'إخضاع الكود لفحوصات جودة صارمة والتدقيق الفني للأخطاء لضمان الأمان السيادي لجميع المدخلات والمخرجات وملفات التهيئة.',
      descEn: 'Exposing the entire codebase to rigorous quality testing, vulnerability scans, and code-review checks to guarantee supreme security and fault-free execution.',
      deliverablesAr: [
        'إجراء اختبارات الاختراق وفحص الثغرات الأمنية',
        'إصدار تقرير فحص جودة الأنظمة وقابلية التوسع',
        'تأهيل النظام لمتطلبات شهادات التقييم الدولية'
      ],
      deliverablesEn: [
        'Vulnerability assessment and penetration testing checks',
        'Comprehensive software quality, load & scalability report',
        'Optimization to ISO-27001 readiness standard requirements'
      ],
      status: 'upcoming'
    },
    {
      id: 4,
      titleAr: 'النشر السحابي والتشغيل والتدريب',
      titleEn: 'CI/CD Deployment & Warm Handover',
      durationAr: 'المنظور: 3 أيام',
      durationEn: 'Timeline: 3 Days',
      icon: <Rocket className="w-5 h-5 text-rose-400" />,
      descAr: 'النشر السحابي النهائي للنظام وتفعيله حياً للجمهور، مع نقل ملكية الأكواد بالكامل وتقديم التدريب التقني للتشغيل والصيانة الذاتية.',
      descEn: 'Launching the application to high-performance containers, executing the production rollout, and conducting direct hands-on team handover of all digital assets.',
      deliverablesAr: [
        'نشر النظام على حاويات Cloud Run آمنة وسريعة',
        'تسليم ملفات الشيفرة المصدرية (Source Code) والتوثيقات كاملة',
        'فترة دعم وصيانة تقنية مكثفة بعد الإطلاق للتأكيد'
      ],
      deliverablesEn: [
        'Deploy fully redundant containers on secure Cloud Run infrastructure',
        'Handover of clean Git repositories and comprehensive API docs',
        'Post-launch hyper-care support and technical maintenance guide'
      ],
      status: 'upcoming'
    }
  ];

  const currentStepData = steps.find(s => s.id === activeStep) || steps[0];

  return (
    <section id="roadmap" className="py-20 bg-slate-950 border-t border-slate-900 relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Module Header */}
        <div className={`text-center space-y-4 mb-16 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-widest uppercase ${dir === 'rtl' ? 'justify-start md:justify-center' : 'justify-start md:justify-center'}`}>
            <Milestone className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '03B / PROJECT_ROADMAP' : '03B / MILESTONE_ROADMAP'}</span>
            <span>|</span>
            <span className="text-slate-500">{lang === 'ar' ? '[نهج التسليم المتكامل]' : '[DELIVERY_PARADIGM]'}</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {lang === 'ar' ? 'منهجية ومراحل تسليم المشاريع الرقمية' : 'Milestone-Based Project Delivery Roadmap'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl md:mx-auto leading-relaxed">
            {lang === 'ar' 
              ? 'خطوات عملية واضحة ومدروسة تضمن انتقال فكرة مشروعك من التخطيط الهيكلي إلى الإطلاق والإنتاج بأعلى معايير الأمان والجودة السيادية.'
              : 'Our structured step-by-step engineering pipeline designed to guide your software from visual design concepts directly to robust production deployment.'}
          </p>
        </div>

        {/* Step-Based Horizontal / Vertical Indicator Block */}
        <div className="relative mb-12">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-7 left-10 right-10 h-0.5 bg-slate-900 z-0">
            <div 
              className="h-full bg-cyan-500/50 transition-all duration-500" 
              style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps Circle Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 relative z-10">
            {steps.map((step) => {
              const isSelected = step.id === activeStep;
              const isCompleted = step.id < activeStep;
              
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className="flex flex-col items-center text-center p-4 md:p-2 group focus:outline-none cursor-pointer transition-all"
                >
                  {/* Circle Indicator */}
                  <div 
                    className={`w-14 h-14 rounded-none flex items-center justify-center transition-all duration-300 border-2 font-mono text-sm mb-3 relative ${
                      isSelected 
                        ? 'bg-slate-950 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] scale-110' 
                        : isCompleted 
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' 
                        : 'bg-slate-950 border-slate-900 text-slate-500 group-hover:border-slate-700 group-hover:text-slate-300'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <span>0{step.id}</span>
                    )}

                    {/* Step Status Ripple for active */}
                    {isSelected && (
                      <span className="absolute -inset-1.5 border border-cyan-500/20 animate-pulse pointer-events-none" />
                    )}
                  </div>

                  {/* Title */}
                  <span className={`text-xs font-bold transition-all ${
                    isSelected ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                  }`}>
                    {lang === 'ar' ? step.titleAr : step.titleEn}
                  </span>

                  {/* Duration Badge */}
                  <span className={`text-[9px] font-mono mt-1 px-1.5 py-0.5 bg-slate-950 border ${
                    isSelected 
                      ? 'border-cyan-500/20 text-cyan-400' 
                      : 'border-slate-900 text-slate-600'
                  }`}>
                    {lang === 'ar' ? step.durationAr : step.durationEn}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Milestone Card view */}
        <div className="bg-slate-950 border border-slate-900 p-6 sm:p-8 relative group hover:border-cyan-500/20 transition-all duration-300">
          {/* Subtle Top Indicator Edge */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500/20 via-cyan-400 to-indigo-500/20" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Info Column (Left 5) */}
            <div className={`lg:col-span-5 space-y-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-900 border border-slate-800 text-cyan-400">
                  {currentStepData.icon}
                </div>
                <div>
                  <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest block">
                    {lang === 'ar' ? `المرحلة 0${currentStepData.id}` : `PHASE 0${currentStepData.id}`}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {lang === 'ar' ? currentStepData.titleAr : currentStepData.titleEn}
                  </h3>
                </div>
              </div>

              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed pt-2">
                {lang === 'ar' ? currentStepData.descAr : currentStepData.descEn}
              </p>

              {/* Navigation buttons */}
              <div className={`flex gap-2.5 pt-4 ${dir === 'rtl' ? 'justify-start' : 'justify-start'}`}>
                <button
                  disabled={activeStep === 1}
                  onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                  className="p-2 border border-slate-900 hover:border-cyan-500/40 text-slate-500 hover:text-cyan-400 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                </button>

                <button
                  disabled={activeStep === steps.length}
                  onClick={() => setActiveStep(prev => Math.min(steps.length, prev + 1))}
                  className="p-2 border border-slate-900 hover:border-cyan-500/40 text-slate-500 hover:text-cyan-400 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Deliverables Column (Right 7) */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-900/60 p-5 space-y-4">
              <div className={`flex items-center gap-2 border-b border-slate-900 pb-2 ${dir === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Map className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  {lang === 'ar' ? 'المخرجات والتقارير المسلّمة //' : 'REQUIRED DELIVERABLES //'}
                </span>
              </div>

              <div className="space-y-3 font-mono">
                {((lang === 'ar' ? currentStepData.deliverablesAr : currentStepData.deliverablesEn) || []).map((del, i) => (
                  <div 
                    key={i} 
                    className={`flex items-start gap-2.5 p-3 bg-slate-950 border border-slate-900/40 hover:bg-slate-900/10 transition-colors text-xs text-slate-300 ${
                      dir === 'rtl' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-none shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{del}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900/40 p-3 border border-slate-800 text-[10px] text-slate-500 flex items-center justify-between gap-2">
                <span className="font-mono flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-cyan-500" />
                  {lang === 'ar' ? currentStepData.durationAr : currentStepData.durationEn}
                </span>
                <span className="text-[9px] text-cyan-400/80 uppercase font-mono">
                  {lang === 'ar' ? 'أمان وجودة سيادية' : 'Sovereign standards'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
