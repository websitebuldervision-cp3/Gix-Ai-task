import React from 'react';
import {
  User,
  ShieldAlert,
  ShieldCheck,
  Globe,
  MessageCircle,
  Download,
  RotateCcw,
  ExternalLink,
  Award,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { formatUSD, formatTZS, ACTIVATION_URL } from '../data/translations';

export const AccountView: React.FC = () => {
  const {
    language,
    setLanguage,
    detectedCountry,
    detectedCountryMeta,
    isManualLanguage,
    t,
    user,
    openPwaModal,
    openWhatsAppSupport,
    resetSessionData,
  } = useApp();

  const isSw = language === 'sw';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
            <User className="h-3.5 w-3.5" />
            <span>{t.accountPage.profile}</span>
          </div>
          <h1 className="font-display mt-3 text-2xl sm:text-3xl font-extrabold text-white">
            {t.accountPage.title}
          </h1>
        </div>
      </div>

      {/* Profile Card & Account Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* User Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 p-[2px] shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400/40">
              <img
                src="/gix_chats_profile.jpg"
                alt={user.username}
                referrerPolicy="no-referrer"
                className="h-full w-full rounded-full object-cover animate-rotate-360"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] text-slate-950 font-black ring-2 ring-slate-900">
                ✓
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base sm:text-lg font-bold text-white">
                  {user.username}
                </h3>
                <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[9px] font-bold text-cyan-300 border border-cyan-500/25 uppercase">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>

          <div className="mt-4 space-y-2 border-t border-slate-800 pt-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">{t.accountPage.id}:</span>
              <span className="font-mono font-bold text-emerald-300">{user.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">{t.accountPage.joined}:</span>
              <span className="text-slate-200">{user.joinedDate}</span>
            </div>
          </div>
        </div>

        {/* Account Status Card (Crucial Section 13) */}
        <div className="md:col-span-2 relative overflow-hidden rounded-2xl border border-pink-500/40 bg-pink-950/20 p-5 shadow-[0_0_30px_rgba(244,63,94,0.15)] flex flex-col justify-between">
          <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-pink-500/20 blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-300 uppercase tracking-wider">
                {t.dashboard.accountStatus}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${
                  user.accountStatus === 'activated'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    user.accountStatus === 'activated'
                      ? 'bg-emerald-400'
                      : 'bg-rose-400'
                  }`}
                />
                {user.accountStatus === 'activated'
                  ? t.status.activated
                  : t.status.not_activated}
              </span>
            </div>

            <p className="mt-3 text-xs text-slate-300 leading-relaxed">
              {t.activation.feeNotice}
            </p>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-950/80 p-3 border border-pink-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
              <span className="text-xs text-slate-300 font-medium">
                {t.activation.feeLabel}
              </span>
              <span className="font-display text-sm font-extrabold text-amber-300 drop-shadow">
                {t.activation.feeAmount}
              </span>
            </div>
          </div>

          <div className="mt-4 relative group">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 blur-md opacity-70 group-hover:opacity-100 animate-pulse pointer-events-none" />
            <a
              id="btn-account-page-activate"
              href={ACTIVATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 px-6 py-3 text-xs font-black text-white border-2 border-pink-300/80 shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:scale-[1.02] active:scale-95 uppercase tracking-wide"
            >
              <span>{t.activation.activateBtn}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Language Preference Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-emerald-400" />
            <h3 className="font-display text-sm font-bold text-white">
              {t.accountPage.languagePref}
            </h3>
          </div>
          {detectedCountry && (
            <span className="text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800 flex items-center gap-1.5 font-medium">
              <span>{detectedCountryMeta.flag}</span>
              <span>{isSw ? detectedCountryMeta.nameSw : detectedCountryMeta.nameEn} ({detectedCountryMeta.code})</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-md">
          <button
            id="btn-account-lang-sw"
            onClick={() => setLanguage('sw', true)}
            className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all ${
              language === 'sw'
                ? 'border-emerald-500 bg-emerald-600 text-white shadow-md'
                : 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-850'
            }`}
          >
            <span className="text-base">🇹🇿</span>
            <span>Kiswahili</span>
          </button>

          <button
            id="btn-account-lang-en"
            onClick={() => setLanguage('en', true)}
            className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all ${
              language === 'en'
                ? 'border-emerald-500 bg-emerald-600 text-white shadow-md'
                : 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-850'
            }`}
          >
            <span className="text-base">🇬🇧</span>
            <span>English</span>
          </button>
        </div>

        <p className="mt-3 text-[11px] text-slate-400">
          {isManualLanguage
            ? (isSw ? 'Umechagua lugha hii wewe mwenyewe (Manual Selection). Chaguo hili litabaki hata ukiingia tena.' : 'Manual preference saved. Your choice takes priority over automatic country detection.')
            : (isSw ? `Lugha imetambuliwa kiotomatiki kutokana na nchi ya anwani yako ya IP (${detectedCountry || 'IP Geolocation'}).` : `Automatically detected based on your visitor IP country (${detectedCountry || 'IP Geolocation'}).`)}
        </p>
      </div>

      {/* Customer Care & PWA Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Customer Care WhatsApp */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <MessageCircle className="h-5 w-5" />
              <span>{t.support.title}</span>
            </div>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              {t.support.desc}
            </p>
            <p className="mt-1 text-xs font-mono font-bold text-emerald-300">
              WhatsApp: {t.support.phone}
            </p>
          </div>

          <button
            id="btn-account-whatsapp"
            onClick={openWhatsAppSupport}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{t.support.whatsappBtn}</span>
          </button>
        </div>

        {/* Download App Shortcut */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
              <Download className="h-5 w-5" />
              <span>{t.pwa.title}</span>
            </div>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              {isSw
                ? 'Sakinisha application ya simu kwa matumizi ya haraka bila kutumia browser.'
                : 'Install progressive mobile app for instant one-touch task evaluations.'}
            </p>
          </div>

          <button
            id="btn-account-open-pwa"
            onClick={openPwaModal}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-bold text-white hover:bg-slate-700"
          >
            <Download className="h-4 w-4" />
            <span>{t.nav.downloadApp}</span>
          </button>
        </div>
      </div>

      {/* Reset Session Data */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-400 text-center sm:text-left">
          {t.accountPage.securityNotice}
        </p>
        <button
          id="btn-reset-session-data"
          onClick={resetSessionData}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <RotateCcw className="h-3 w-3" />
          <span>{t.accountPage.logout}</span>
        </button>
      </div>
    </div>
  );
};
