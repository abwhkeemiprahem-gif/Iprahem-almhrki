import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TranslatedProject } from '../translations';
import { getLocalizedProjects } from '../translations';
import { useLanguage } from '../LanguageContext';
import { ExternalLink, BookOpen, X, Cpu, Sparkles, Download, Search, Eye, EyeOff, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { useAppStore } from '../store/appStore';
import { ProjectCard } from './ProjectCard';

export default function Portfolio() {
  const { lang, t, dir } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<TranslatedProject | null>(null);
  const [localizedProjects, setLocalizedProjects] = useState<TranslatedProject[]>([]);
  const { isFocusMode, setFocusMode, addToast } = useAppStore();
  const initialLoadedRef = useRef(false);

  // Snappy skeleton loading state for professional filtering visual response
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => {
      setIsFiltering(false);
    }, 250); // Snappy, premium 250ms momentary skeleton loading duration
    return () => clearTimeout(timer);
  }, [activeFilter, searchQuery]);

  useEffect(() => {
    if (!selectedProject) {
      setFocusMode(false);
    }
  }, [selectedProject, setFocusMode]);

  useEffect(() => {
    const loadProjects = () => {
      const stored = localStorage.getItem('consultant_projects');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const mapped = parsed.map((p: any) => {
              let tStack: string[] = [];
              if (Array.isArray(p.techStack)) {
                tStack = p.techStack;
              } else if (typeof p.techStack === 'string') {
                tStack = p.techStack.split(',').map((t: string) => t.trim()).filter(Boolean);
              }

              return {
                id: p.id || 'project_' + Math.random().toString(36).substring(2, 7),
                title: lang === 'ar' ? (p.titleAr || p.titleEn || '') : (p.titleEn || p.titleAr || ''),
                category: lang === 'ar' ? (p.categoryAr || p.categoryEn || '') : (p.categoryEn || p.categoryAr || ''),
                description: lang === 'ar' ? (p.descriptionAr || p.descriptionEn || '') : (p.descriptionEn || p.descriptionAr || ''),
                longDescription: lang === 'ar' ? (p.longDescriptionAr || p.longDescriptionEn || '') : (p.longDescriptionEn || p.longDescriptionAr || ''),
                image: p.image || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
                techStack: tStack,
                demoUrl: p.demoUrl || '#contact',
                stats: [
                  { label: lang === 'ar' ? (p.stat1LabelAr || p.stat1LabelEn || '') : (p.stat1LabelEn || p.stat1LabelAr || ''), value: p.stat1Val || '' },
                  { label: lang === 'ar' ? (p.stat2LabelAr || p.stat2LabelEn || '') : (p.stat2LabelEn || p.stat2LabelAr || ''), value: p.stat2Val || '' },
                  { label: lang === 'ar' ? (p.stat3LabelAr || p.stat3LabelEn || '') : (p.stat3LabelEn || p.stat3LabelAr || ''), value: p.stat3Val || '' }
                ].filter(s => s.label || s.value)
              };
            });
            setLocalizedProjects(mapped);
          } else {
            setLocalizedProjects(getLocalizedProjects(lang));
          }
        } catch (e) {
          console.error("Failed to parse projects from localStorage", e);
          setLocalizedProjects(getLocalizedProjects(lang));
        }
      } else {
        setLocalizedProjects(getLocalizedProjects(lang));
      }

      if (!initialLoadedRef.current) {
        addToast(
          lang === 'ar' 
            ? 'تم تحميل محتويات معرض أعمال النظم السيادية بنجاح.' 
            : 'Sovereign systems portfolio loaded successfully.', 
          'success'
        );
        initialLoadedRef.current = true;
      }
    };

    loadProjects();
    window.addEventListener('storage_update', loadProjects);
    return () => window.removeEventListener('storage_update', loadProjects);
  }, [lang, addToast]);

  const filters = [
    { id: 'all', label: t.portfolio_filter_all },
    { id: 'saas', label: t.portfolio_filter_saas },
    { id: 'sovereign', label: t.portfolio_filter_sovereign },
    { id: 'edu', label: t.portfolio_filter_edu },
    { id: 'software', label: t.portfolio_filter_software },
    { id: 'consulting', label: t.portfolio_filter_consulting },
    { id: 'automation', label: t.portfolio_filter_automation },
  ];

  const filteredProjects = useMemo(() => {
    return localizedProjects.filter(project => {
      // 1. Filter by category
      if (activeFilter !== 'all') {
        const cat = (project.category || '').toLowerCase();
        const projId = (project.id || '').toLowerCase();
        
        let categoryMatch = false;
        
        if (activeFilter === 'saas') {
          categoryMatch = 
            cat.includes('saas') || 
            cat.includes('منصات') || 
            cat.includes('سحاب') ||
            projId.includes('shield') || 
            projId.includes('quality') ||
            projId.includes('saas');
        } else if (activeFilter === 'sovereign') {
          categoryMatch = 
            cat.includes('sovereign') || 
            cat.includes('سياد') || 
            cat.includes('أرشف') || 
            cat.includes('سياج') ||
            projId.includes('siyaj') || 
            projId.includes('sovereign');
        } else if (activeFilter === 'edu') {
          categoryMatch = 
            cat.includes('edu') || 
            cat.includes('تعليم') || 
            cat.includes('ألعاب') || 
            cat.includes('لعب') || 
            projId.includes('letter') || 
            projId.includes('edu');
        } else if (activeFilter === 'software') {
          categoryMatch = 
            cat.includes('soft') || 
            cat.includes('برمج') || 
            cat.includes('تطوير') || 
            cat.includes('كود') || 
            cat.includes('saas') ||
            cat.includes('تعليم') ||
            cat.includes('ألعاب') ||
            projId.includes('letter') ||
            projId.includes('siyaj') ||
            projId.includes('shield') ||
            projId.includes('quality') ||
            !cat.includes('استشار');
        } else if (activeFilter === 'consulting') {
          categoryMatch = 
            cat.includes('consult') || 
            cat.includes('استشار') || 
            cat.includes('تدقيق') || 
            cat.includes('جودة') || 
            cat.includes('تحليل') || 
            cat.includes('تقييم') ||
            projId.includes('quality') ||
            projId.includes('audit') ||
            projId.includes('consult');
        } else if (activeFilter === 'automation') {
          categoryMatch = 
            cat.includes('automat') || 
            cat.includes('أتمت') || 
            cat.includes('تشغيل') || 
            cat.includes('تحكم') || 
            cat.includes('سياد') ||
            projId.includes('siyaj') || 
            projId.includes('shield') ||
            projId.includes('automation');
        }
        
        if (!categoryMatch) return false;
      }

      // 2. Filter by search query (title, description, or tech stack)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = (project.title || '').toLowerCase().includes(query);
        const descMatch = (project.description || '').toLowerCase().includes(query);
        const techMatch = (project.techStack || []).some(tech => tech.toLowerCase().includes(query));
        return titleMatch || descMatch || techMatch;
      }

      return true;
    });
  }, [localizedProjects, activeFilter, searchQuery]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Set background color of header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 45, 'F');
    
    // Header Text
    doc.setTextColor(34, 211, 238); // cyan-400
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.text("ENG. IBRAHIM AL-MUHARQI", 15, 20);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("Helvetica", "normal");
    doc.text("Lead Software Architect & Sovereign Solutions Consultant", 15, 28);
    doc.text("Website: " + window.location.origin, 15, 35);
    
    // Section: Profile Overview
    doc.setTextColor(15, 23, 42);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text("PROFESSIONAL PROFILE & METRICS", 15, 55);
    
    doc.setDrawColor(34, 211, 238);
    doc.setLineWidth(1);
    doc.line(15, 58, 195, 58);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    
    const statsText = [
      "• Experience: 8+ Years in Enterprise and Sovereign Systems Automation",
      "• Projects: 14+ Completed SaaS, Cryptographic Security & Educational Modules",
      "• Availability: Open to Remote Consultation Globally"
    ];
    let statY = 65;
    statsText.forEach(line => {
      doc.text(line, 15, statY);
      statY += 6;
    });
    
    // Section: Core Portfolio Projects
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("CORE PORTFOLIO PROJECTS", 15, 90);
    doc.line(15, 93, 195, 93);
    
    // We will pull the raw data for projects in English to guarantee zero encoding/rendering issues on PDFs.
    const englishProjects = getLocalizedProjects('en');
    
    let currentY = 100;
    englishProjects.forEach((proj, idx) => {
      // Check for page overflow
      if (currentY > 230) {
        doc.addPage();
        currentY = 20;
      }
      
      // Project Title
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(14, 116, 144); // cyan-700
      doc.text(`${idx + 1}. ${proj.title.toUpperCase()}`, 15, currentY);
      currentY += 5;
      
      // Category & Tech
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105); // slate-600
      const techList = Array.isArray(proj.techStack) ? proj.techStack.join(", ") : proj.techStack;
      doc.text(`Category: ${proj.category}  |  Stack: ${techList}`, 15, currentY);
      currentY += 5;
      
      // Description
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85); // slate-700
      // Split description text to wrap correctly
      const descLines = doc.splitTextToSize(proj.description, 180);
      doc.text(descLines, 15, currentY);
      currentY += (descLines.length * 4) + 2;
      
      // Render Stats if present
      if (proj.stats && proj.stats.length > 0) {
        doc.setFont("Helvetica", "oblique");
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        const statsStr = proj.stats.map(s => `${s.label}: ${s.value}`).join("   |   ");
        doc.text(`Metrics: ${statsStr}`, 15, currentY);
        currentY += 5;
      }
      
      currentY += 8; // spacing between projects
    });
    
    // Save Document
    doc.save("Ibrahim_Al_Muharqi_Portfolio.pdf");
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const gridContainerVariant = {
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
    <section id="portfolio" className="py-24 bg-slate-950 border-b border-slate-800 relative">
      {/* Background radial glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      {/* Module label */}
      <div className={`absolute top-8 ${dir === 'rtl' ? 'left-8' : 'right-8'} font-mono text-[10px] text-slate-600 tracking-widest hidden sm:block`}>
        {t.portfolio_module_label}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Title and Headings */}
        <motion.div 
          className={`max-w-3xl mb-16 space-y-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold tracking-wider">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{t.portfolio_badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {t.portfolio_title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-normal">
            {t.portfolio_desc}
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          className="mb-8 font-mono"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
        >
          <div className="relative w-full max-w-xl">
            <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-4' : 'left-4'} flex items-center pointer-events-none text-slate-500`}>
              <Search className="w-4 h-4 transition-colors duration-200" />
            </div>
            <input
              id="portfolio-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.portfolio_search_placeholder}
              className={`w-full py-3 ${dir === 'rtl' ? 'pr-11 pl-4' : 'pl-11 pr-4'} bg-slate-900/30 hover:bg-slate-900/50 focus:bg-slate-950 text-white placeholder-slate-500 rounded-none border border-slate-800 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all duration-300 text-xs sm:text-sm font-sans`}
            />
            {searchQuery && (
              <button
                id="clear-search-btn"
                onClick={() => setSearchQuery('')}
                className={`absolute inset-y-0 ${dir === 'rtl' ? 'left-4' : 'right-4'} flex items-center text-slate-500 hover:text-white text-xs transition-colors cursor-pointer`}
              >
                {lang === 'ar' ? 'مسح' : 'Clear'}
              </button>
            )}
          </div>
        </motion.div>

        {/* Filter categories tabs */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 font-mono"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariant}
        >
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  id={`filter-btn-${filter.id}`}
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2.5 rounded-none text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-950 border border-white'
                      : 'bg-slate-900/50 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <button
            id="download-pdf-btn"
            type="button"
            onClick={handleDownloadPDF}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-slate-950 hover:text-white text-xs font-extrabold uppercase flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-lg shadow-cyan-500/10 border border-transparent"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>{lang === 'ar' ? 'تحميل الملخص المهني PDF' : 'Download CV Summary PDF'}</span>
          </button>
        </motion.div>

        {/* Empty state message */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 border border-dashed border-slate-800 bg-slate-900/10 mb-8"
          >
            <Search className="w-8 h-8 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-sans text-sm max-w-md mx-auto">
              {t.portfolio_no_results}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-850 text-cyan-400 text-xs font-mono border border-slate-800 transition-colors cursor-pointer"
              >
                {lang === 'ar' ? 'عرض جميع المشاريع' : 'Show all projects'}
              </button>
            )}
          </motion.div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {isFiltering ? (
              // 3 premium skeleton loader cards that pulse elegantly
              Array.from({ length: 3 }).map((_, idx) => (
                <motion.div
                  id={`project-skeleton-${idx}`}
                  key={`skeleton-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="bg-slate-900/10 border border-slate-800 rounded-none overflow-hidden h-[420px] flex flex-col justify-between p-0 shadow-xl"
                >
                  {/* Skeleton Image area */}
                  <div className="relative aspect-video w-full bg-slate-900 animate-pulse flex items-center justify-center border-b border-slate-800/60">
                    <Cpu className="w-8 h-8 opacity-20 animate-spin text-cyan-500" />
                  </div>
                  
                  {/* Skeleton details and metadata */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Title pulse line */}
                      <div className="h-5 bg-slate-800/60 animate-pulse w-3/4 rounded-none" />
                      {/* Description pulse lines */}
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-800/30 animate-pulse w-full rounded-none" />
                        <div className="h-3 bg-slate-800/30 animate-pulse w-5/6 rounded-none" />
                      </div>
                    </div>

                    {/* Tech stack badge skeletons */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      <div className="h-5 bg-slate-900 animate-pulse w-14 rounded-none border border-slate-850" />
                      <div className="h-5 bg-slate-900 animate-pulse w-16 rounded-none border border-slate-850" />
                      <div className="h-5 bg-slate-900 animate-pulse w-12 rounded-none border border-slate-850" />
                    </div>

                    {/* Footer button skeleton */}
                    <div className="pt-4 border-t border-slate-800/50">
                      <div className="h-8 bg-slate-950/50 animate-pulse w-full rounded-none border border-slate-850" />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelect={setSelectedProject}
                  dir={dir}
                  lang={lang}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Project Details Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-55 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
              
              {/* Click outside target */}
              <div 
                id="modal-backdrop"
                className="absolute inset-0" 
                onClick={() => setSelectedProject(null)} 
              />

              <motion.div
                id="project-details-modal"
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="relative bg-slate-950 border border-slate-800 rounded-none w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl z-10"
              >
                {/* Modal Header */}
                {!isFocusMode ? (
                  <div className="relative aspect-video w-full">
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    {/* Close button */}
                    <button
                      id="close-modal-btn"
                      onClick={() => setSelectedProject(null)}
                      className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} p-2 bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-900 transition-all cursor-pointer z-10`}
                      aria-label="Close modal"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Focus Mode button */}
                    <button
                      id="focus-mode-toggle-btn"
                      onClick={() => setFocusMode(true)}
                      className={`absolute top-4 ${dir === 'rtl' ? 'left-16' : 'right-16'} px-3 py-1.5 bg-slate-950 text-cyan-400 hover:text-white border border-slate-800 hover:bg-slate-900 text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 z-10`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'وضع التركيز' : 'Focus Mode'}</span>
                    </button>

                    <div className={`absolute bottom-4 ${dir === 'rtl' ? 'right-6 left-6 text-right' : 'left-6 right-6 text-left'}`}>
                      <span className="text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-none border border-cyan-500/30 inline-block mb-2">
                        {selectedProject.category}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                        {selectedProject.title}
                      </h3>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border-b border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className={`space-y-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{selectedProject.category}</span>
                      <h3 className="text-xl font-black text-white">{selectedProject.title}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        id="focus-mode-toggle-btn-exit"
                        onClick={() => setFocusMode(false)}
                        className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 hover:text-white border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'إلغاء وضع التركيز' : 'Exit Focus'}</span>
                      </button>
                      <button
                        id="close-modal-btn-focus"
                        onClick={() => setSelectedProject(null)}
                        className="p-2 bg-slate-900 text-slate-300 hover:text-white border border-slate-800 transition-all cursor-pointer"
                        aria-label="Close modal"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Modal Body */}
                <div className={`p-6 sm:p-8 ${isFocusMode ? 'space-y-8 max-w-xl mx-auto' : 'space-y-6'}`}>
                  
                  {/* Full detailed description */}
                  <div className={`space-y-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {!isFocusMode && (
                      <h4 className={`text-sm font-bold text-slate-300 flex items-center gap-2 ${dir === 'rtl' ? 'flex-row' : 'flex-row'}`}>
                        <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>{t.portfolio_modal_about}</span>
                      </h4>
                    )}
                    <p className={`text-slate-300 leading-relaxed font-normal ${isFocusMode ? 'text-base sm:text-lg text-slate-100 selection:bg-cyan-500/30' : 'text-sm text-slate-400'}`}>
                      {selectedProject.longDescription}
                    </p>
                  </div>

                  {/* Performance stats if available */}
                  {!isFocusMode && selectedProject.stats && selectedProject.stats.length > 0 && (
                    <div className={`space-y-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                      <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>{t.portfolio_modal_efficiency}</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {selectedProject.stats.map((stat, i) => (
                          <div key={i} className="bg-slate-900/30 border border-slate-800 p-4 rounded-none text-center">
                            <span className="block text-xl font-bold text-cyan-400 font-mono">{stat.value}</span>
                            <span className="text-[11px] text-slate-500 mt-1 block">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Full tech stack listing */}
                  {!isFocusMode && (
                    <div className={`space-y-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                      <h4 className="text-sm font-bold text-slate-300">{t.portfolio_modal_tech}</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.techStack.map((tech) => (
                          <span key={tech} className="text-xs font-mono bg-slate-900 text-slate-300 px-3 py-1.5 rounded-none border border-slate-800">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions / Buttons */}
                  <div className={`pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3 ${isFocusMode ? 'justify-center' : ''}`}>
                    {selectedProject.demoUrl && selectedProject.demoUrl !== '' && (
                      selectedProject.demoUrl.startsWith('http') ? (
                        <a
                          id="modal-project-demo-link"
                          href={selectedProject.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`bg-white text-slate-950 font-bold text-sm py-3 px-4 rounded-none text-center flex items-center justify-center gap-2 hover:bg-cyan-400 transition-all ${isFocusMode ? 'w-full sm:w-auto px-8' : 'flex-1'}`}
                        >
                          <ExternalLink className="w-4 h-4 text-slate-950" />
                          <span>{t.portfolio_modal_demo_btn}</span>
                        </a>
                      ) : (
                        <button
                          id="modal-project-demo-contact-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedProject(null);
                            const targetEl = document.getElementById('contact');
                            if (targetEl) {
                              targetEl.scrollIntoView({ behavior: 'smooth' });
                            } else {
                              window.location.hash = 'contact';
                            }
                          }}
                          className={`bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm py-3 px-4 rounded-none text-center flex items-center justify-center gap-2 transition-all cursor-pointer ${isFocusMode ? 'w-full sm:w-auto px-8' : 'flex-1'}`}
                        >
                          <Send className="w-4 h-4 text-white" />
                          <span>{lang === 'ar' ? 'تواصل لطلب الكود المصدري / العرض التجريبي' : 'Request Source Code / Live Demo'}</span>
                        </button>
                      )
                    )}
                    <button
                      id="modal-close-action-btn"
                      onClick={() => setSelectedProject(null)}
                      className={`bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-sm py-3 px-6 rounded-none border border-slate-800 text-center transition-colors cursor-pointer ${isFocusMode ? 'w-full sm:w-auto' : 'flex-1 sm:flex-initial'}`}
                    >
                      {t.portfolio_modal_close_btn}
                    </button>
                  </div>

                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
