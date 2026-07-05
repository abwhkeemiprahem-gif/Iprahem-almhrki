import React, { useState, useEffect } from 'react';
import { PAYMENT_METHODS, CONTACT_INFO } from '../data';
import { Mail, Phone, MapPin, Copy, Check, CreditCard, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import ContactForm from './ContactForm';
import ConsultationScheduler from './ConsultationScheduler';

interface SentMessage {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  budget: string;
  date: string;
}

export default function PaymentsAndContact() {
  const { lang, t, dir } = useLanguage();

  // Payments & Contacts Overrides States
  const [paymentsList, setPaymentsList] = useState(PAYMENT_METHODS);
  const [contactInfo, setContactInfo] = useState({
    ...CONTACT_INFO,
    locationAr: 'القاهرة، مصر (متاح للعمل عن بعد عالمياً)',
    locationEn: 'Cairo, Egypt (Available for remote work globally)'
  });

  useEffect(() => {
    const loadPaymentsAndContacts = () => {
      const storedPayments = localStorage.getItem('consultant_payments');
      if (storedPayments) {
        try {
          setPaymentsList(JSON.parse(storedPayments));
        } catch (e) {
          console.error(e);
        }
      }
      const storedContact = localStorage.getItem('consultant_contact');
      if (storedContact) {
        try {
          setContactInfo(JSON.parse(storedContact));
        } catch (e) {
          console.error(e);
        }
      }
      const storedMessages = localStorage.getItem('consultant_sent_messages');
      if (storedMessages) {
        try {
          setSavedMessages(JSON.parse(storedMessages));
        } catch (e) {
          console.error(e);
        }
      }
    };

    loadPaymentsAndContacts();
    window.addEventListener('storage_update', loadPaymentsAndContacts);
    return () => window.removeEventListener('storage_update', loadPaymentsAndContacts);
  }, []);

  // Payment States
  const [activeTab, setActiveTab] = useState('usdt-trc20');
  const [copied, setCopied] = useState<string | null>(null);

  // Form States
  const [savedMessages, setSavedMessages] = useState<SentMessage[]>([]);

  // Load previously saved messages from localStorage on load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('consultant_sent_messages');
      if (stored) {
        setSavedMessages(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved messages', e);
    }
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Find active payment method raw data
  const rawPayment = paymentsList.find(m => m.id === activeTab) || paymentsList[0];

  // Localized values for active payment method
  const getLocalizedPaymentDetails = () => {
    const nameMap: Record<string, string> = {
      'usdt-trc20': lang === 'ar' ? 'العملات الرقمية (USDT)' : 'Cryptocurrency (USDT)',
      'instapay-egypt': lang === 'ar' ? 'تطبيق إنستا باي (InstaPay Egypt)' : 'InstaPay App (Egypt)',
      'local-bank': lang === 'ar' ? 'حوالة بنكية محلية / دولية' : 'Local / International Bank Transfer',
    };

    const instructionMap: Record<string, string> = {
      'usdt-trc20': lang === 'ar' 
        ? 'يرجى إرسال المبلغ على العنوان المذكور بدقة، وتأكيد التحويل بإرسال لقطة الشاشة ورمز المعاملة (TXID) عبر نموذج التواصل.' 
        : 'Please send the exact amount to the specified address. Confirm your transfer by submitting the screenshot and transaction hash (TXID) in the contact form.',
      'instapay-egypt': lang === 'ar' 
        ? 'الدفع الفوري داخل جمهورية مصر العربية عبر عنوان الدفع المباشر لإنستاباي.' 
        : 'Instant transfer within Egypt via the direct InstaPay address.',
      'local-bank': lang === 'ar' 
        ? 'عند تحويل أتعاب الخدمات المصرفية، يرجى كتابة اسم العميل بوضوح وإرسال إشعار التحويل عبر النموذج.' 
        : 'For bank transfers, please write your name clearly in the transfer remarks and submit the receipt via the contact form.',
    };

    const bankNameMap: Record<string, string> = {
      'local-bank': lang === 'ar' ? (import.meta.env.VITE_BANK_NAME || 'بنك الكريمي الإسلامي التمويل الأصغر') : 'Kurimi Islamic Microfinance Bank',
    };

    const holderMap: Record<string, string> = {
      'instapay-egypt': lang === 'ar' ? (import.meta.env.VITE_BANK_ACC_HOLDER || 'إبراهيم علي كداف سعيد') : 'Ibrahim Ali Kaddaf Saeed',
      'local-bank': lang === 'ar' ? (import.meta.env.VITE_BANK_ACC_HOLDER || 'إبراهيم علي كداف سعيد') : 'Ibrahim Ali Kaddaf Saeed',
    };

    return {
      id: rawPayment.id,
      name: nameMap[rawPayment.id] || rawPayment.name,
      type: rawPayment.type,
      iconName: rawPayment.iconName,
      details: {
        ...rawPayment.details,
        bankName: bankNameMap[rawPayment.id] || rawPayment.details.bankName,
        accountHolder: holderMap[rawPayment.id] || rawPayment.details.accountHolder,
        instruction: instructionMap[rawPayment.id] || rawPayment.details.instruction,
      }
    };
  };

  const activePayment = getLocalizedPaymentDetails();

  const getPaymentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wallet':
        return <CreditCard className="w-5 h-5" />;
      case 'Smartphone':
        return <Phone className="w-5 h-5" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
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

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="bg-slate-950">
      
      {/* 1. Payments section */}
      <section id="payments" className="py-24 border-b border-slate-800 relative">
        {/* Module label */}
        <div className={`absolute top-8 ${dir === 'rtl' ? 'left-8' : 'right-8'} font-mono text-[10px] text-slate-600 tracking-widest hidden sm:block`}>
          {t.payments_module_label}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            className={`max-w-3xl mb-16 space-y-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider">
              <CreditCard className="w-3 h-3 text-cyan-400" />
              <span>{t.payments_badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              {t.payments_title}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-normal">
              {t.payments_desc}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Tabs selection sidebar */}
            <div className="lg:col-span-4 space-y-3">
              <span className={`text-[10px] font-bold text-slate-500 tracking-wider block uppercase mb-2 font-mono ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                {t.payments_method_select_title}
              </span>
              
              {paymentsList.map((method) => {
                const isActive = activeTab === method.id;
                // Get localized method name
                const localName = method.id === 'usdt-trc20' 
                  ? (lang === 'ar' ? 'العملات الرقمية (USDT)' : 'Cryptocurrency (USDT)')
                  : method.id === 'instapay-egypt'
                  ? (lang === 'ar' ? 'تطبيق إنستا باي (InstaPay Egypt)' : 'InstaPay App (Egypt)')
                  : (lang === 'ar' ? 'حوالة بنكية محلية / دولية' : 'Local / International Bank Transfer');

                return (
                  <button
                    id={`payment-tab-btn-${method.id}`}
                    key={method.id}
                    onClick={() => setActiveTab(method.id)}
                    className={`w-full p-4 rounded-none border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 border-cyan-400 text-cyan-400'
                        : 'bg-slate-900/20 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-none ${isActive ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-950 text-slate-400'}`}>
                        {getPaymentIcon(method.iconName)}
                      </div>
                      <span className="text-sm font-bold">{localName}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 bg-cyan-400 shrink-0" />}
                  </button>
                );
              })}

              <div className={`bg-slate-900/10 border border-slate-800 p-4 rounded-none text-xs text-slate-400 flex items-start gap-2.5 leading-relaxed mt-6 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{t.payments_warning_box}</span>
              </div>
            </div>

            {/* Selected payment content details card */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  id="selected-payment-content"
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-slate-900/10 border border-slate-800 rounded-none p-6 sm:p-8 space-y-6 shadow-xl"
                >
                  <div className={`flex items-center justify-between border-b border-slate-800 pb-4 ${dir === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <h3 className={`text-lg font-bold text-white flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {getPaymentIcon(activePayment.iconName)}
                      <span>{t.payments_details_title} {activePayment.name}</span>
                    </h3>
                    <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-none border border-cyan-500/20 font-mono">
                      {activePayment.type.toUpperCase()}
                    </span>
                  </div>

                  {/* Render content dynamically depending on payment type */}
                  {activePayment.type === 'usdt' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className={`text-xs text-slate-400 block font-mono ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                          {t.payments_label_usdt_addr}
                        </span>
                        <div 
                          id="usdt-address-container"
                          onClick={() => handleCopy(activePayment.details.address || '', 'addr')}
                          className="flex items-center bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-cyan-500/40 rounded-none p-3 sm:p-4 justify-between font-mono text-xs sm:text-sm text-cyan-300 select-all overflow-x-auto gap-4 cursor-pointer transition-all group"
                          title={lang === 'ar' ? 'انقر لنسخ العنوان الرقمي' : 'Click to copy USDT address'}
                        >
                          <span className="break-all">{activePayment.details.address}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            {copied === 'addr' && <span className="text-[10px] text-cyan-400 font-mono font-bold">{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>}
                            <button
                              id="copy-usdt-address-btn"
                              onClick={(e) => { e.stopPropagation(); handleCopy(activePayment.details.address || '', 'addr'); }}
                              className="p-2 rounded-none bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 shrink-0 transition-colors cursor-pointer"
                              title="Copy address"
                            >
                              {copied === 'addr' ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                        <div className={`bg-slate-950 border border-slate-850 p-4 rounded-none ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                          <span className="text-[9px] text-slate-500 block">{t.payments_label_network}</span>
                          <span className="text-sm font-bold text-slate-200 mt-1 block">{activePayment.details.network}</span>
                        </div>
                        <div className={`bg-slate-950 border border-slate-850 p-4 rounded-none ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                          <span className="text-[9px] text-slate-500 block">{t.payments_label_min_transfer}</span>
                          <span className="text-sm font-bold text-slate-200 mt-1 block">10 USDT</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activePayment.type === 'local_wallet' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <span className={`text-xs text-slate-400 block font-mono ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                          {t.payments_label_wallet_num}
                        </span>
                        <div 
                          id="wallet-num-container"
                          onClick={() => handleCopy(activePayment.details.walletNumber || '', 'wallet')}
                          className="flex items-center bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-cyan-500/40 rounded-none p-3 sm:p-4 justify-between font-mono text-xs sm:text-sm text-cyan-300 select-all gap-4 cursor-pointer transition-all group"
                          title={lang === 'ar' ? 'انقر للنسخ' : 'Click to copy'}
                        >
                          <span className="break-all font-bold">{activePayment.details.walletNumber}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            {copied === 'wallet' && <span className="text-[10px] text-cyan-400 font-mono font-bold">{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>}
                            <button
                              id="copy-wallet-id-btn"
                              onClick={(e) => { e.stopPropagation(); handleCopy(activePayment.details.walletNumber || '', 'wallet'); }}
                              className="p-2 rounded-none bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 shrink-0 transition-colors cursor-pointer"
                              title="Copy ID"
                            >
                              {copied === 'wallet' ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div 
                        id="wallet-holder-container"
                        onClick={() => handleCopy(activePayment.details.accountHolder || '', 'holder')}
                        className={`bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-cyan-500/40 p-4 rounded-none cursor-pointer transition-all flex items-center justify-between group ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                        title={lang === 'ar' ? 'انقر للنسخ' : 'Click to copy'}
                      >
                        <div>
                          <span className="text-xs text-slate-500 block">{t.payments_label_holder}</span>
                          <span className="text-sm font-bold text-slate-200 mt-1 block">{activePayment.details.accountHolder}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {copied === 'holder' && <span className="text-[10px] text-cyan-400 font-mono font-bold">{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>}
                          {copied === 'holder' ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />}
                        </div>
                      </div>
                    </div>
                  )}

                  {activePayment.type === 'local_bank' && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div 
                          id="bank-name-container"
                          onClick={() => handleCopy(activePayment.details.bankName || '', 'bank')}
                          className={`bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-cyan-500/40 p-4 rounded-none cursor-pointer transition-all flex items-center justify-between group ${dir === 'rtl' ? 'text-right flex-row-reverse' : 'text-left flex-row'}`}
                          title={lang === 'ar' ? 'انقر للنسخ' : 'Click to copy'}
                        >
                          <div>
                            <span className="text-xs text-slate-500 block">{t.payments_label_bank}</span>
                            <span className="text-sm font-bold text-slate-200 mt-1 block">{activePayment.details.bankName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {copied === 'bank' && <span className="text-[10px] text-cyan-400 font-mono font-bold">{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>}
                            {copied === 'bank' ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />}
                          </div>
                        </div>
                        <div 
                          id="bank-holder-container"
                          onClick={() => handleCopy(activePayment.details.accountHolder || '', 'holder')}
                          className={`bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-cyan-500/40 p-4 rounded-none cursor-pointer transition-all flex items-center justify-between group ${dir === 'rtl' ? 'text-right flex-row-reverse' : 'text-left flex-row'}`}
                          title={lang === 'ar' ? 'انقر للنسخ' : 'Click to copy'}
                        >
                          <div>
                            <span className="text-xs text-slate-500 block">{t.payments_label_holder}</span>
                            <span className="text-sm font-bold text-slate-200 mt-1 block">{activePayment.details.accountHolder}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {copied === 'holder' && <span className="text-[10px] text-cyan-400 font-mono font-bold">{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>}
                            {copied === 'holder' ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className={`text-xs text-slate-400 block font-mono ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                          {t.payments_label_acc_num}
                        </span>
                        <div 
                          id="bank-acc-container"
                          onClick={() => handleCopy(activePayment.details.accountNumber || '', 'acc')}
                          className="flex items-center bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-cyan-500/40 rounded-none p-3 sm:p-4 justify-between font-mono text-xs sm:text-sm text-cyan-300 gap-4 cursor-pointer transition-all group"
                          title={lang === 'ar' ? 'انقر للنسخ' : 'Click to copy'}
                        >
                          <span className="break-all">{activePayment.details.accountNumber}</span>
                          <div className="flex items-center gap-2 shrink-0">
                            {copied === 'acc' && <span className="text-[10px] text-cyan-400 font-mono font-bold">{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>}
                            <button
                              id="copy-acc-num-btn"
                              onClick={(e) => { e.stopPropagation(); handleCopy(activePayment.details.accountNumber || '', 'acc'); }}
                              className="p-2 rounded-none bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 shrink-0 transition-colors cursor-pointer"
                            >
                              {copied === 'acc' ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {activePayment.details.iban && (
                        <div className="space-y-2">
                          <span className={`text-xs text-slate-400 block font-mono ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                            {t.payments_label_iban}
                          </span>
                          <div 
                            id="bank-iban-container"
                            onClick={() => handleCopy(activePayment.details.iban || '', 'iban')}
                            className="flex items-center bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-cyan-500/40 rounded-none p-3 sm:p-4 justify-between font-mono text-xs sm:text-sm text-cyan-300 gap-4 cursor-pointer transition-all group"
                            title={lang === 'ar' ? 'انقر للنسخ' : 'Click to copy'}
                          >
                            <span className="break-all">{activePayment.details.iban}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              {copied === 'iban' && <span className="text-[10px] text-cyan-400 font-mono font-bold">{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>}
                              <button
                                id="copy-iban-btn"
                                onClick={(e) => { e.stopPropagation(); handleCopy(activePayment.details.iban || '', 'iban'); }}
                                className="p-2 rounded-none bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 shrink-0 transition-colors cursor-pointer"
                              >
                                {copied === 'iban' ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Payment Instruction box */}
                  <div className={`bg-slate-900 border border-slate-850 p-4 rounded-none text-xs sm:text-sm leading-relaxed text-slate-400 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    <span className="font-bold block mb-1 text-slate-300 font-mono">{t.payments_label_instruction}</span>
                    <p className="font-normal">{activePayment.details.instruction}</p>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* 2. Contact form section */}
      <section id="contact" className="py-24 relative overflow-hidden border-b border-slate-800">
        
        {/* Module label */}
        <div className={`absolute top-8 ${dir === 'rtl' ? 'left-8' : 'right-8'} font-mono text-[10px] text-slate-600 tracking-widest hidden sm:block`}>
          {t.contact_module_label}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 right-0 w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Contact details list left */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-12">
              
              <motion.div 
                className={`space-y-6 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariant}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider">
                  <Mail className="w-3 h-3 text-cyan-400" />
                  <span>{t.contact_badge}</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  {t.contact_title}
                </h2>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-normal">
                  {t.contact_desc}
                </p>
              </motion.div>

              {/* Directly structured details */}
              <div className={`space-y-6 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                
                <div 
                  id="contact-email-copyable"
                  onClick={() => handleCopy(contactInfo.email || '', 'email')}
                  className={`flex items-center gap-4 group cursor-pointer p-2.5 bg-slate-900/10 hover:bg-slate-900/40 border border-slate-900 hover:border-cyan-500/30 transition-all ${dir === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}
                  title={lang === 'ar' ? 'انقر لنسخ البريد الإلكتروني' : 'Click to copy email'}
                >
                  <div className="w-11 h-11 rounded-none bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0 group-hover:border-cyan-500/50 transition-colors">
                    {copied === 'email' ? <Check className="w-5 h-5 text-cyan-400" /> : <Mail className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 uppercase font-mono">{t.contact_label_email}</span>
                      {copied === 'email' && <span className="text-[10px] text-cyan-400 font-mono font-bold">{lang === 'ar' ? '(تم النسخ!)' : '(Copied!)'}</span>}
                    </div>
                    <span className="text-sm sm:text-base font-bold text-slate-200 group-hover:text-cyan-400 transition-colors font-mono select-all block truncate">
                      {contactInfo.email}
                    </span>
                  </div>
                </div>

                <div 
                  id="contact-phone-copyable"
                  onClick={() => handleCopy(contactInfo.phone || '', 'phone')}
                  className={`flex items-center gap-4 group cursor-pointer p-2.5 bg-slate-900/10 hover:bg-slate-900/40 border border-slate-900 hover:border-cyan-500/30 transition-all ${dir === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}
                  title={lang === 'ar' ? 'انقر لنسخ رقم الهاتف' : 'Click to copy phone'}
                >
                  <div className="w-11 h-11 rounded-none bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0 group-hover:border-cyan-500/50 transition-colors">
                    {copied === 'phone' ? <Check className="w-5 h-5 text-cyan-400" /> : <Phone className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 uppercase font-mono">{t.contact_label_tel}</span>
                      {copied === 'phone' && <span className="text-[10px] text-cyan-400 font-mono font-bold">{lang === 'ar' ? '(تم النسخ!)' : '(Copied!)'}</span>}
                    </div>
                    <span className="text-sm sm:text-base font-bold text-slate-200 group-hover:text-cyan-400 transition-colors font-mono select-all block truncate">
                      {contactInfo.phone}
                    </span>
                  </div>
                </div>

                <div 
                  id="contact-location-copyable"
                  onClick={() => {
                    const loc = lang === 'ar' ? (contactInfo.locationAr || contactInfo.location) : (contactInfo.locationEn || 'Cairo, Egypt (Available for remote work globally)');
                    handleCopy(loc, 'location');
                  }}
                  className={`flex items-center gap-4 group cursor-pointer p-2.5 bg-slate-900/10 hover:bg-slate-900/40 border border-slate-900 hover:border-cyan-500/30 transition-all ${dir === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}
                  title={lang === 'ar' ? 'انقر لنسخ الموقع الإقليمي' : 'Click to copy location'}
                >
                  <div className="w-11 h-11 rounded-none bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0 group-hover:border-cyan-500/50 transition-colors">
                    {copied === 'location' ? <Check className="w-5 h-5 text-cyan-400" /> : <MapPin className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 uppercase font-mono">{t.contact_label_loc}</span>
                      {copied === 'location' && <span className="text-[10px] text-cyan-400 font-mono font-bold">{lang === 'ar' ? '(تم النسخ!)' : '(Copied!)'}</span>}
                    </div>
                    <span className="text-sm sm:text-base font-bold text-slate-200 group-hover:text-cyan-400 transition-colors block truncate">
                      {lang === 'ar' ? (contactInfo.locationAr || contactInfo.location) : (contactInfo.locationEn || 'Cairo, Egypt (Available for remote work globally)')}
                    </span>
                  </div>
                </div>

              </div>

              {/* Consultation Scheduling Component */}
              <ConsultationScheduler />

              {/* Local Storage Sent Messages list display */}
              {savedMessages.length > 0 && (
                <div className={`border-t border-slate-800 pt-6 space-y-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <span className="text-xs font-bold text-cyan-400 block font-mono">{t.contact_archive_title}</span>
                  <div className="max-h-36 overflow-y-auto space-y-2 pr-1 pl-1">
                    {savedMessages.map((msg) => (
                      <div key={msg.id} className="bg-slate-950 border border-slate-850 p-3 rounded-none text-xs space-y-1">
                        <div className={`flex items-center justify-between text-slate-400 font-mono ${dir === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <span className="font-bold text-slate-300">{msg.name}</span>
                          <span>{msg.date}</span>
                        </div>
                        <p className={`text-slate-500 line-clamp-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Form Right */}
            <motion.div 
              className="lg:col-span-7 bg-slate-900/10 border border-slate-800 rounded-none p-6 sm:p-8 shadow-xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUpVariant}
            >
              <ContactForm />
            </motion.div>

          </div>

        </div>
      </section>

    </div>
  );
}
