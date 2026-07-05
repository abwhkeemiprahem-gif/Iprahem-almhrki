import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App.tsx';
import { LanguageProvider } from './LanguageContext.tsx';
import { HelmetProvider } from 'react-helmet-async';
import { initSentry } from './lib/sentry.ts';
import './index.css';

// Initialize Sentry Monitoring
initSentry();

// Register PWA Service Worker (only in production)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({ immediate: true });
  }).catch((err) => {
    console.warn('PWA service worker registration bypassed or failed:', err);
  });
}

// Polished developer console/terminal-inspired Error boundary fallback
const SentryFallback = ({ error }: { error: Error }) => (
  <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
    <div className="border border-red-500/30 bg-red-500/10 p-8 max-w-md font-mono">
      <h2 className="text-red-400 font-bold text-lg mb-4">SYSTEM EXCEPTION</h2>
      <p className="text-xs text-slate-400 mb-6 leading-relaxed">
        An unexpected application crash has been caught by the secure Sentry telemetry layer.
      </p>
      <div className="bg-slate-950 border border-slate-900 p-4 mb-6 max-h-40 overflow-y-auto">
        <p className="text-xs text-red-300 text-left whitespace-pre-wrap">{error?.stack || error?.message}</p>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="w-full bg-white text-slate-950 font-bold hover:bg-cyan-400 py-3 transition-colors text-sm"
      >
        RELOAD KERNEL
      </button>
    </div>
  </div>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={({ error }) => <SentryFallback error={error} />}>
      <LanguageProvider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </LanguageProvider>
    </Sentry.ErrorBoundary>
  </StrictMode>,
);
