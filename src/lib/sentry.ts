import * as Sentry from '@sentry/react';

// Read from import.meta.env
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || '';

export function initSentry() {
  if (SENTRY_DSN) {
    Sentry.init({
      dsn: SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0,
      
      // Session Replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      
      release: 'sovereign-consultant-portfolio@1.0.0',
      environment: import.meta.env.MODE || 'production',
    });
    console.log('Sentry performance & error monitoring telemetry initialized.');
  } else {
    console.log('Sentry monitoring in safe-sandbox (DSN not found). Falling back to console-logging sentinel.');
  }
}
