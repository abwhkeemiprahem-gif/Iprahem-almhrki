import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { useAppStore } from '../store/appStore';
import { Calendar, Clock, Check, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ConsultationScheduler() {
  const { lang, t, dir } = useLanguage();
  const { addToast } = useAppStore();

  // Generate next 6 business days (skipping Fridays/weekends based on regional workspace preference)
  const getNextBusinessDays = () => {
    const days = [];
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    let current = new Date();

    while (days.length < 6) {
      current.setDate(current.getDate() + 1);
      const dayOfWeek = current.getDay();
      // Skip Friday (5) & Saturday (6) in Islamic/Regional corporate style, or Sunday (0) depending on preference.
      // Let's keep all days but highlight availability
      days.push({
        dateString: current.toISOString().split('T')[0],
        display: current.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', options),
        dayName: current.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long' }),
        rawDate: new Date(current)
      });
    }
    return days;
  };

  const availableDays = getNextBusinessDays();
  const [selectedDate, setSelectedDate] = useState<string>(availableDays[0].dateString);

  // Preferred timeslots
  const timeSlots = [
    { id: 'morning', labelAr: '10:00 صباحاً - 12:00 ظهراً', labelEn: '10:00 AM - 12:00 PM' },
    { id: 'afternoon', labelAr: '02:00 ظهراً - 04:00 عصراً', labelEn: '02:00 PM - 04:00 PM' },
    { id: 'evening', labelAr: '06:00 مساءً - 08:00 مساءً', labelEn: '06:00 PM - 08:00 PM' },
  ];
  const [selectedSlot, setSelectedSlot] = useState<string>('afternoon');
  const [isBooking, setIsBooking] = useState(false);
  const [bookedSlot, setBookedSlot] = useState<{ date: string; slot: string } | null>(null);

  const handleBook = () => {
    setIsBooking(true);
    setTimeout(() => {
      const selectedDayObj = availableDays.find(d => d.dateString === selectedDate);
      const selectedSlotObj = timeSlots.find(s => s.id === selectedSlot);
      
      const dateLabel = selectedDayObj ? selectedDayObj.display : selectedDate;
      const slotLabel = selectedSlotObj ? (lang === 'ar' ? selectedSlotObj.labelAr : selectedSlotObj.labelEn) : selectedSlot;

      setBookedSlot({ date: dateLabel, slot: slotLabel });
      setIsBooking(false);

      addToast(
        lang === 'ar'
          ? `✓ تم تسجيل موعد الاستشارة المبدئي: ${dateLabel} (${slotLabel})`
          : `✓ Scheduled: Engineering Consultation on ${dateLabel} (${slotLabel})`,
        'success'
      );
    }, 800);
  };

  return (
    <div className="bg-slate-950/60 border border-slate-900 p-5 sm:p-6 space-y-6">
      
      {/* Title */}
      <div className={`space-y-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            {lang === 'ar' ? 'جلسة تفاعلية وسريعة' : 'PREFERENCE BOOKING SCHEDULER'}
          </h4>
        </div>
        <p className="text-xs text-slate-400">
          {lang === 'ar' 
            ? 'اختر موعدك المفضل لمناقشة تدقيق جودة برمجياتك وسرعة خوادمك.' 
            : 'Select your preferred time block for a deep-dive sovereign systems audit.'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!bookedSlot ? (
          <motion.div
            key="scheduler-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* Step 1: Select Date */}
            <div className="space-y-2">
              <span className={`text-[10px] text-slate-500 font-mono uppercase tracking-wider block ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                {lang === 'ar' ? '1. حدد اليوم المفضل:' : '1. SELECT PREFERRED DATE:'}
              </span>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {availableDays.map((day) => {
                  const isSelected = selectedDate === day.dateString;
                  return (
                    <button
                      key={day.dateString}
                      type="button"
                      onClick={() => setSelectedDate(day.dateString)}
                      className={`p-2.5 border transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                        isSelected 
                          ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                          : 'bg-slate-900/30 border-slate-850 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="text-[10px] font-bold block uppercase leading-none mb-1">
                        {day.dayName.split(' ')[0]}
                      </span>
                      <span className="text-xs font-bold block font-mono">
                        {day.rawDate.getDate()}
                      </span>
                      <span className="text-[9px] text-slate-500 mt-0.5 block whitespace-nowrap">
                        {day.rawDate.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short' })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Select Time Slot */}
            <div className="space-y-2">
              <span className={`text-[10px] text-slate-500 font-mono uppercase tracking-wider block ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                {lang === 'ar' ? '2. حدد الوقت المفضل (توقيت مكة/القاهرة):' : '2. CHOOSE TIME FRAME (GMT+3):'}
              </span>

              <div className="space-y-1.5">
                {timeSlots.map((slot) => {
                  const isSelected = selectedSlot === slot.id;
                  const label = lang === 'ar' ? slot.labelAr : slot.labelEn;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`w-full p-3 border transition-all text-left flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-slate-900 border-cyan-500 text-cyan-400' 
                          : 'bg-slate-900/20 border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <span className="text-xs font-bold font-mono">{label}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Confirm button */}
            <button
              type="button"
              onClick={handleBook}
              disabled={isBooking}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer rounded-none disabled:opacity-50"
            >
              {isBooking ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>{lang === 'ar' ? 'جاري الحجز والتأكيد...' : 'Securing Schedule...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'حجز موعد مبدئي الآن' : 'REQUEST PREFERRED TIME'}</span>
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="scheduler-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 border border-cyan-500/20 bg-cyan-500/5 space-y-4 text-center font-mono"
          >
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
              <Check className="w-5 h-5" />
            </div>
            
            <div className="space-y-1">
              <span className="text-xs font-bold text-white block uppercase">
                {lang === 'ar' ? 'تم الحجز المبدئي بنجاح!' : 'SCHEDULE PRE-RESERVED!'}
              </span>
              <p className="text-[11px] text-slate-300">
                {lang === 'ar' 
                  ? 'يرجى استكمال نموذج الاتصال بجانب هذا القسم ليتسنى لنا إرسال رابط المقابلة.' 
                  : 'Please complete the contact form to receive your session calendar invite.'}
              </p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-900 rounded-none text-[11px] text-cyan-300 space-y-1">
              <div>{bookedSlot.date}</div>
              <div className="text-[10px] text-slate-400">{bookedSlot.slot}</div>
            </div>

            <button
              type="button"
              onClick={() => setBookedSlot(null)}
              className="text-[10px] text-cyan-400 hover:text-white transition-colors uppercase underline block mx-auto cursor-pointer"
            >
              {lang === 'ar' ? 'تعديل الموعد' : 'Change Schedule'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
