import React, { useState } from 'react';
import {
  Bot,
  Globe,
  Download,
  MessageCircle,
  User,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Check,
  ChevronDown,
  ExternalLink,
  Bell,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { ACTIVATION_URL } from '../data/translations';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    detectedCountry,
    detectedCountryMeta,
    isManualLanguage,
    t,
    activeTab,
    setActiveTab,
    user,
    openPwaModal,
    openWhatsAppSupport,
    redirectToActivation,
    openNotificationSettings,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang, true);
    setIsLangDropdownOpen(false);
  };

  const navLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'tasks', label: t.nav.tasks },
    { id: 'my-tasks', label: t.nav.myTasks },
    { id: 'rewards', label: t.nav.rewards },
    { id: 'leaderboard', label: t.nav.leaderboard },
    { id: 'account', label: t.nav.account },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080B11]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 sm:py-3">
        {/* Brand Logo & Profile Avatar (Juu Kabisa Kushoto - Duara na Rotate 360) */}
        <button
          id="btn-brand-logo"
          onClick={() => setActiveTab('home')}
          className="group flex items-center gap-2.5 text-left focus:outline-none"
        >
          {/* Circular 360-Rotating Profile Image Badge */}
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 p-[2px] shadow-lg shadow-cyan-500/30 ring-1.5 ring-cyan-400/50">
            <img
              src="/gix_chats_profile.jpg"
              alt="GIX Profile Badge"
              referrerPolicy="no-referrer"
              className="h-full w-full rounded-full object-cover animate-rotate-360"
            />
            {/* Live Active Status Ring Ping */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 pointer-events-none">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-1 ring-slate-950"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-base font-bold tracking-tight text-white sm:text-lg">
                GIX <span className="text-cyan-400">CHAT</span>
              </span>
              <span className="hidden rounded-full bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-cyan-300 border border-cyan-500/20 sm:inline-block">
                360°
              </span>
            </div>
            <p className="hidden text-[11px] font-medium text-slate-400 md:block">
              {t.brand.taglineShort}
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => setActiveTab(link.id)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30 shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              id="btn-language-selector"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/90 px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800"
              aria-label="Select Language"
            >
              <Globe className="h-3.5 w-3.5 text-emerald-400" />
              <span>{language === 'sw' ? '🇹🇿 Kiswahili' : '🇬🇧 English'}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-52 rounded-xl border border-slate-700 bg-slate-900 p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                {detectedCountry && (
                  <div className="mb-1.5 px-2 py-1 text-[10px] text-slate-400 border-b border-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1 font-medium text-slate-300">
                      <span>{detectedCountryMeta.flag}</span>
                      <span>{detectedCountryMeta.nameEn} ({detectedCountryMeta.code})</span>
                    </span>
                    <span className="text-[9px] text-emerald-400 font-semibold uppercase tracking-wider">
                      {isManualLanguage ? (language === 'sw' ? 'Manual' : 'Manual') : (language === 'sw' ? 'Auto' : 'Auto')}
                    </span>
                  </div>
                )}
                <button
                  id="btn-select-lang-sw"
                  onClick={() => handleLanguageChange('sw')}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    language === 'sw'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">🇹🇿</span> Kiswahili
                  </span>
                  {language === 'sw' && <Check className="h-3.5 w-3.5" />}
                </button>
                <button
                  id="btn-select-lang-en"
                  onClick={() => handleLanguageChange('en')}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    language === 'en'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">🇬🇧</span> English
                  </span>
                  {language === 'en' && <Check className="h-3.5 w-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Direct Activation Button */}
          {user.accountStatus !== 'activated' && (
            <a
              id="btn-header-activate"
              href={ACTIVATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 px-3 py-1.5 text-xs font-black text-white shadow-md shadow-pink-500/30 hover:scale-105 active:scale-95 uppercase tracking-wide border border-pink-400/50 animate-pulse"
            >
              <span>{language === 'sw' ? 'GUSA HAPA FUNGUA ACCOUNT' : 'ACTIVATE'}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}

          {/* Download App Button (Compact size) */}
          <button
            id="btn-download-app-header"
            onClick={openPwaModal}
            className="hidden items-center gap-1 rounded-md border border-slate-700 bg-slate-900/90 px-2 py-1 text-[11px] font-medium text-slate-300 transition-colors hover:border-emerald-500/50 hover:bg-slate-800 hover:text-white md:flex"
          >
            <Download className="h-3 w-3 text-emerald-400" />
            <span>{t.nav.downloadApp}</span>
          </button>

          {/* WhatsApp Customer Care */}
          <button
            id="btn-customer-care-header"
            onClick={openWhatsAppSupport}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 transition-all hover:bg-emerald-900/40 hover:border-emerald-400 sm:px-3"
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{t.nav.customerCare}</span>
            <span className="sm:hidden">{language === 'sw' ? 'Msaada' : 'Care'}</span>
          </button>

          {/* Web Push Notifications Button */}
          <button
            id="btn-notifications-header"
            onClick={openNotificationSettings}
            title={language === 'sw' ? 'Washa/Zima Notifications' : 'Push Notifications'}
            aria-label="Push Notifications"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/90 px-2.5 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:border-indigo-500/50 hover:text-white"
          >
            <Bell className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden xl:inline">{language === 'sw' ? 'Taarifa' : 'Alerts'}</span>
          </button>

          {/* Account Status Pill */}
          <button
            id="btn-account-header-pill"
            onClick={() => setActiveTab('account')}
            className="hidden items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-600 hover:bg-slate-800 sm:flex"
          >
            <div className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full overflow-hidden ring-1 ring-cyan-400/60 shadow-sm">
              <img
                src="/gix_chats_profile.jpg"
                alt={user.username}
                referrerPolicy="no-referrer"
                className="h-full w-full rounded-full object-cover animate-rotate-360"
              />
            </div>
            <span className="max-w-[80px] truncate text-slate-200 font-semibold">{user.username}</span>
            <span
              className={`h-2 w-2 rounded-full ${
                user.accountStatus === 'activated'
                  ? 'bg-emerald-400 ring-2 ring-emerald-400/20'
                  : 'bg-rose-500 ring-2 ring-rose-500/20'
              }`}
            />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:bg-slate-800 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-800 bg-[#080B11] px-4 py-4 lg:hidden animate-in slide-in-from-top-4">
          <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-900 p-3 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 p-[1.5px] shadow-sm">
                <img
                  src="/gix_chats_profile.jpg"
                  alt={user.username}
                  referrerPolicy="no-referrer"
                  className="h-full w-full rounded-full object-cover animate-rotate-360"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-white">{user.username}</p>
                <p className="text-[11px] text-slate-400">
                  {t.dashboard.accountStatus}:{' '}
                  <span className={user.accountStatus === 'activated' ? 'text-emerald-400' : 'text-rose-400'}>
                    {user.accountStatus === 'activated' ? t.status.activated : t.status.not_activated}
                  </span>
                </p>
              </div>
            </div>
            {user.accountStatus !== 'activated' && (
              <button
                id="btn-mobile-drawer-activate"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  redirectToActivation();
                }}
                className="rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 px-2.5 py-1 text-[11px] font-black text-white shadow-md hover:from-pink-400 hover:to-rose-500 border border-pink-400/50"
              >
                {t.activation.activateBtn}
              </button>
            )}
          </div>

          {/* Mobile Quick Language Switcher */}
          <div className="mb-3 rounded-xl bg-slate-900/90 p-2.5 border border-slate-800">
            <div className="flex items-center justify-between mb-2 px-1 text-[11px] font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-emerald-400" />
                {language === 'sw' ? 'Lugha ya Mfumo' : 'Platform Language'}
              </span>
              {detectedCountry && (
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span>{detectedCountryMeta.flag}</span>
                  <span>{detectedCountryMeta.code}</span>
                  <span className="text-[9px] text-emerald-400 font-semibold">
                    ({isManualLanguage ? 'Manual' : 'Auto'})
                  </span>
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-mobile-drawer-lang-sw"
                onClick={() => {
                  handleLanguageChange('sw');
                }}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
                  language === 'sw'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <span>🇹🇿</span>
                <span>Kiswahili</span>
                {language === 'sw' && <Check className="h-3.5 w-3.5 ml-1" />}
              </button>
              <button
                id="btn-mobile-drawer-lang-en"
                onClick={() => {
                  handleLanguageChange('en');
                }}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <span>🇬🇧</span>
                <span>English</span>
                {language === 'en' && <Check className="h-3.5 w-3.5 ml-1" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  id={`drawer-nav-${link.id}`}
                  onClick={() => {
                    setActiveTab(link.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-start rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-3">
            <button
              id="btn-mobile-download-app"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openPwaModal();
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 py-2 text-xs font-semibold text-slate-200"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              {t.nav.downloadApp}
            </button>
            <button
              id="btn-mobile-customer-care"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openWhatsAppSupport();
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 py-2 text-xs font-semibold text-emerald-300"
            >
              <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
              {t.nav.customerCare}
            </button>
            <button
              id="btn-mobile-notifications"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openNotificationSettings();
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-950/40 py-2 text-xs font-semibold text-indigo-300 col-span-2 mt-1"
            >
              <Bell className="h-3.5 w-3.5 text-indigo-400" />
              <span>🔔 Washa / Zima Notifications (08:00, 13:00, 19:00 EAT)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
