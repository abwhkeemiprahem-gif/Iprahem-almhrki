import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  User, 
  HelpCircle,
  Loader2,
  Minimize2,
  ExternalLink
} from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export default function GeminiChatBot() {
  const { lang, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested starting questions
  const suggestedQuestions = lang === 'ar' ? [
    { label: 'ما هي الحلول السيادية؟', query: 'ما هي الاستشارات البرمجية والحلول التقنية السيادية؟' },
    { label: 'ما هو جدول تسليم المشاريع؟', query: 'أخبرني عن منهجية تسليم المشاريع ومراحل العمل الأربعة (Roadmap) بالتفصيل.' },
    { label: 'ما هي طرق الدفع المتاحة؟', query: 'ما هي طرق الدفع الآمنة المتاحة للتعاقد مع المهندس إبراهيم؟' },
    { label: 'طلب استشارة أو فحص فني', query: 'كيف يمكنني التقدم لطلب فحص تقني كامل أو مراجعة أمان لمشروعي؟' }
  ] : [
    { label: 'What are Sovereign Solutions?', query: 'What are sovereign technical consulting and sovereign software solutions?' },
    { label: 'How is the roadmap structured?', query: 'Tell me about the 4-phase project delivery roadmap and timelines.' },
    { label: 'What payment methods do you accept?', query: 'What secure payment channels are accepted by Eng. Ibrahim?' },
    { label: 'How to request a Technical Audit?', query: 'How can I submit my project for a complete sovereign code audit or cybersecurity check?' }
  ];

  // Load initial welcome messages
  useEffect(() => {
    const welcomeText = lang === 'ar' 
      ? 'أهلاً بك! أنا المساعد التقني الذكي للمهندس إبراهيم المحرقي. يسعدني إجابتك حياً حول الخدمات السيادية، منصات SaaS، منهجية ومراحل تسليم المشاريع، أو كيفية التعاقد وتحويل الأتعاب آلياً. كيف يمكنني مساعدتك اليوم؟'
      : 'Hello! I am the intelligent virtual assistant for Eng. Ibrahim Al-Muharqi. I am here to help you understand our sovereign software architecture offerings, custom SaaS, the 4-phase project roadmap, or secure payment channels. How can I assist you today?';
    
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: welcomeText,
        timestamp: new Date()
      }
    ]);
  }, [lang]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // Track user sending a message
    trackEvent('chatbot_interact', undefined, { 
      action: 'send_message', 
      textLength: textToSend.trim().length 
    });

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server returned an error');
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.text || (lang === 'ar' ? 'عذراً، لم أتمكن من معالجة الطلب حالياً.' : 'Sorry, I could not process that request at this moment.'),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat bot error:', err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        text: lang === 'ar'
          ? '⚠️ عذراً، نواجه عطلاً طفيفاً في الاتصال بمركز الذكاء الاصطناعي السحابي. يرجى التأكد من ملء نموذج الاتصال الرسمي أسفل الصفحة للحصول على إجابة بريدية مباشرة من المهندس إبراهيم.'
          : '⚠️ Apologies, we are experiencing a slight latency connecting to our secure AI core. Please feel free to fill out the contact inquiry form below to get direct email feedback from Eng. Ibrahim.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    setHasNewMessage(false);
    trackEvent('chatbot_interact', undefined, { 
      action: nextState ? 'open' : 'close' 
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono text-slate-200 print:hidden">
      
      {/* 1. Floating Action Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="relative w-14 h-14 bg-slate-900 border-2 border-cyan-500 text-cyan-400 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 group shadow-[0_0_20px_rgba(6,182,212,0.15)]"
          title={lang === 'ar' ? 'استشارة ذكية فورية' : 'Instant AI Consultation'}
        >
          {/* Unread dot indicator */}
          {hasNewMessage && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 border-2 border-slate-950 animate-pulse" />
          )}

          <MessageSquare className="w-6 h-6 group-hover:rotate-6 transition-transform" />
          <span className="absolute -inset-1 border border-cyan-500/20 animate-ping pointer-events-none" />
        </button>
      )}

      {/* 2. Expanded Chat window */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[520px] bg-slate-950 border-2 border-slate-900 shadow-2xl flex flex-col justify-between relative transition-all duration-300">
          
          {/* Header */}
          <div className="p-4 bg-slate-900 border-b border-slate-900 flex items-center justify-between">
            <div className={`flex items-center gap-2.5 ${dir === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="p-1.5 bg-slate-950 border border-cyan-500/30 text-cyan-400">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
              </div>
              <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {lang === 'ar' ? 'المستشار الذكي لـ إبراهيم' : 'Ibrahim Sovereign AI'}
                </h4>
                <span className="text-[9px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
                  {lang === 'ar' ? 'آمن وسحابي ومتصل' : 'SECURE_LIVE // SYSTEM'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={toggleChat}
                className="p-1 text-slate-500 hover:text-white hover:bg-slate-950 border border-transparent hover:border-slate-800 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40 font-sans">
            
            {/* Messages list */}
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div 
                  key={msg.id} 
                  className={`flex items-start gap-2.5 max-w-[85%] ${
                    isAssistant 
                      ? dir === 'rtl' ? 'mr-0 ml-auto flex-row' : 'mr-auto ml-0 flex-row'
                      : dir === 'rtl' ? 'mr-auto ml-0 flex-row-reverse' : 'mr-0 ml-auto flex-row-reverse'
                  }`}
                >
                  {/* Avatar icon */}
                  <div className={`w-7 h-7 shrink-0 flex items-center justify-center border font-mono text-[9px] ${
                    isAssistant 
                      ? 'bg-slate-900 border-cyan-500/30 text-cyan-400' 
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}>
                    {isAssistant ? <Sparkles className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>

                  {/* Bubble content */}
                  <div className={`p-3 text-xs leading-relaxed ${
                    isAssistant
                      ? 'bg-slate-900/40 border border-slate-900 text-slate-200'
                      : 'bg-cyan-500/10 border border-cyan-500/20 text-white'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className="text-[8px] text-slate-600 block mt-1 text-right font-mono">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Loader */}
            {isLoading && (
              <div className={`flex items-center gap-2.5 max-w-[85%] ${dir === 'rtl' ? 'mr-0 ml-auto' : 'mr-auto ml-0'}`}>
                <div className="w-7 h-7 shrink-0 flex items-center justify-center border bg-slate-900 border-cyan-500/30 text-cyan-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 bg-slate-900/20 border border-slate-900 text-xs text-slate-500">
                  {lang === 'ar' ? 'جاري تحليل وقراءة الاستفسار...' : 'AI core is compiling response...'}
                </div>
              </div>
            )}

            {/* Suggested starting chips */}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-2 pt-2">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">
                  {lang === 'ar' ? 'استفسارات مقترحة للتجربة //' : 'SUGGESTED TOPICS //'}
                </span>
                <div className="flex flex-col gap-1.5">
                  {suggestedQuestions.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip.query)}
                      className={`text-left text-[10px] sm:text-xs font-mono p-2 bg-slate-900/30 border border-slate-900 hover:border-cyan-500/40 hover:bg-slate-900/60 text-slate-300 hover:text-white transition-all cursor-pointer ${
                        dir === 'rtl' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Form Footer */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
            className="p-3 bg-slate-900 border-t border-slate-900 flex gap-2 items-center"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={lang === 'ar' ? 'اسأل المساعد التقني الذكي...' : 'Ask sovereign AI consultant...'}
              className="flex-1 bg-slate-950 border border-slate-800 p-2 text-xs focus:outline-none focus:border-cyan-500 text-white font-sans"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2 bg-slate-950 border border-slate-800 hover:border-cyan-400 text-slate-500 hover:text-cyan-400 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <Send className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
