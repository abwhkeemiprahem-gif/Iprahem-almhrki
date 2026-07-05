import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  isLoading?: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ isLoading = true, message, size = 'md' }: LoadingSpinnerProps) {
  if (!isLoading) return null;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div id="loading-spinner-wrapper" className="flex flex-col items-center justify-center p-8 space-y-3 font-mono text-xs text-center">
      <div className="relative">
        <Loader2 className={`animate-spin text-cyan-400 ${sizeClasses[size]}`} />
        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping pointer-events-none" />
      </div>
      {message && (
        <span className="text-slate-400 tracking-wider uppercase animate-pulse">
          {message}
        </span>
      )}
    </div>
  );
}
