import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { TranslatedProject } from '../translations';

interface ProjectCardProps {
  project: TranslatedProject;
  onSelect: (project: TranslatedProject) => void;
  dir: 'rtl' | 'ltr';
  lang: 'ar' | 'en';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect, dir, lang }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Normalized motion values for rotation calculations (0.5 represents center)
  const xNormalized = useMotionValue(0.5);
  const yNormalized = useMotionValue(0.5);

  // Absolute motion values for the cursor spotlight effect
  const mouseXPx = useMotionValue(0);
  const mouseYPx = useMotionValue(0);

  // Smooth out coordinates with premium spring settings
  const xSpring = useSpring(xNormalized, { damping: 25, stiffness: 180 });
  const ySpring = useSpring(yNormalized, { damping: 25, stiffness: 180 });

  // Map normalized coordinates to subtle, elegant 3D tilt rotations (-5 to +5 degrees)
  const rotateX = useTransform(ySpring, [0, 1], [5, -5]);
  const rotateY = useTransform(xSpring, [0, 1], [-5, 5]);

  // Dynamic radial gradient spotlight highlight following the cursor
  const spotlightBackground = useMotionTemplate`radial-gradient(350px circle at ${mouseXPx}px ${mouseYPx}px, rgba(6, 182, 212, 0.08), transparent 80%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate normalized relative position [0, 1]
    const relativeX = (e.clientX - rect.left) / width;
    const relativeY = (e.clientY - rect.top) / height;

    xNormalized.set(relativeX);
    yNormalized.set(relativeY);

    // Calculate absolute position in pixels
    mouseXPx.set(e.clientX - rect.left);
    mouseYPx.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    // Smoothly spring back to the default flat state
    xNormalized.set(0.5);
    yNormalized.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      id={`project-card-${project.id}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(project)}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className="perspective-1000 bg-slate-900/10 border border-slate-800 rounded-none overflow-hidden group hover:border-cyan-500 transition-colors duration-300 shadow-xl cursor-pointer flex flex-col h-full relative"
    >
      {/* Interactive Cursor Spotlight Highlight Overlay */}
      <motion.div
        style={{ background: spotlightBackground }}
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
      />

      {/* Project Image Banner */}
      <div 
        style={{ transform: 'translateZ(10px)' }}
        className="relative aspect-video w-full overflow-hidden bg-slate-950 select-none"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10 opacity-70" />
        <img
          src={project.image}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category Badge on Image */}
        <span className={`absolute top-4 ${dir === 'rtl' ? 'right-4' : 'left-4'} bg-slate-950 border border-slate-800 text-cyan-400 text-[10px] font-mono font-bold px-2 py-1 rounded-none z-20`}>
          {project.category}
        </span>
      </div>

      {/* Project Brief Info */}
      <div 
        style={{ transform: 'translateZ(20px)' }}
        className="p-6 flex-1 flex flex-col justify-between space-y-4 z-20"
      >
        <div className={`space-y-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors duration-200">
            {project.title}
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack Badges */}
        <div className={`flex flex-wrap gap-1.5 pt-2 ${dir === 'rtl' ? 'justify-start' : 'justify-start'}`}>
          {project.techStack.slice(0, 3).map((tech) => (
            <span key={tech} className="text-[10px] font-mono bg-slate-900 text-slate-300 px-2.5 py-1 rounded-none border border-slate-850">
              {tech}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/5 border border-cyan-500/10 px-2 py-0.5 rounded-none">
              +{project.techStack.length - 3} {lang === 'ar' ? 'أخرى' : 'more'}
            </span>
          )}
        </div>

        {/* View Details Button */}
        <div className="pt-4 border-t border-slate-800/80">
          <button
            id={`view-details-btn-${project.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(project);
            }}
            className="w-full py-2 bg-slate-950 hover:bg-cyan-500 hover:text-slate-950 border border-slate-800 hover:border-cyan-500 text-cyan-400 text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-mono"
          >
            <span>{lang === 'ar' ? 'عرض التفاصيل' : 'VIEW DETAILS'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
