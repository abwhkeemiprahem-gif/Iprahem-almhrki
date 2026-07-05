import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import { TESTIMONIALS_DATA } from '../translations';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function Testimonials() {
  const { lang, t, dir } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS_DATA.length - 1 ? 0 : prev + 1));
  };

  // Autoplay functionality
  useEffect(() => {
    if (isHovered) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [currentIndex, isHovered]);

  const currentTestimonial = TESTIMONIALS_DATA[currentIndex];

  // Helper for scroll animations
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <section 
      id="testimonials" 
      className="py-24 bg-slate-950 border-b border-slate-800 relative overflow-hidden"
    >
      {/* Background Soft Lighting Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* Module label */}
      <div className={`absolute top-8 ${dir === 'rtl' ? 'left-8' : 'right-8'} font-mono text-[10px] text-slate-600 tracking-widest hidden sm:block`}>
        {t.testimonials_module_label}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className={`max-w-3xl mb-16 space-y-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider">
            <Quote className="w-3 h-3 text-cyan-400" />
            <span>{t.testimonials_badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {t.testimonials_title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-normal">
            {t.testimonials_desc}
          </p>
        </motion.div>

        {/* Carousel Deck */}
        <motion.div
          className="relative bg-slate-900/10 border border-slate-800 p-8 sm:p-12 lg:p-16 rounded-none flex flex-col justify-between"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
        >
          {/* Quote icon watermark decoration */}
          <div className={`absolute top-6 ${dir === 'rtl' ? 'left-8' : 'right-8'} opacity-[0.03] text-cyan-400 pointer-events-none`}>
            <Quote className="w-48 h-48" />
          </div>

          <div className="min-h-[200px] flex flex-col justify-center relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentIndex}-${lang}`}
                initial={{ opacity: 0, x: dir === 'rtl' ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir === 'rtl' ? 30 : -30 }}
                transition={{ duration: 0.4 }}
                className={`${dir === 'rtl' ? 'text-right' : 'text-left'} space-y-6`}
              >
                {/* Stars Indicator */}
                <div className={`flex items-center gap-1 ${dir === 'rtl' ? 'justify-start' : 'justify-start'}`}>
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                  ))}
                </div>

                {/* Feedback Body */}
                <p className="text-lg sm:text-xl lg:text-2xl text-slate-100 font-normal leading-relaxed">
                  "{currentTestimonial.feedback[lang]}"
                </p>

                {/* Author Info */}
                <div className="pt-4 border-t border-slate-800/80 max-w-sm">
                  <h4 className="text-base font-bold text-white">
                    {currentTestimonial.name[lang]}
                  </h4>
                  <span className="text-xs text-cyan-400 font-mono block mt-1 tracking-wider uppercase">
                    {currentTestimonial.role[lang]}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls Panel */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-800 pt-6">
            
            {/* Dots / Sliders indicators */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS_DATA.map((_, idx) => (
                <button
                  id={`testimonial-dot-${idx}`}
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 transition-all duration-300 ${
                    idx === currentIndex ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3 font-mono">
              <button
                id="testimonial-prev-btn"
                onClick={dir === 'rtl' ? nextSlide : prevSlide}
                className="w-10 h-10 border border-slate-800 bg-slate-950/80 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500 transition-colors"
                aria-label="Previous slide"
              >
                {dir === 'rtl' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
              
              <span className="text-xs text-slate-500 px-2 tracking-widest select-none">
                0{currentIndex + 1} / 0{TESTIMONIALS_DATA.length}
              </span>

              <button
                id="testimonial-next-btn"
                onClick={dir === 'rtl' ? prevSlide : nextSlide}
                className="w-10 h-10 border border-slate-800 bg-slate-950/80 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500 transition-colors"
                aria-label="Next slide"
              >
                {dir === 'rtl' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}
