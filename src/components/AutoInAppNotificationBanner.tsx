import React, { useState, useEffect } from 'react';
import { Bell, Sparkles, X, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playChimeSound, pushService } from '../services/pushNotificationService';
import { ACTIVATION_URL } from '../data/translations';

interface AutoPushMessage {
  title: string;
  body: string;
  badge: string;
}

const ROTATING_NOTIFICATIONS: AutoPushMessage[] = [
  {
    title: '🤖 GIX CHATS',
    body: 'Karibu GIX CHATS! Fungua account yako kwa 15,000 TSh na uanze kufanya AI Jobs kwa Kiswahili. 💰',
    badge: 'Karibu',
  },
  {
    title: '🌅 GIX CHATS - Nafasi za Kazi',
    body: 'Usikose AI Jobs za leo. Fungua account yako kwa 15,000 TSh na uanze kutathmini kazi sasa. 🚀',
    badge: 'AI Jobs',
  },
  {
    title: '☀️ GIX CHATS - Mchana',
    body: 'Uko tayari kuanza? Fungua account yako kwa 15,000 TSh na fuata hatua za kuanza. 📱',
    badge: 'Account',
  },
  {
    title: '🌙 GIX CHATS - Ukumbusho',
    body: 'Fungua account yako ya GIX CHATS kwa 15,000 TSh leo uanze kupokea kazi mpya za kidijitali! 🇹🇿',
    badge: 'Taarifa',
  },
];

export const AutoInAppNotificationBanner: React.FC = () => {
  const { setActiveTab, language } = useApp();
  const [currentNotification, setCurrentNotification] = useState<AutoPushMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Initialize automatic native permission attempt in the background
  useEffect(() => {
    pushService.initAutoPermission(language);
  }, [language]);

  // Display automatic in-app notifications with sound without needing browser permissions
  useEffect(() => {
    let msgIndex = 0;

    const triggerNotification = (index: number) => {
      const msg = ROTATING_NOTIFICATIONS[index % ROTATING_NOTIFICATIONS.length];
      setCurrentNotification(msg);
      setIsVisible(true);

      // Play audio chime and haptics automatically
      playChimeSound();
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate([150, 80, 150]);
        } catch {
          // ignore
        }
      }

      // Auto dismiss after 8 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 8000);
    };

    // 1st automatic notification after 3.5 seconds of browsing
    const initialTimer = setTimeout(() => {
      triggerNotification(msgIndex++);
    }, 3500);

    // Subsequent periodic automatic notifications every 75 seconds
    const intervalTimer = setInterval(() => {
      triggerNotification(msgIndex++);
    }, 75000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  if (!isVisible || !currentNotification) return null;

  const handleClick = () => {
    setIsVisible(false);
    setActiveTab('account');
    // Also smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-3 left-3 right-3 sm:left-auto sm:right-6 sm:top-5 z-50 sm:max-w-md w-auto animate-in slide-in-from-top-4 duration-300 pointer-events-auto"
    >
      <div className="overflow-hidden rounded-2xl border border-emerald-500/40 bg-slate-900/95 p-3.5 sm:p-4 text-white shadow-2xl shadow-emerald-950/60 backdrop-blur-xl ring-2 ring-emerald-500/20">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 shadow-md">
              <Bell className="h-4 w-4 fill-current animate-pulse" />
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-slate-900 animate-ping" />
            </div>
            <span className="text-xs font-bold font-display text-white tracking-wide">
              {currentNotification.title}
            </span>
            <span className="rounded-full bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.2 text-[10px] font-semibold text-emerald-300">
              {currentNotification.badge}
            </span>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            aria-label="Funga"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Notification Body */}
        <p className="text-xs text-slate-200 leading-relaxed pl-9 pr-1">
          {currentNotification.body}
        </p>

        {/* Action Button */}
        <div className="mt-2.5 flex items-center justify-end gap-2 pl-9">
          <button
            onClick={handleClick}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-md hover:brightness-110 active:scale-95 transition"
          >
            <span>Fungua Account (15,000 TSh)</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
