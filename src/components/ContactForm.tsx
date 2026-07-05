import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '../LanguageContext';
import { Send, Sparkles, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { contactFormZodSchema, ContactFormInput } from '../api/contracts';
import { submitContact } from '../api/mockService';
import { trackEvent } from '../lib/analytics';
import { useAppStore } from '../store/appStore';

export default function ContactForm() {
  const { lang, t, dir } = useLanguage();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useAppStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormZodSchema),
    defaultValues: {
      service: 'sovereign-solutions',
      budget: '1000-2000',
      name: '',
      email: '',
      message: '',
      technicalAudit: false
    }
  });

  const onSubmitForm = async (data: ContactFormInput) => {
    setIsSubmitting(true);
    
    try {
      const response = await submitContact(data);
      if (response.success) {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setShowToast(true);
        
        // Dispatch global toast
        addToast(
          lang === 'ar' 
            ? '✓ تم إرسال طلب الاستشارة والبيانات بنجاح! سيتصل بك المهندس إبراهيم قريباً.' 
            : '✓ Consultation inquiry sent successfully! Eng. Ibrahim will contact you shortly.', 
          'success'
        );
        
        // Track the submission event
        trackEvent('contact_form', 'contact', {
          service: data.service,
          budget: data.budget,
          hasRequestedAudit: data.technicalAudit || false
        });

        reset();

        // Auto close toast after 5 seconds
        setTimeout(() => setShowToast(false), 5000);

        // Auto close success banner after 6 seconds
        setTimeout(() => setSubmitSuccess(false), 6000);
      } else {
        setIsSubmitting(false);
        console.error('Contact submission failed:', response.error);
      }
    } catch (err) {
      setIsSubmitting(false);
      console.error('An unexpected error occurred during submission:', err);
    }
  };

  const servicesOptions = [
    { value: 'sovereign-solutions', label: lang === 'ar' ? 'هندسة الحلول السيادية والأتمتة' : 'Sovereign Solutions & Automation' },
    { value: 'ui-ux-design', label: lang === 'ar' ? 'تصميم واجهات تجربة المستخدم (UI/UX)' : 'UI/UX Interface Design' },
    { value: 'qa-audit', label: lang === 'ar' ? 'تدقيق الجودة والأمن الرقمي' : 'Quality Assurance & Digital Audit' },
    { value: 'other', label: lang === 'ar' ? 'أخرى / مناقشة عامة' : 'Other / General Discussion' },
  ];

  const budgetOptions = [
    { value: 'under-1000', label: lang === 'ar' ? 'أقل من $1,000' : 'Under $1,000' },
    { value: '1000-2000', label: lang === 'ar' ? 'من $1,000 إلى $2,500' : 'From $1,000 to $2,500' },
    { value: '2500-5000', label: lang === 'ar' ? 'من $2,500 إلى $5,000' : 'From $2,500 to $5,000' },
    { value: 'above-5000', label: lang === 'ar' ? 'أكثر من $5,000' : 'Above $5,000' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className={`space-y-5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
      
      <h3 className={`text-lg font-bold text-white flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
        <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
        <span>{t.contact_form_title}</span>
      </h3>

      <AnimatePresence>
        {submitSuccess && (
          <motion.div
            id="submit-success-alert-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 p-4 rounded-none text-xs sm:text-sm flex items-start gap-3"
          >
            <ThumbsUp className="w-5 h-5 shrink-0 mt-0.5 text-cyan-400" />
            <div>
              <span className="font-bold block">{t.contact_form_success_title}</span>
              <span>{t.contact_form_success_desc}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 block" htmlFor="input-name">{t.contact_form_label_name}</label>
          <input
            id="input-name"
            data-testid="input-name"
            type="text"
            placeholder={t.contact_form_placeholder_name}
            {...register('name')}
            className={`w-full bg-slate-950 border text-white text-sm px-4 py-3 rounded-none focus:outline-none focus:border-cyan-400 transition-colors ${
              errors.name ? 'border-red-500/50' : 'border-slate-800'
            }`}
          />
          {errors.name && <span className="text-[10px] text-red-400 block">{errors.name.message}</span>}
        </div>

        {/* Email field */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 block" htmlFor="input-email">{t.contact_form_label_email}</label>
          <input
            id="input-email"
            data-testid="input-email"
            type="text"
            placeholder="name@company.com"
            {...register('email')}
            className={`w-full bg-slate-950 border text-white text-sm px-4 py-3 rounded-none focus:outline-none focus:border-cyan-400 transition-colors ${
              errors.email ? 'border-red-500/50' : 'border-slate-800'
            }`}
            style={{ direction: 'ltr', textAlign: dir === 'rtl' ? 'right' : 'left' }}
          />
          {errors.email && <span className="text-[10px] text-red-400 block">{errors.email.message}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Service selection dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 block" htmlFor="select-service">{t.contact_form_label_service}</label>
          <select
            id="select-service"
            data-testid="select-service"
            {...register('service')}
            className="w-full bg-slate-950 border border-slate-800 text-white text-sm px-4 py-3 rounded-none focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
          >
            {servicesOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Budget selection dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 block" htmlFor="select-budget">{t.contact_form_label_budget}</label>
          <select
            id="select-budget"
            data-testid="select-budget"
            {...register('budget')}
            className="w-full bg-slate-950 border border-slate-800 text-white text-sm px-4 py-3 rounded-none focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
          >
            {budgetOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Message field */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-400 block" htmlFor="textarea-message">{t.contact_form_label_message}</label>
        <textarea
          id="textarea-message"
          data-testid="textarea-message"
          rows={4}
          placeholder={t.contact_form_placeholder_message}
          {...register('message')}
          className={`w-full bg-slate-950 border text-white text-sm px-4 py-3 rounded-none focus:outline-none focus:border-cyan-400 transition-colors resize-none ${
            errors.message ? 'border-red-500/50' : 'border-slate-800'
          }`}
        />
        {errors.message && <span className="text-[10px] text-red-400 block">{errors.message.message}</span>}
      </div>

      {/* Technical Audit Request option */}
      <div className="flex items-start gap-3 bg-slate-900/40 border border-slate-800 p-4 transition-all hover:border-cyan-500/30">
        <input
          id="checkbox-technical-audit"
          data-testid="checkbox-technical-audit"
          type="checkbox"
          {...register('technicalAudit')}
          className="w-4 h-4 mt-1 rounded-none border-slate-800 bg-slate-950 text-cyan-400 focus:ring-0 cursor-pointer accent-cyan-400"
        />
        <div className="flex-1">
          <label htmlFor="checkbox-technical-audit" className="text-xs text-slate-300 font-bold block cursor-pointer select-none">
            {lang === 'ar' 
              ? 'طلب تقرير فحص تقني شامل لمشروعي (مجاني وآمن)' 
              : 'Request a comprehensive Technical Audit Report for my project (Free & Secure)'}
          </label>
          <span className="text-[10px] text-slate-400 block mt-0.5 leading-relaxed">
            {lang === 'ar'
              ? 'سيقوم النظام بتحليل بنية مشروعك وتأمين طلب استشارة خاصة وتخزينه في قاعدة بيانات فيربايس لمراجعتها والرد عليها تقنياً.'
              : 'The system will register your request in our secure Firebase database. I will conduct a comprehensive code review and send you the report.'}
          </span>
        </div>
      </div>

      {/* Submit button */}
      <button
        id="submit-contact-form-btn-r"
        data-testid="submit-contact-btn"
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-white hover:bg-cyan-400 text-slate-950 font-bold text-sm py-4 px-4 rounded-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="font-mono">{t.contact_form_btn_submitting}</span>
        ) : (
          <>
            <span>{t.contact_form_btn_submit}</span>
            <Send className="w-4 h-4 shrink-0" />
          </>
        )}
      </button>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            id="toast-notification"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`fixed bottom-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} z-100 bg-slate-950 border border-cyan-500/50 shadow-2xl shadow-cyan-500/10 p-4 max-w-sm flex items-start gap-3.5`}
          >
            {/* Countdown progress bar */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" 
            />
            
            <div className="w-8 h-8 rounded-none bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
              <ThumbsUp className="w-4 h-4" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {lang === 'ar' ? 'تم استلام طلبك بنجاح' : 'Request Received Successfully'}
                </h4>
                <button
                  id="close-toast-btn"
                  type="button"
                  onClick={() => setShowToast(false)}
                  className="text-slate-500 hover:text-white transition-colors cursor-pointer text-xs font-mono p-0.5"
                >
                  ✕
                </button>
              </div>
              <p className={`text-[11px] sm:text-xs text-slate-400 leading-relaxed ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                {lang === 'ar' 
                  ? 'تم تسجيل استشارتك في النظام المشفّر للمراجعة، وسأتواصل معك عبر البريد الإلكتروني قريباً.' 
                  : 'Your consultation request has been securely logged. I will contact you via email shortly.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </form>
  );
}
