import React from 'react';
import { useApp } from '../context/AppContext';
import { DEFAULT_PARTNERS } from '../data/defaultPartners';
import {
  MessageSquare,
  Globe,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Timer,
  Wallet,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { formatTZS, formatUSD } from '../data/translations';

export const HomeView: React.FC = () => {
  const { setActiveTab, openActivationLink, openChatWithPartner, openRegistration, user, language, t } = useApp();

  const isActivated = user.accountStatus === 'activated';
  const onlinePartners = DEFAULT_PARTNERS.slice(0, 4);

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950/80 to-[#080B11] p-6 sm:p-10 lg:p-12 shadow-2xl">
        {/* Glow ambient background lights */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-72 sm:w-96 sm:h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-400 backdrop-blur-md shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t.hero.badge}</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {t.hero.title}
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            {t.hero.subtitle}
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('find')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 px-7 py-3.5 text-sm font-extrabold text-slate-950 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition cursor-pointer"
            >
              <span>{t.hero.startChatting}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={scrollToHowItWorks}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-bold text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition cursor-pointer"
            >
              <HelpCircle className="h-4 w-4 text-emerald-400" />
              <span>{t.hero.howItWorks}</span>
            </button>
          </div>

          {/* Trust & Transparency Note */}
          <p className="text-[11px] text-slate-400 max-w-xl mx-auto">
            {t.hero.guaranteeNotice}
          </p>

          {/* Live Platform Proof Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
            <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-slate-800 px-3 py-1.5 text-slate-300">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              <span className="font-semibold text-white">{t.hero.activePartnersBadge}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-slate-800 px-3 py-1.5 text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold text-white">Rate: $0.50 / Minute (Pending)</span>
            </div>
          </div>
        </div>

        {/* Featured Foreign Learners Preview */}
        <div className="relative z-10 mt-10 pt-8 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {language === 'sw' ? 'Wageni Waliopo Hewani Sasa (Wazungu)' : 'Foreign Learners Online Now'}
              </span>
            </div>
            <button
              onClick={() => setActiveTab('find')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
            >
              <span>{language === 'sw' ? 'Tazama Wote' : 'View All'}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {onlinePartners.map((partner) => (
              <div
                key={partner.id}
                className="group relative rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 hover:border-emerald-500/50 hover:bg-slate-900 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={partner.avatarUrl}
                        alt={partner.name}
                        className="h-11 w-11 rounded-full object-cover border border-slate-700"
                      />
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white truncate">
                          {partner.name}
                        </span>
                        <span className="text-sm" title={partner.country}>
                          {partner.countryFlag}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {partner.country} • {partner.kiswahiliLevel.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <p className="mt-2.5 text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {partner.bio[language]}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    🟢 Online
                  </span>
                  <button
                    onClick={() => openChatWithPartner(partner)}
                    className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition cursor-pointer"
                  >
                    <span>{language === 'sw' ? 'Chat Naye' : 'Start Chat'}</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. PROMINENT ACTIVATION BANNER ("GUSA HAPA KUFUNGUA ACCOUNT") */}
      {!isActivated && (
        <section className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/10 blur-2xl pointer-events-none" />

          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>{t.activationBanner.title}</span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl font-black text-white leading-snug">
              {language === 'sw'
                ? 'Malipo yako ya chat yanaingia Pending. Fungua account yako uweze kutoa pesa!'
                : 'Your chat earnings are waiting in Pending. Open your account to withdraw!'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.activationBanner.desc}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
              {/* The Exact CTA Button Requested by User */}
              <button
                onClick={openActivationLink}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 px-8 py-3.5 text-sm font-black tracking-wide text-slate-950 shadow-xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition cursor-pointer"
              >
                <span>{t.activationBanner.buttonText}</span>
                <ExternalLink className="h-4 w-4" />
              </button>

              <span className="text-xs font-semibold text-emerald-300/90">
                {t.activationBanner.feeNotice}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* 3. HOW IT WORKS (4 SIMPLE STEPS) */}
      <section id="how-it-works-section" className="space-y-6 pt-2">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Timer className="h-4 w-4" />
            <span>Mchakato Rasmi wa GIX CHATS</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            {t.howItWorks.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="relative rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 hover:border-slate-700 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              1
            </div>
            <h3 className="font-display text-sm font-bold text-white">
              {t.howItWorks.step1Title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.howItWorks.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 hover:border-slate-700 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              2
            </div>
            <h3 className="font-display text-sm font-bold text-white">
              {t.howItWorks.step2Title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.howItWorks.step2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3 hover:border-slate-700 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              3
            </div>
            <h3 className="font-display text-sm font-bold text-white">
              {t.howItWorks.step3Title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.howItWorks.step3Desc}
            </p>
          </div>

          {/* Step 4 */}
          <div className="relative rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-5 space-y-3 shadow-lg shadow-emerald-500/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-bold">
              4
            </div>
            <h3 className="font-display text-sm font-bold text-white">
              {t.howItWorks.step4Title}
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              {t.howItWorks.step4Desc}
            </p>
          </div>
        </div>

        {/* Earning Rules Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">
                {language === 'sw' ? 'Ufafanuzi wa Kanuni za Mapato:' : 'Platform Rules Notice:'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.howItWorks.rulesNotice}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('earnings')}
            className="shrink-0 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-emerald-400 hover:bg-slate-700 transition"
          >
            {language === 'sw' ? 'Tazama Kanuni zote' : 'View All Rules'}
          </button>
        </div>
      </section>

      {/* 4. CHAT PURPOSE & SUGGESTED TOPICS BANNER */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-4">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <MessageSquare className="h-4 w-4" />
            <span>{t.chat.purposeTitle}</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
            {language === 'sw' ? 'Unachoweza Kumfundisha Mgeni' : 'What You Can Teach Foreign Learners'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            {t.chat.purposeDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 flex items-center gap-2">
            <span className="text-base">👋</span>
            <span>Salamu za heshima: "Habari za asubuhi!"</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 flex items-center gap-2">
            <span className="text-base">🗣️</span>
            <span>Kujitambulisha: "Jina langu ni..."</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 flex items-center gap-2">
            <span className="text-base">🇹🇿</span>
            <span>Ukaribisho: "Karibu sana Tanzania!"</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 flex items-center gap-2">
            <span className="text-base">🙏</span>
            <span>Kushukuru: "Asante sana!"</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 flex items-center gap-2">
            <span className="text-base">🦁</span>
            <span>Majina ya wanyama: Simba, Tembo, Twiga</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 flex items-center gap-2">
            <span className="text-base">🛒</span>
            <span>Kuuliza bei: "Hii ni bei gani?"</span>
          </div>
        </div>
      </section>
    </div>
  );
};
