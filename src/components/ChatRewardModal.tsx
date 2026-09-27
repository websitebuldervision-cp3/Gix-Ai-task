import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, CheckCircle2, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatUSD, formatTZS } from '../data/translations';

export const ChatRewardModal: React.FC = () => {
  const { chatRewardModalData, closeChatRewardModal, openActivationLink, setActiveTab, language } = useApp();

  if (!chatRewardModalData) return null;

  const { amountUSD, partnerName, totalPendingUSD } = chatRewardModalData;

  const handleOpenAccount = () => {
    openActivationLink();
    closeChatRewardModal();
  };

  const handleViewEarnings = () => {
    closeChatRewardModal();
    setActiveTab('earnings');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-emerald-500/40 bg-slate-900 p-5 sm:p-6 shadow-2xl shadow-emerald-500/10 text-center">
        {/* Glow backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

        {/* Success Icon */}
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-inner">
          <Sparkles className="h-7 w-7 animate-bounce" />
        </div>

        {/* Title */}
        <h3 className="font-display text-lg sm:text-xl font-extrabold text-white">
          {language === 'sw'
            ? '🎉 Hongera! Umetimiza Dakika 1 ya Chat'
            : '🎉 Congratulations! 1 Minute Chat Completed'}
        </h3>

        <p className="mt-1 text-xs text-slate-300">
          {language === 'sw'
            ? `Umeshakamilisha dakika 1 ya mazungumzo na kumfundisha ${partnerName} Kiswahili.`
            : `You completed 1 minute of language exchange teaching Kiswahili to ${partnerName}.`}
        </p>

        {/* Payout Banner */}
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-center">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
            {language === 'sw' ? 'Malipo Yaliyothibitishwa' : 'Verified Payout Credited'}
          </div>
          <div className="mt-1 flex items-baseline justify-center gap-1.5 font-display text-2xl font-black text-white">
            <span className="text-emerald-400">{formatTZS(amountUSD)}</span>
            <span className="text-xs text-slate-400 font-semibold">({formatUSD(amountUSD)})</span>
          </div>
          <div className="mt-1 flex items-center justify-center gap-1 text-[11px] text-emerald-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>
              {language === 'sw'
                ? `Yameingizwa kwenye Pending Balance ($${totalPendingUSD.toFixed(2)})`
                : `Added to Pending Balance ($${totalPendingUSD.toFixed(2)})`}
            </span>
          </div>
        </div>

        {/* The Exact Activation Box Required by User */}
        <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-950/30 p-3.5 text-left">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
            <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400" />
            <span>
              {language === 'sw'
                ? 'Uthibitisho wa Kufungua Akaunti (Activation)'
                : 'Account Verification Requirement'}
            </span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-amber-200/90">
            {language === 'sw'
              ? 'Malipo yako ya chat yameingizwa kwenye PENDING BALANCE. Ili kuhamisha fedha hizi kwenye AVAILABLE BALANCE na kutoa kwa M-Pesa, Tigo Pesa au Airtel Money, unapaswa kufungua akaunti yako sasa.'
              : 'Your chat earnings are placed in PENDING BALANCE. To transfer funds to AVAILABLE BALANCE and withdraw via M-Pesa, Tigo Pesa, or Bank, please activate your account now.'}
          </p>

          {/* Prominent CTA Button */}
          <button
            onClick={handleOpenAccount}
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 px-4 text-xs font-black uppercase tracking-wide text-slate-950 shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-98 transition"
          >
            <span>
              {language === 'sw' ? '👉 GUSA HAPA KUFUNGUA ACCOUNT' : '👉 TAP HERE TO OPEN ACCOUNT'}
            </span>
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>

        {/* Secondary Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={closeChatRewardModal}
            className="w-full rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
          >
            {language === 'sw' ? 'Endelea Kuchat' : 'Continue Chatting'}
          </button>
          <button
            onClick={handleViewEarnings}
            className="w-full flex items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-900 py-2.5 text-xs font-semibold text-slate-200 hover:border-slate-600 transition"
          >
            <span>{language === 'sw' ? 'Angalia Mapato' : 'View Earnings'}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
