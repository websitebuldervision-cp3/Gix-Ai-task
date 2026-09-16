import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert, X, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUSD, formatTZS, ACTIVATION_URL } from '../data/translations';

export const SuccessModal: React.FC = () => {
  const { language, successModalData, closeSuccessModal, startTask } = useApp();

  if (!successModalData) return null;

  const isSw = language === 'sw';
  const taskName = isSw ? successModalData.taskTitle.sw : successModalData.taskTitle.en;
  const isIncorrect = !!successModalData.isIncorrect;

  const handleActivateClick = () => {
    window.open(ACTIVATION_URL, '_blank', 'noopener,noreferrer');
  };

  const handleContinue = () => {
    closeSuccessModal();
    startTask();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Glow Header */}
        <div
          className={`absolute -top-12 left-1/2 h-28 w-56 -translate-x-1/2 rounded-full blur-2xl ${
            isIncorrect ? 'bg-amber-500/20' : 'bg-emerald-500/20'
          }`}
        />

        {/* Close Button */}
        <button
          id="btn-close-success-modal"
          onClick={closeSuccessModal}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Content */}
        <div className="relative text-center">
          <div
            className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl p-0.5 shadow-lg ${
              isIncorrect
                ? 'bg-gradient-to-tr from-amber-500 to-rose-500 shadow-amber-500/25'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-500/25'
            }`}
          >
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
              {isIncorrect ? (
                <AlertTriangle className="h-8 w-8 text-amber-400 animate-bounce" />
              ) : (
                <CheckCircle2 className="h-8 w-8 text-emerald-400 animate-bounce" />
              )}
            </div>
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            {isIncorrect
              ? isSw
                ? '⚠️ Umekosea Swali!'
                : '⚠️ Incorrect Answer!'
              : isSw
              ? '🎉 Hongera! Umejibu Sahihi!'
              : '🎉 Well Done! Correct Answer!'}
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            {isSw ? 'Kazi ya AI:' : 'AI Task:'}
          </p>

          <p className="mt-0.5 text-sm font-bold text-emerald-300">{taskName}</p>
        </div>

        {/* Feedback Banner if Incorrect */}
        {isIncorrect && (
          <div className="mt-3 rounded-xl border border-amber-500/40 bg-amber-950/30 p-3 text-left">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <div>
                <p className="text-xs font-bold text-amber-300">
                  {isSw
                    ? 'Umekosea swali hili! Umelipwa 15% tu ya malipo.'
                    : 'Incorrect benchmark answer! You have been paid 15% partial reward.'}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-300">
                  {successModalData.feedbackMessage
                    ? isSw
                      ? successModalData.feedbackMessage.sw
                      : successModalData.feedbackMessage.en
                    : isSw
                    ? 'Chaguo lako halikulingana na viwango vya AI. Kazi inayofuata soma kwa makini kupata 100%!'
                    : 'Your selection did not match AI benchmark criteria. Review carefully on the next task for 100%!'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Reward Box */}
        <div
          className={`mt-3.5 rounded-xl border p-3.5 text-center ${
            isIncorrect
              ? 'border-amber-500/30 bg-amber-950/20'
              : 'border-emerald-500/30 bg-emerald-950/20'
          }`}
        >
          {isIncorrect && successModalData.originalRewardUSD && (
            <div className="mb-1.5 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <span>{isSw ? 'Malipo Kamili ya Kazi:' : 'Original Reward:'}</span>
              <span className="line-through text-slate-400">
                {formatUSD(successModalData.originalRewardUSD)} (
                {formatTZS(successModalData.originalRewardUSD)})
              </span>
            </div>
          )}

          <div className="flex items-center justify-center gap-2">
            <span
              className={`text-xs font-semibold ${
                isIncorrect ? 'text-amber-300' : 'text-emerald-300'
              }`}
            >
              {isIncorrect
                ? isSw
                  ? '💵 Malipo Uliyopewa (15%):'
                  : '💵 Awarded (15%):'
                : isSw
                ? '💰 Reward (100%):'
                : '💰 Full Reward:'}
            </span>
            <span
              className={`font-display text-xl font-extrabold ${
                isIncorrect ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {formatUSD(successModalData.rewardUSD)}
            </span>
          </div>

          <div className="mt-1 text-xs font-medium text-slate-300">
            <span>{isSw ? '🇹🇿 Thamani ya TZS: ' : '🇹🇿 TZS Equivalent: '}</span>
            <span className="font-bold text-white">
              {formatTZS(successModalData.rewardUSD)}
            </span>
          </div>

          <div
            className={`mt-2 border-t pt-2 text-[11px] text-slate-400 ${
              isIncorrect ? 'border-amber-500/20' : 'border-emerald-500/20'
            }`}
          >
            {isSw
              ? 'Kiasi kimeongezwa kwenye:'
              : 'Amount credited to:'}{' '}
            <span
              className={`font-semibold ${
                isIncorrect ? 'text-amber-300' : 'text-emerald-300'
              }`}
            >
              Pending Rewards
            </span>
          </div>
        </div>

        {/* Account Activation Requirement Card with glowing pink activation */}
        <div className="mt-3.5 rounded-xl border border-pink-500/40 bg-pink-950/20 p-3.5 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-pink-400" />
            <p className="text-xs leading-relaxed text-slate-300">
              {isSw
                ? 'Ili kufikia features zaidi za platform na kufanya Withdraw, unahitaji kufanya Account Activation.'
                : 'To access additional platform features and request eligible withdrawals, activate your account.'}
            </p>
          </div>

          <div className="mt-2.5 flex items-center justify-between border-t border-pink-500/20 pt-2">
            <span className="text-xs font-medium text-slate-400">
              {isSw ? 'Account Activation Fee:' : 'Account Activation Fee:'}
            </span>
            <span className="font-display text-sm font-extrabold text-amber-400">
              {isSw ? 'TSh 15,000' : 'TZS 15,000'}
            </span>
          </div>

          <div className="mt-3 relative group">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 blur opacity-75 group-hover:opacity-100 animate-pulse pointer-events-none" />
            <button
              id="btn-activate-account-popup"
              onClick={handleActivateClick}
              className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 px-4 py-2.5 text-xs font-black text-white border border-pink-300/80 shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wide"
            >
              <span>{isSw ? 'GUSA HAPA FUNGUA ACCOUNT' : 'TAP HERE TO ACTIVATE ACCOUNT'}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Continue Tasks */}
        <button
          id="btn-continue-next-task"
          onClick={handleContinue}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <span>{isSw ? 'Endelea na Kazi Nyingine' : 'Continue Completing Tasks'}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
