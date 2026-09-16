import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, X } from 'lucide-react';
import { LIVE_PAYOUTS_LIST, PayoutNotification } from '../data/livePayouts';
import { playPayoutChime } from '../utils/audioChime';
import { useApp } from '../context/AppContext';

export const LivePayoutToast: React.FC = () => {
  const { language } = useApp();
  const isSw = language === 'sw';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Initial delay before first toast (5 seconds after load)
    const initialTimer = setTimeout(() => {
      triggerToast();
    }, 5000);

    // Schedule next toast with interval between 1 minute (60s) and 1.5 minutes (90s)
    let nextTimeout: number;

    const scheduleNext = () => {
      // Random interval between 65,000ms (1.08 min) and 85,000ms (1.41 min)
      const randomInterval = Math.floor(Math.random() * (85000 - 65000 + 1)) + 65000;
      nextTimeout = window.setTimeout(() => {
        triggerToast();
        scheduleNext();
      }, randomInterval);
    };

    scheduleNext();

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(nextTimeout);
    };
  }, [soundEnabled]);

  const triggerToast = () => {
    setCurrentIndex((prev) => (prev + 1) % LIVE_PAYOUTS_LIST.length);
    setIsVisible(true);

    if (soundEnabled) {
      playPayoutChime();
    }

    // Keep visible for 8 seconds then disappear smoothly
    setTimeout(() => {
      setIsVisible(false);
    }, 8000);
  };

  const current: PayoutNotification = LIVE_PAYOUTS_LIST[currentIndex] || LIVE_PAYOUTS_LIST[0];

  if (dismissed || !isVisible) return null;

  // Provider badge colors
  const getProviderBadgeStyle = (provider: string) => {
    switch (provider) {
      case 'M-Pesa':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Tigo Pesa':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'Airtel Money':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HaloPesa':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <aside
      aria-label="Live Payout Notification"
      className="fixed top-14 right-2 sm:right-5 z-50 max-w-[320px] sm:max-w-xs w-[calc(100vw-20px)] transition-all duration-500 ease-in-out pointer-events-auto animate-in fade-in slide-in-from-top-4"
    >
      {/* Compact Surrounded Glowing Wrapper */}
      <div className="relative group">
        {/* Sleek subtle surrounded glow */}
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-indigo-500/30 blur-sm opacity-80 pointer-events-none" />

        <div className="relative overflow-hidden rounded-xl border border-emerald-400/40 bg-slate-950/95 p-2.5 sm:p-3 shadow-[0_8px_25px_-4px_rgba(16,185,129,0.35)] backdrop-blur-xl text-slate-100">
          <div className="flex items-start gap-2.5 relative z-10">
            {/* Compact Tanzanian Avatar */}
            <div className="relative shrink-0 mt-0.5">
              <img
                src={current.avatar}
                alt={current.name}
                referrerPolicy="no-referrer"
                className="h-9 w-9 rounded-full object-cover ring-1.5 ring-emerald-400 shadow-sm"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] text-slate-950 font-black ring-1 ring-slate-900">
                ✓
              </span>
            </div>

            {/* Notification Body */}
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-display font-bold text-white text-xs tracking-tight truncate">
                  {current.name}
                </span>
                <span className="text-[11px]">{current.flag}</span>
                <span
                  className={`rounded px-1.5 py-0.2 text-[9px] font-bold border ${getProviderBadgeStyle(
                    current.provider
                  )}`}
                >
                  {current.provider}
                </span>
              </div>

              <p className="mt-1 text-[11px] sm:text-xs text-slate-200 leading-tight">
                {isSw ? (
                  <>
                    Ametoa{' '}
                    <span className="font-extrabold text-emerald-300 font-display">
                      TSh {current.amountTZS.toLocaleString()}
                    </span>{' '}
                    kwa task za AI
                  </>
                ) : (
                  <>
                    Withdrew{' '}
                    <span className="font-extrabold text-emerald-300 font-display">
                      TSh {current.amountTZS.toLocaleString()}
                    </span>{' '}
                    (${current.amountUSD})
                  </>
                )}
              </p>

              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                <span className="truncate max-w-[140px] text-slate-300">
                  📍 {current.location}
                </span>
                <span className="text-emerald-400 font-semibold shrink-0">
                  {current.timeAgo}
                </span>
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
              className="rounded p-1 text-slate-400 hover:text-slate-200 transition"
            >
              {soundEnabled ? (
                <Volume2 className="h-3 w-3 text-emerald-400" />
              ) : (
                <VolumeX className="h-3 w-3 text-slate-500" />
              )}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="rounded p-1 text-slate-400 hover:text-slate-200 transition"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
