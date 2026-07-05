import React, { useState, useEffect } from 'react';
import { getLocalizedServices, TranslatedService } from '../translations';
import { useLanguage } from '../LanguageContext';
import { Shield, Layers, Cpu, CheckCircle2, Sparkles, Clock, Banknote, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

// Mapper function to load Lucide icons dynamically
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Shield':
      return <Shield className="w-6 h-6 text-cyan-400" />;
    case 'Layers':
      return <Layers className="w-6 h-6 text-indigo-400" />;
    case 'Cpu':
      return <Cpu className="w-6 h-6 text-teal-400" />;
    default:
      return <Shield className="w-6 h-6 text-cyan-400" />;
  }
};

export default function Services() {
  const { lang, t, dir } = useLanguage();
  const [servicesData, setServicesData] = useState<TranslatedService[]>([]);

  useEffect(() => {
    const loadServices = () => {
      const stored = localStorage.getItem('consultant_services');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const mapped = parsed.map((s: any) => ({
            id: s.id,
            title: lang === 'ar' ? s.titleAr : s.titleEn,
            iconName: s.iconName,
            description: lang === 'ar' ? s.descriptionAr : s.descriptionEn,
            features: lang === 'ar' 
              ? s.featuresAr.split('\n').map((f: string) => f.trim()).filter(Boolean)
              : s.featuresEn.split('\n').map((f: string) => f.trim()).filter(Boolean),
            deliveryTime: lang === 'ar' ? s.deliveryTimeAr : s.deliveryTimeEn,
            priceEstimate: lang === 'ar' ? s.priceEstimateAr : s.priceEstimateEn,
          }));
          setServicesData(mapped);
        } catch (e) {
          console.error(e);
          setServicesData(getLocalizedServices(lang));
        }
      } else {
        setServicesData(getLocalizedServices(lang));
      }
    };

    loadServices();
    window.addEventListener('storage_update', loadServices);
    return () => window.removeEventListener('storage_update', loadServices);
  }, [lang]);

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <section id="services" className="py-24 bg-slate-950 border-b border-slate-800 relative">
      {/* Background soft lighting */}
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* Module label */}
      <div className={`absolute top-8 ${dir === 'rtl' ? 'left-8' : 'right-8'} font-mono text-[10px] text-slate-600 tracking-widest hidden sm:block`}>
        {t.services_module_label}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Title / Header */}
        <motion.div 
          className={`max-w-3xl mb-16 space-y-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{t.services_badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {t.services_title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-normal">
            {t.services_desc}
          </p>
        </motion.div>

        {/* Services Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {servicesData.map((service, index) => (
            <motion.div
              id={`service-card-${service.id}`}
              key={`${service.id}-${lang}`}
              variants={cardVariant}
              className="bg-slate-900/10 border border-slate-800 rounded-none p-6 sm:p-8 flex flex-col justify-between hover:border-cyan-500 hover:bg-slate-900/30 transition-all duration-300 relative group"
            >
              <div className="space-y-6">
                
                {/* Header Icon + Service Title */}
                <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <div className="w-12 h-12 rounded-none bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300 shrink-0">
                    {getIconComponent(service.iconName)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors duration-200 leading-tight">
                      {service.title}
                    </h3>
                  </div>
                </div>

                {/* Short intro */}
                <p className={`text-slate-400 text-xs sm:text-sm leading-relaxed font-normal ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  {service.description}
                </p>

                {/* Features list */}
                <div className="space-y-3 pt-2">
                  <h4 className={`text-xs font-bold text-slate-400 tracking-wider uppercase font-mono ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {t.services_deliverables_title}
                  </h4>
                  <ul className="space-y-2.5">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className={`flex items-start gap-2.5 text-xs sm:text-sm text-slate-400 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Delivery and Cost Meta Footer */}
              <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 gap-4 text-xs font-mono">
                <div className={`space-y-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <span className="text-slate-500 block uppercase tracking-wider text-[9px]">{t.services_timeline_label}</span>
                  <div className={`flex items-center gap-1.5 text-slate-350 ${dir === 'rtl' ? 'justify-start' : 'justify-start'}`}>
                    <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{service.deliveryTime}</span>
                  </div>
                </div>
                <div className={`space-y-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <span className="text-slate-500 block uppercase tracking-wider text-[9px]">{t.services_budget_label}</span>
                  <div className={`flex items-center gap-1.5 text-slate-350 ${dir === 'rtl' ? 'justify-start' : 'justify-start'}`}>
                    <Banknote className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{service.priceEstimate}</span>
                  </div>
                </div>
              </div>

            </motion.div>
          ))}
        </motion.div>

        {/* Dynamic workflow highlights */}
        <motion.div 
          className="mt-20 bg-slate-900/10 border border-slate-800 rounded-none p-6 sm:p-10 relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className={`lg:col-span-4 space-y-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <h3 className="text-xl sm:text-2xl font-bold text-white">{t.services_workflow_title}</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
                {t.services_workflow_desc}
              </p>
            </div>
            
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className={`space-y-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                <div className="w-8 h-8 rounded-none bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
                  01
                </div>
                <h4 className="text-sm font-bold text-white">{t.services_step_1_title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-normal">
                  {t.services_step_1_desc}
                </p>
              </div>

              <div className={`space-y-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                <div className="w-8 h-8 rounded-none bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
                  02
                </div>
                <h4 className="text-sm font-bold text-white">{t.services_step_2_title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-normal">
                  {t.services_step_2_desc}
                </p>
              </div>

              <div className={`space-y-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                <div className="w-8 h-8 rounded-none bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
                  03
                </div>
                <h4 className="text-sm font-bold text-white">{t.services_step_3_title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-normal">
                  {t.services_step_3_desc}
                </p>
              </div>

            </div>
          </div>
        </motion.div>

        {/* Accordion FAQ Section */}
        <FAQSection />

      </div>
    </section>
  );
}

function FAQSection() {
  const { lang, dir } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems = [
    {
      qAr: 'ما المقصود بالاستشارات البرمجية والحلول التقنية السيادية؟',
      qEn: 'What is meant by sovereign technical consulting & solutions?',
      aAr: 'الحلول السيادية تعني تقديم أنظمة برمجية تمنح العميل تحكماً كاملاً ومستقلاً بنسبة 100% في قواعد البيانات والأكواد المصدرية والاستضافة، متجنبة الاعتماد غير الآمن على أطراف خارجية أو قيود ترخيص برمجية تحد من تمدد ونمو أعمالك.',
      aEn: 'Sovereign solutions represent custom system architectures that give you absolute 100% control, ownership, and independent hosting of your software codebases and database servers. It avoids dangerous third-party platform lock-ins and vendor-specific licensing limitations.'
    },
    {
      qAr: 'كيف يتم احتساب تقديرات تكلفة استشارات المشاريع؟',
      qEn: 'How are the consulting and project delivery budgets estimated?',
      aAr: 'تُقاس التكلفة بنطاق ومخرجات العمل المطلوبة بدقة. يتم الاتفاق المسبق على مراحل تسليم واضحة (Milestones)، وتوفير تقارير ميزانية كاملة وشفافة قبل كتابة أي سطر برامجي للعميل لتفادي المفاجآت.',
      aEn: 'Budgets are carefully mapped out based on the exact deliverables and project scope. We provide detailed, transparent milestone estimates beforehand. Clients receive complete billing breakdowns before any engineering or coding work is initiated.'
    },
    {
      qAr: 'هل يمكنني الحصول على تقرير فحص ومراجعة فنية رسمي لمشروعي؟',
      qEn: 'Can I request an official technical quality audit report?',
      aAr: 'نعم بالتأكيد! عند تقديم طلب استشارة من خلال نموذج الاتصال، يمكنك تفعيل خيار "طلب تقرير فحص فني". سنقوم بإصدار تقرير شامل ومكثف يغطي كفاءة الأكواد، سرعة الاستجابة، ونقاط الحماية ومقترحات التحسين.',
      aEn: 'Absolutely! When submitting your inquiry via the contact form below, you can check the "Technical Audit Report" box. Ibrahim will perform a deep architectural review and provide a rigorous report on code health, response latency, and security hardening.'
    },
    {
      qAr: 'كيف تضمن سلامة قواعد البيانات وعزل الخوادم؟',
      qEn: 'How is data integrity, isolation, and system security maintained?',
      aAr: 'نقوم بتطبيق معايير أمان دولية مثل ISO-27001، واعتماد حاويات معزولة بالكامل على خوادم سحابية آمنة (مثل Google Cloud Run)، مع تهيئة قواعد بيانات Firestore/Firestore Rules لمنع أي نفاذ غير مصرح به نهائياً.',
      aEn: 'We adhere strictly to robust ISO-27001 standard blueprints, package applications in fully sandboxed container layers (e.g. Google Cloud Run), and write rigorous security policies for Firestore databases to block unauthorized external access.'
    }
  ];

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className={`mt-24 space-y-8 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'الأسئلة الشائعة والاستشارات' : 'TECHNICAL FAQ //'}</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          {lang === 'ar' ? 'الأسئلة الشائعة حول الاستشارات الفنية' : 'Frequently Asked Technical Inquiries'}
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
          {lang === 'ar'
            ? 'إجابات مباشرة وشفافة لمساعدتك في فهم نموذج العمل والضمانات السيادية المقدمة.'
            : 'Get straight answers on how we structure software handovers, audit systems, and guarantee sovereign control.'}
        </p>
      </div>

      <div className="border border-slate-900 divide-y divide-slate-900 font-mono">
        {faqItems.map((item, idx) => {
          const isOpen = openIndex === idx;
          const question = lang === 'ar' ? item.qAr : item.qEn;
          const answer = lang === 'ar' ? item.aAr : item.aEn;

          return (
            <div key={idx} className="bg-slate-950/20 hover:bg-slate-950/40 transition-colors">
              <button
                onClick={() => toggleFAQ(idx)}
                className={`w-full px-5 py-4 flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-white hover:text-cyan-400 transition-colors focus:outline-none cursor-pointer ${
                  dir === 'rtl' ? 'flex-row-reverse text-right' : 'flex-row text-left'
                }`}
              >
                <span className="leading-relaxed">{question}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>

              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? 'max-h-52 border-t border-slate-900/60' : 'max-h-0'
                }`}
              >
                <p className="p-5 text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
                  {answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
