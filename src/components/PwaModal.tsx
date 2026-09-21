import React from 'react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  Share2,
  MoreVertical,
  Laptop,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PwaModal: React.FC = () => {
  const {
    language,
    t,
    isPwaModalOpen,
    closePwaModal,
    isPwaInstalled,
    canInstallPwa,
    installPwa,
  } = useApp();

  if (!isPwaModalOpen) return null;

  const isSw = language === 'sw';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          id="btn-close-pwa-modal"
          onClick={closePwaModal}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
              <Download className="h-7 w-7 text-emerald-400" />
            </div>
          </div>
          <h2 className="font-display text-xl font-bold text-white">
            {t.pwa.title}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {isSw
              ? 'Pata uzoefu wa haraka bila kufungua browser kila mara.'
              : 'Fast, lightweight microtasking directly from your home screen.'}
          </p>
        </div>

        {/* State 1: Already Installed */}
        {isPwaInstalled ? (
          <div className="mt-5 rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 text-center">
            <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-400" />
            <p className="text-sm font-bold text-emerald-300">
              {isSw
                ? 'GIX CHAT tayari imewekwa kwenye kifaa chako.'
                : 'GIX CHAT is already installed on your device.'}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {isSw
                ? 'Unaweza kuifungua moja kwa moja kutoka kwenye menyu ya simu yako.'
                : 'You can launch it anytime directly from your application launcher.'}
            </p>
          </div>
        ) : canInstallPwa ? (
          /* State 2: Native Install Prompt Available */
          <div className="mt-5 text-center">
            <button
              id="btn-trigger-pwa-install"
              onClick={installPwa}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:opacity-95"
            >
              <Download className="h-4 w-4" />
              {t.pwa.installBtn}
            </button>
          </div>
        ) : (
          /* State 3: Step-by-step Installation Instructions */
          <div className="mt-4 space-y-3">
            {/* Android Chrome */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Smartphone className="h-4 w-4" />
                <span>Android (Chrome / Brave / Samsung Internet)</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                {t.pwa.androidInstructions}
              </p>
            </div>

            {/* iOS Safari */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                <Share2 className="h-4 w-4" />
                <span>iPhone / iPad (Apple Safari)</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                {t.pwa.iosInstructions}
              </p>
            </div>

            {/* Desktop */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Laptop className="h-4 w-4" />
                <span>Desktop (Google Chrome / Edge)</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                {t.pwa.desktopInstructions}
              </p>
            </div>
          </div>
        )}

        <button
          id="btn-pwa-modal-done"
          onClick={closePwaModal}
          className="mt-5 w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white"
        >
          {t.pwa.close}
        </button>
      </div>
    </div>
  );
};
