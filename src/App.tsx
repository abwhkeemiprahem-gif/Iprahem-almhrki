import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import TerminalSimulator from './components/TerminalSimulator';
import Services from './components/Services';
import PerformanceMetrics from './components/PerformanceMetrics';
import ProjectRoadmap from './components/ProjectRoadmap';
import Testimonials from './components/Testimonials';
import GeminiChatBot from './components/GeminiChatBot';
import ShareFloatingButton from './components/ShareFloatingButton';
import PaymentsAndContact from './components/PaymentsAndContact';
import Footer from './components/Footer';
import ScrollProgressBar from './components/ScrollProgressBar';
import AdminDashboard from './components/AdminDashboard';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import ToastContainer from './components/ToastContainer';
import AnalyticsTracker from './components/AnalyticsTracker';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from './LanguageContext';
import { useAppStore } from './store/appStore';

export default function App() {
  const { lang } = useLanguage();
  const { isFocusMode } = useAppStore();
  const [activeSection, setActiveSection] = useState('hero');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const seoTitle = lang === 'ar' 
    ? "م. إبراهيم المحرقي | مستشار تقني وهندسة نظم سيادية" 
    : "Eng. Ibrahim Al-Muharqi | Sovereign Systems & Technical Consultant";

  const seoDesc = lang === 'ar'
    ? "استشارات تقنية وهندسية رفيعة المستوى، مراجعة برمجيات وأكواد، فحوصات الجودة والأمان السيبراني السيادي، وتطوير البنية التحتية السحابية والأنظمة المعقدة."
    : "High-end technical & engineering consulting, software code reviews, sovereign cyber-security & quality audits, cloud infrastructure & complex systems design.";

  const ogImageUrl = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop";

  // Dynamic sectional metadata for precise and professional OpenGraph preview previews
  const getSectionMetadata = () => {
    switch (activeSection) {
      case 'portfolio':
        return {
          title: lang === 'ar' 
            ? "معرض الأعمال الرقمي السيادي | م. إبراهيم المحرقي" 
            : "Sovereign Digital Gallery | Portfolio | Eng. Ibrahim Al-Muharqi",
          desc: lang === 'ar'
            ? "استعرض مشاريعنا وأنظمتنا البرمجية المستقلة المكتوبة بأعلى معايير الجودة والأمان السيادي والسرعة بدون قفل خارجي."
            : "Explore our autonomous software systems engineered with top-tier security standards, complete database control, and high performance.",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop"
        };
      case 'services':
        return {
          title: lang === 'ar'
            ? "الخدمات الاستشارية وهندسة النظم | م. إبراهيم المحرقي"
            : "Sovereign Architecture & Consulting Services | Eng. Ibrahim Al-Muharqi",
          desc: lang === 'ar'
            ? "استشارات معمارية النظم المستقلة، مراجعة وتدقيق الأكواد، قياس كفاءة وأمان قواعد البيانات وحماية السيرفرات."
            : "Enterprise architecture planning, security auditing, database speed tuning, and secure bespoke cloud infrastructure.",
          image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop"
        };
      case 'testimonials':
        return {
          title: lang === 'ar'
            ? "ثقة الشركاء والعملاء | م. إبراهيم المحرقي"
            : "Institutional Trust & Testimonials | Eng. Ibrahim Al-Muharqi",
          desc: lang === 'ar'
            ? "آراء عملائنا وشركائنا من المؤسسات والشركات حول دقة التنفيذ وموثوقية معمارية النظم السيادية المستقلة."
            : "See what our institutional partners and enterprise clients say about the precision, independence, and speed of our solutions.",
          image: "https://images.unsplash.com/photo-1521791136364-7286d35243dd?q=80&w=1200&auto=format&fit=crop"
        };
      case 'payments':
      case 'contact':
        return {
          title: lang === 'ar'
            ? "طلب فحص برمجيات واستشارة | تواصل مع م. إبراهيم المحرقي"
            : "Request Sovereign System Audit | Contact Eng. Ibrahim Al-Muharqi",
          desc: lang === 'ar'
            ? "احجز استشارتك التقنية أو اطلب فحصاً برمجياً شاملاً لأكوادك وقواعد بياناتك لضمان الأمن والسرعة ونسب الأداء العالية."
            : "Book your technical consultation or request a comprehensive code & security audit to protect your digital assets today.",
          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
        };
      default:
        return {
          title: seoTitle,
          desc: seoDesc,
          image: ogImageUrl
        };
    }
  };

  const currentMeta = getSectionMetadata();

  useEffect(() => {
    const handleOpenAdmin = () => {
      setIsAdminOpen(true);
    };
    window.addEventListener('open_admin_dashboard', handleOpenAdmin);
    return () => window.removeEventListener('open_admin_dashboard', handleOpenAdmin);
  }, []);

  useEffect(() => {
    const sections = ['hero', 'portfolio', 'services', 'testimonials', 'payments', 'contact'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px', // Triggers when section is roughly centered in viewport
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const handleNavigate = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-200 antialiased selection:bg-cyan-500/20 selection:text-cyan-300">
      
      <Helmet>
        <title>{currentMeta.title}</title>
        <meta name="description" content={currentMeta.desc} />
        
        {/* OpenGraph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={currentMeta.title} />
        <meta property="og:description" content={currentMeta.desc} />
        <meta property="og:image" content={currentMeta.image} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={currentMeta.title} />
        <meta name="twitter:description" content={currentMeta.desc} />
        <meta name="twitter:image" content={currentMeta.image} />
      </Helmet>
      {/* Reading indicator scroll progress bar */}
      <ScrollProgressBar />

      {/* High-end fixed header */}
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Sections */}
      <main className="relative">
        
        {/* Landing/Hero Section */}
        <Hero onNavigate={handleNavigate} />

        {/* Smart Portfolio Section */}
        <Portfolio />

        {/* Interactive Terminal Simulator Section */}
        <TerminalSimulator />

        {/* Services & Audit Section */}
        <Services />

        {/* Performance Improvement Telemetry Charts (Recharts) */}
        <PerformanceMetrics />

        {/* Project Delivery Roadmap Section */}
        <ProjectRoadmap />

        {/* Testimonials Review Carousel */}
        <Testimonials />

        {/* Payments, Wallet Details, and Contact Inquiry Form */}
        <PaymentsAndContact />

      </main>

      {/* Professional footer credits */}
      <Footer />

      {/* Admin Dashboard Control Panel */}
      <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

      {/* Global smart keyboard shortcut navigation listener */}
      <KeyboardShortcuts onToggleAdmin={() => setIsAdminOpen(prev => !prev)} />

      {/* Floating Gemini AI conversational virtual assistant */}
      {!isFocusMode && <GeminiChatBot />}

      {/* Floating Web Share API button */}
      {!isFocusMode && <ShareFloatingButton />}

      {/* Lightweight privacy-focused analytics background tracker */}
      <AnalyticsTracker />

      {/* Global Toast Notification Container */}
      <ToastContainer />
    </div>
  );
}
