import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Clock, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { pushService } from '../services/pushNotificationService';

export const NotificationPromptModal: React.FC = () => {
  const { language } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Delay prompt slightly on first visit to let page load cleanly
    const timer = setTimeout(() => {
      if (pushService.shouldShowInitialPrompt()) {
        setIsOpen(true);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  const handleAllow = async () => {
    setIsLoading(true);
    try {
      const res = await pushService.subscribeUser(language);
      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
        }, 1500);
      } else {
        // Permission was denied or dismissed
        setIsOpen(false);
      }
    } catch (e) {
      console.error('Failed to subscribe:', e);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    pushService.dismissInitialPrompt();
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-900/95 p-6 shadow-2xl shadow-emerald-950/50 backdrop-blur-xl">
        {/* Top Glow Accent */}
        <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-cyan-500/20 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          disabled={isLoading}
          aria-label="Funga"
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-4 ring-emerald-500/30 mb-4 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-white font-display">
              Hongera! Notifications Zimewashwa
            </h3>
            <p className="mt-2 text-xs text-slate-300">
              Ujumbe wako wa kwanza unatumwa kwenye simu yako sasa hivi. 💰
            </p>
          </div>
        ) : (
          <div>
            {/* Header Icon */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/40">
                <Bell className="h-6 w-6 animate-pulse" />
                <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-amber-400 border-2 border-slate-900 animate-ping" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                  <Sparkles className="h-3 w-3" />
                  Taarifa za Papo kwa Papo
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white font-display mt-0.5">
                  🔔 WASHA NOTIFICATIONS ZA GIX CHATS
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              "Ruhusu notifications ili GIX CHATS ikukumbushe kuhusu AI Jobs, account yako na taarifa muhimu."
            </p>

            {/* Feature Bullets */}
            <div className="mt-3.5 space-y-2 text-[11px] sm:text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Ratiba ya kila siku (EAT):</strong> 08:00 Asubuhi, 13:00 Mchana, 19:00 Jioni.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>
                  <strong>Ada ya Usajili:</strong> Fungua account kwa 15,000 TSh uanze AI Jobs.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
              <button
                id="btn-allow-notifications"
                onClick={handleAllow}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:brightness-110 active:scale-95 transition-all"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Inawasha...</span>
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4" />
                    <span>🔔 Ruhusu Notifications</span>
                  </>
                )}
              </button>

              <button
                id="btn-dismiss-notifications"
                onClick={handleDismiss}
                disabled={isLoading}
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs sm:text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-center"
              >
                Baadaye
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
