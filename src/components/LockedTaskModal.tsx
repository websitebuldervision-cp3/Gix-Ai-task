import React from 'react';
import { Lock, CheckCircle2, X, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LockedTaskModal: React.FC = () => {
  const { lockedTaskNotice, closeLockedTaskNotice, language, setActiveTab } = useApp();

  if (!lockedTaskNotice) return null;

  const isSw = language === 'sw';

  const handleExploreOtherTasks = () => {
    closeLockedTaskNotice();
    setActiveTab('tasks');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-emerald-500/40 bg-slate-900 p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Glow Header */}
        <div className="absolute -top-12 left-1/2 h-28 w-56 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="btn-close-locked-modal"
          onClick={closeLockedTaskNotice}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon & Title */}
        <div className="relative text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/25">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-black text-emerald-300 mb-2">
            <Lock className="h-3 w-3" />
            <span>PAID • IMEFUNGWA LEO</span>
          </div>

          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            {isSw ? 'Umeshalipwa Kazi Hii Leo!' : 'Task Already Paid Today!'}
          </h2>

          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 text-left">
            <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
              {lockedTaskNotice}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-emerald-400 font-medium">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>
              {isSw
                ? 'Kazi mpya 55+ zipo wazi kukamilisha sasa hivi!'
                : '55+ other active tasks are open and waiting for you!'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-2">
          <button
            id="btn-locked-explore-other"
            onClick={handleExploreOtherTasks}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-xs sm:text-sm font-black text-white shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-95 uppercase tracking-wide"
          >
            <span>{isSw ? 'Chagua Kazi Nyingine' : 'Explore Other Tasks'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            id="btn-locked-dismiss"
            onClick={closeLockedTaskNotice}
            className="flex w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-800/80 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <span>{isSw ? 'Nimeelewa (Funga)' : 'I Understand (Close)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
