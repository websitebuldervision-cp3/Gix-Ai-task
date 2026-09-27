import React from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Globe,
  Bell,
  Sparkles,
  Wallet,
  ShieldCheck,
  User,
  ExternalLink,
} from 'lucide-react';
import { formatDualCurrency } from '../data/translations';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    activeTab,
    setActiveTab,
    user,
    openActivationLink,
    openNotificationSettings,
    t,
  } = useApp();

  const isActivated = user.accountStatus === 'activated';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#080B11]/90 backdrop-blur-md">
      {/* Top micro-announcement banner if not activated */}
      {!isActivated && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-3 py-1.5 text-center text-xs font-semibold text-white shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
            <span className="line-clamp-1">
              {language === 'sw'
                ? 'Malipo yako ya chat ya $0.50 kwa dakika yanaingia Pending. Fungua account yako kuyatoa!'
                : 'Your chat earnings ($0.50/min) are credited to Pending. Open account to withdraw!'}
            </span>
            <button
              onClick={openActivationLink}
              className="ml-1 inline-flex items-center gap-1 rounded bg-slate-950/40 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-slate-950/60 transition"
            >
              <span>{language === 'sw' ? 'Gusa Hapa' : 'Tap Here'}</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <MessageSquare className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-lg font-extrabold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  GIX CHATS
                </span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-400">
                  Global
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 hidden sm:block">
                {t.brand.taglineShort}
              </p>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-slate-800 rounded-full px-2 py-1">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${
              activeTab === 'home'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.nav.home}
          </button>
          <button
            onClick={() => setActiveTab('find')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${
              activeTab === 'find'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.nav.find}
          </button>
          <button
            onClick={() => setActiveTab('chats')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${
              activeTab === 'chats'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.nav.chats}
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${
              activeTab === 'earnings'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.nav.earnings}
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${
              activeTab === 'withdraw'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.nav.withdraw}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${
              activeTab === 'profile'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {t.nav.profile}
          </button>
        </nav>

        {/* Right Actions: Balances, Activation CTA & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Balances Pill (Desktop & Tablet) */}
          <button
            onClick={() => setActiveTab('earnings')}
            className="hidden sm:flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-2.5 py-1.5 text-left hover:border-slate-700 transition"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Wallet className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                <span>Pending</span>
              </div>
              <div className="text-xs font-bold text-white leading-none">
                ${user.balancePendingUSD.toFixed(2)}
              </div>
            </div>
          </button>

          {/* Prominent Gusa Hapa Kufungua Account Button */}
          {!isActivated ? (
            <button
              onClick={openActivationLink}
              className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="font-extrabold tracking-tight">
                {language === 'sw' ? 'Fungua Account' : 'Open Account'}
              </span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1.5 text-xs font-bold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Active</span>
            </div>
          )}

          {/* Web Push Notification Bell */}
          <button
            id="btn-notifications-header"
            onClick={openNotificationSettings}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition"
            title="Notification Settings"
          >
            <Bell className="h-4 w-4" />
          </button>

          {/* Language Toggle */}
          <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-0.5">
            <button
              onClick={() => setLanguage('sw')}
              className={`rounded-lg px-2 py-1 text-xs font-bold transition ${
                language === 'sw'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SW
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`rounded-lg px-2 py-1 text-xs font-bold transition ${
                language === 'en'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
