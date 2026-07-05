import { create } from 'zustand';

export interface Message {
  id: string;
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  technicalAudit: boolean; // support technical audit report request
  date: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppState {
  locale: 'ar' | 'en';
  toggleLocale: () => void;
  setLocale: (locale: 'ar' | 'en') => void;
  filter: string;
  setFilter: (filter: string) => void;
  messages: Message[];
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  setFocusMode: (mode: boolean) => void;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => {
  // Get initial language
  const savedLang = localStorage.getItem('consultant_portfolio_lang');
  const initialLocale = (savedLang === 'en' || savedLang === 'ar') ? savedLang : 'ar';

  // Get initial sent messages
  const savedMessages = localStorage.getItem('consultant_sent_messages');
  const initialMessages = savedMessages ? JSON.parse(savedMessages) : [];

  // Get initial Focus Mode
  const savedFocusMode = localStorage.getItem('consultant_focus_mode');
  const initialFocusMode = savedFocusMode === 'true';

  return {
    locale: initialLocale as 'ar' | 'en',
    toggleLocale: () => set((state) => {
      const nextLocale = state.locale === 'ar' ? 'en' : 'ar';
      localStorage.setItem('consultant_portfolio_lang', nextLocale);
      document.documentElement.lang = nextLocale;
      document.documentElement.dir = nextLocale === 'ar' ? 'rtl' : 'ltr';
      return { locale: nextLocale };
    }),
    setLocale: (locale) => set(() => {
      localStorage.setItem('consultant_portfolio_lang', locale);
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
      return { locale };
    }),
    filter: '',
    setFilter: (filter) => set({ filter }),
    messages: initialMessages,
    addMessage: (msg) => set((state) => {
      const nextMessages = [msg, ...state.messages];
      localStorage.setItem('consultant_sent_messages', JSON.stringify(nextMessages));
      // Dispatch storage_update event for any vanilla components listening
      window.dispatchEvent(new Event('storage_update'));
      return { messages: nextMessages };
    }),
    setMessages: (messages) => set(() => {
      localStorage.setItem('consultant_sent_messages', JSON.stringify(messages));
      window.dispatchEvent(new Event('storage_update'));
      return { messages };
    }),
    isFocusMode: initialFocusMode,
    toggleFocusMode: () => set((state) => {
      const nextMode = !state.isFocusMode;
      localStorage.setItem('consultant_focus_mode', String(nextMode));
      return { isFocusMode: nextMode };
    }),
    setFocusMode: (mode) => set(() => {
      localStorage.setItem('consultant_focus_mode', String(mode));
      return { isFocusMode: mode };
    }),
    toasts: [],
    addToast: (message, type = 'success') => set((state) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = { id, message, type };
      
      // Auto-remove after 4 seconds
      setTimeout(() => {
        useAppStore.getState().removeToast(id);
      }, 4000);

      return { toasts: [...state.toasts, newToast] };
    }),
    removeToast: (id) => set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    })),
  };
});
