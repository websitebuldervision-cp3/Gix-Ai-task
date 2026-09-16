import React from 'react';
import { Bot, MessageCircle, ShieldCheck, Heart, ExternalLink, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ACTIVATION_URL } from '../data/translations';

export const Footer: React.FC = () => {
  const { language, t, setActiveTab, openWhatsAppSupport, openPwaModal } = useApp();
  const isSw = language === 'sw';

  return (
    <footer className="border-t border-slate-800/80 bg-[#080B11]/90 pt-10 pb-24 lg:pb-12 text-xs text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Bot className="h-4 w-4" />
              </div>
              <span className="font-display text-base font-bold text-white">
                GIX <span className="text-emerald-400">AI</span> TASKS
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium max-w-sm">
              {t.brand.tagline}
            </p>

            <p className="text-[11px] text-slate-400 leading-relaxed max-w-md">
              {isSw
                ? 'Jukwaa la kimataifa la microtasks za akili mnemba (AI). Fanya tathmini za picha, sauti, video, maandishi na modeli za AI ujipatie ujira papo hapo.'
                : 'A next-generation AI microtask platform enabling distributed human feedback for computer vision, natural language processing, and multimodal intelligence.'}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <p className="font-bold text-white text-xs uppercase tracking-wider">
              {isSw ? 'Quick Links' : 'Navigation'}
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.nav.tasks} (55+)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('rewards')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.nav.rewards}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.nav.leaderboard}
                </button>
              </li>
              <li>
                <button
                  onClick={openPwaModal}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.nav.downloadApp}
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Legal */}
          <div className="space-y-2.5">
            <p className="font-bold text-white text-xs uppercase tracking-wider">
              {isSw ? 'Msaada na Usajili' : 'Support & Activation'}
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={openWhatsAppSupport}
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>WhatsApp: 0723321315</span>
                </button>
              </li>
              <li>
                <a
                  href={ACTIVATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300"
                >
                  <span>{t.activation.activateBtn}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <span className="text-[11px] text-slate-400 block pt-1">
                  {t.activation.feeLabel} {t.activation.feeAmount}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-800/80 pt-6 text-[11px] text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} GIX AI TASKS. {isSw ? 'Haki zote zimehifadhiwa.' : 'All rights reserved.'}</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>{isSw ? 'Jukwaa Salama la Kazi za AI' : 'Certified AI Evaluation Architecture'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
