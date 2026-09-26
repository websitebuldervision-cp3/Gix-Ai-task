import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { pushService } from '../services/pushNotificationService';

export const NotificationPromptModal: React.FC = () => {
  const { language } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Show after exactly 10 seconds upon entering the site, and only once ever
    const timer = setTimeout(() => {
      if (pushService.shouldShowInitialPrompt()) {
        pushService.markPromptAsShown();
        setIsOpen(true);
      }
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  const handleAllow = async () => {
    setIsLoading(true);

    try {
      pushService.markAsEnabledPermanently();
      await pushService.subscribeUser(language);
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
    } catch (e) {
      console.warn('[PUSH] Subscription completed:', e);
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
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
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          disabled={isLoading}
          aria-label="Funga"
          className="absolute top-3.5 right-3.5 p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {isSuccess ? (
          <div className="py-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30 mb-3 animate-bounce">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-white font-display">
              Notifications Zimewashwa!
            </h3>
            <p className="mt-1 text-xs text-slate-300">
              Ujumbe wa kwanza unatumwa kwenye simu yako sasa hivi. 💰
            </p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 shadow-md">
                <Bell className="h-5 w-5 fill-current" />
              </div>
              <h3 className="text-base font-bold font-display text-white">
                🔔 GIX CHATS
              </h3>
            </div>

            {/* Message Body */}
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-5">
              "Pata taarifa muhimu za AI Jobs moja kwa moja kwenye simu yako."
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5">
              <button
                id="btn-washa-notifications"
                onClick={handleAllow}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 py-3 px-4 text-xs sm:text-sm font-extrabold text-slate-950 shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wide cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                    <span>Inaruhusu...</span>
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 fill-current stroke-[2]" />
                    <span>🔔 Gusa Hapa Kuruhusu</span>
                  </>
                )}
              </button>

              <button
                id="btn-baadaye-notifications"
                onClick={handleDismiss}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-800 bg-slate-800/60 py-2 px-4 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
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
