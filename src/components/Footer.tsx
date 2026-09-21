import React from 'react';
import { Bot, MessageCircle, ShieldCheck, Heart, ExternalLink, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ACTIVATION_URL } from '../data/translations';

export const Footer: React.FC = () => {
  const {
    language,
    setLanguage,
    detectedCountry,
    detectedCountryMeta,
    t,
    setActiveTab,
    openWhatsAppSupport,
    openPwaModal,
  } = useApp();
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
                GIX <span className="text-emerald-400">CHAT</span>
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

            {/* Quick Language Switcher & Geolocation Status */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                <Globe className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isSw ? 'Lugha:' : 'Language:'}</span>
              </span>
              <div className="inline-flex rounded-lg border border-slate-800 bg-slate-900/90 p-0.5">
                <button
                  id="btn-footer-lang-sw"
                  onClick={() => setLanguage('sw', true)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    language === 'sw'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>🇹🇿</span>
                  <span>Kiswahili</span>
                </button>
                <button
                  id="btn-footer-lang-en"
                  onClick={() => setLanguage('en', true)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    language === 'en'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>🇬🇧</span>
                  <span>English</span>
                </button>
              </div>
              {detectedCountry && (
                <span className="text-[10px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-800 flex items-center gap-1">
                  <span>{detectedCountryMeta.flag}</span>
                  <span>{detectedCountryMeta.nameEn} ({detectedCountryMeta.code})</span>
                </span>
              )}
            </div>
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
                  <span>WhatsApp: +255624542565</span>
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
          <p>© {new Date().getFullYear()} GIX CHAT. {isSw ? 'Haki zote zimehifadhiwa.' : 'All rights reserved.'}</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>{isSw ? 'Jukwaa Salama la Kazi za AI' : 'Certified AI Evaluation Architecture'}</span>
          </div>
        </div>

        {/* Powered By Cp3 salela FX 👑 */}
        <div className="mt-4 pt-3 border-t border-slate-900 flex justify-center items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 px-4 py-1.5 shadow-sm">
            <span className="text-xs font-semibold text-slate-300">Powered by</span>
            <span className="font-display text-xs sm:text-sm font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 drop-shadow">
              Cp3 salela FX
            </span>
            <span className="text-sm">👑</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
