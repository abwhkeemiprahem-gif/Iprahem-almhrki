import { db, handleFirestoreError, OperationType } from './firebase';
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';

// Generate a clean, anonymous session ID
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  let sid = sessionStorage.getItem('anon_analytics_sid');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('anon_analytics_sid', sid);
  }
  return sid;
}

export interface AnalyticsEvent {
  id: string;
  sessionId: string;
  eventType: string; // 'page_view' | 'click_cta' | 'chatbot_interact' | 'contact_form' | 'lang_switch'
  sectionId?: string; // 'hero', 'portfolio', 'services', 'roadmap', etc.
  details?: Record<string, any>;
  timestamp: any;
  userAgent?: string;
  language?: string;
}

export async function trackEvent(
  eventType: string, 
  sectionId?: string, 
  details?: Record<string, any>
): Promise<void> {
  if (typeof window === 'undefined') return;

  let eventId = '';
  try {
    eventId = 'evt_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    const sessionId = getOrCreateSessionId();

    const eventData = {
      id: eventId,
      sessionId,
      eventType,
      ...(sectionId ? { sectionId } : {}),
      details: details || {},
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent.substring(0, 150), // Privacy: Truncated user agent
      language: navigator.language || 'unknown'
    };

    // Store in Firestore securely
    const eventDocRef = doc(collection(db, 'analytics_events'), eventId);
    await setDoc(eventDocRef, eventData);
  } catch (err) {
    // Silent fail in production to maintain an uninterrupted user experience
    console.warn('Analytics silent tracking log failure:', err);
    try {
      handleFirestoreError(err, OperationType.CREATE, `analytics_events/${eventId}`);
    } catch (e) {
      // Keep it silent for normal users but processed for the framework diagnostics
    }
  }
}
