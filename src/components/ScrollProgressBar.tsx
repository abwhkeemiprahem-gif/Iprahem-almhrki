import React, { useState, useEffect } from 'react';

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount to handle initial state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-55 h-[3px] bg-slate-950 pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-indigo-500 transition-all duration-75 ease-out shadow-[0_0_8px_rgba(34,211,238,0.5)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
