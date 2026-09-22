import React, { useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Clock,
  Award,
  Users,
  Wallet,
  BrainCircuit,
  Lock,
  ChevronRight,
  ExternalLink,
  Download,
  Smartphone,
  Play,
  Eye,
  Check,
  Calendar,
  Layers,
  Volume2,
  ImageIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TASK_CATEGORIES } from '../data/taskCategories';
import { formatUSD, formatTZS, ACTIVATION_URL } from '../data/translations';
import { getDailyTasks, getDailyDateFormatted } from '../data/dailyTasks';
import { CommentsSection } from '../components/CommentsSection';

export const HomeView: React.FC = () => {
  const {
    language,
    t,
    user,
    setActiveTab,
    startTask,
    openPwaModal,
    isPwaInstalled,
    isTaskPaidToday,
  } = useApp();

  const isSw = language === 'sw';
  const featuredCategories = TASK_CATEGORIES.slice(0, 12);

  // Dynamic date formatted in Swahili & English
  const todayFormatted = useMemo(() => getDailyDateFormatted(), []);

  // Daily rotating tasks - refreshed automatically each calendar day!
  const dailyTasks = useMemo(() => getDailyTasks(), []);

  const handleStartCategory = (catId: string) => {
    startTask(catId);
  };

  const handleExploreCategories = () => {
    setActiveTab('tasks');
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-10">
      {/* TOP PROMINENT INSTALL APP BUTTON (OUTSIDE HERO BOX, CENTERED, PURPLE THEME, HIGH VISIBILITY & COMPACT) */}
      <div className="flex justify-center items-center pt-1">
        <button
          id="btn-top-install-app"
          onClick={openPwaModal}
          className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 px-5 py-2 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-400/60 hover:ring-purple-300 hover:from-purple-500 hover:to-indigo-500 active:scale-95 transition-all duration-200 tracking-wider uppercase cursor-pointer"
          title="Install App"
        >
          {isPwaInstalled ? (
            <>
              <Check className="h-4 w-4 text-purple-200 shrink-0 stroke-[2.5]" />
              <span className="drop-shadow-sm font-black">APP IMEWEKWA (INSTALLED)</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4 text-purple-200 shrink-0 stroke-[2.5] animate-bounce" />
              <span className="drop-shadow-sm font-black">{isSw ? 'INSTALL APP' : 'INSTALL APP'}</span>
            </>
          )}
        </button>
      </div>

      {/* 1. COMPACT HERO SECTION (STREAMLINED SIZE, GLOWING PINK ACTIVATION) */}
      <section className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-slate-900 via-[#0B0F19] to-[#080B11] p-3.5 sm:p-5 shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/20">
        {/* Subtle Ambient Glows */}
        <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-pink-500/15 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-3xl text-center z-10">
          {/* Main Title - Clean & Punchy */}
          <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {isSw ? (
              <>
                Anza Kufanya Task Mbalimbali za AI na{' '}
                <span className="bg-gradient-to-r from-pink-400 via-fuchsia-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(236,72,153,0.3)]">
                  Kulipwa Hapo Hapo
                </span>
              </>
            ) : (
              <>
                Complete Verified AI Tasks &{' '}
                <span className="bg-gradient-to-r from-pink-400 via-fuchsia-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(236,72,153,0.3)]">
                  Get Paid Instantly
                </span>
              </>
            )}
          </h1>

          {/* Subtitle / Earnings Highlight */}
          <div className="mt-2 inline-block rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3 py-1.5 text-xs sm:text-sm font-extrabold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] leading-relaxed">
            {isSw
              ? '💰 Tengeneza kuanzia TSh 50,000/= na kuendelea kwa siku kwa kufanya kazi za AI, fungua account yako uweze kuanza leo kwa 16,000 pekee'
              : '💰 Earn from TSh 50,000+ daily doing AI tasks. Open your account to start today for only 16,000 TSh'}
          </div>

          {/* Glowing Pink GUSA HAPA FUNGUA ACCOUNT Button */}
          <div className="mt-3 relative group max-w-md mx-auto">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 blur opacity-80 group-hover:opacity-100 animate-pulse transition duration-300 pointer-events-none" />
            <a
              id="btn-hero-activate-account"
              href={ACTIVATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 px-4 py-2.5 text-xs sm:text-sm font-black text-white border border-pink-300/80 shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all hover:scale-[1.02] active:scale-95 text-center uppercase tracking-wide"
            >
              <ExternalLink className="h-4 w-4 text-white shrink-0 drop-shadow" />
              <span>{t.hero.activateAccount}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. ALL TASKS IN 2-COLUMN GRID (FIRST 4 TASKS PROMINENT UPFRONT, ROTATING DAILY) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 px-3 py-1 text-xs font-black text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Sparkles className="h-3.5 w-3.5 text-emerald-300 animate-pulse" />
              <span>{isSw ? `Kaz za Ai leo • ${todayFormatted.sw}` : `Today's AI Tasks • ${todayFormatted.en}`}</span>
            </div>
            <h2 className="font-display mt-1.5 text-base sm:text-lg font-extrabold text-white">
              {isSw ? `Kaz za Ai leo (${todayFormatted.shortSw})` : `Today's AI Tasks (${todayFormatted.shortEn})`}
            </h2>
          </div>

          <button
            onClick={() => setActiveTab('tasks')}
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl shadow-sm"
          >
            <span>{isSw ? 'Kazi Zote 55+' : 'All 55+ Tasks'}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Crisp Two-Column Grid for ALL tasks (High density, minimal whitespace) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
          {dailyTasks.map((task, idx) => {
            const isTopFour = idx < 4;
            const taskTitle = isSw ? task.title.sw : task.title.en;
            const taskDomain = isSw ? task.domain.sw : task.domain.en;
            const taskTag = isSw ? task.tag.sw : task.tag.en;
            const isPaid = isTaskPaidToday(task.id);

            return (
              <div
                key={task.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-xl sm:rounded-2xl border p-2 sm:p-3 text-left transition duration-300 hover:shadow-lg ${
                  isPaid
                    ? 'border-emerald-500/40 bg-slate-900/75 opacity-90'
                    : isTopFour
                    ? 'border-emerald-500/60 bg-slate-900/95 shadow-[0_0_20px_rgba(16,185,129,0.18)] hover:border-emerald-400'
                    : 'border-slate-800 bg-slate-900/90 hover:border-emerald-500/40 hover:bg-slate-850'
                }`}
              >
                {/* Paid Badge or Top Badge */}
                {isPaid ? (
                  <div className="absolute top-0 right-0 z-20 bg-emerald-600 text-white font-black text-[9px] uppercase px-2.5 py-0.5 rounded-bl-lg tracking-wider shadow flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>PAID</span>
                  </div>
                ) : isTopFour ? (
                  <div className="absolute top-0 right-0 z-20 bg-gradient-to-l from-emerald-600 to-teal-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-bl-lg tracking-wider shadow">
                    {taskTag}
                  </div>
                ) : null}

                <div>
                  {/* Task Image Banner */}
                  <div className="relative h-24 sm:h-32 w-full overflow-hidden rounded-lg sm:rounded-xl bg-slate-800">
                    <img
                      src={task.image}
                      alt={taskTitle}
                      onError={(e) => {
                        const fallback = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80';
                        if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                      }}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Reward Tag Overlay */}
                    <div className="absolute top-1.5 left-1.5 flex flex-col gap-0.5">
                      <span className={`rounded-md px-1.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold shadow-sm ${
                        isPaid
                          ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
                          : 'bg-slate-950/90 text-emerald-400 border border-emerald-500/40'
                      }`}>
                        {isPaid ? '✓ PAID' : `+$${task.rewardUSD.toFixed(2)} (${task.rewardTZS})`}
                      </span>
                    </div>
                    {/* Time estimate */}
                    <span className="absolute bottom-1.5 right-1.5 rounded-md bg-slate-950/80 px-1.5 py-0.5 text-[8px] font-bold text-slate-300">
                      ⏱ {task.time}
                    </span>
                  </div>

                  {/* Title & Domain */}
                  <div className="mt-2 relative z-10">
                    <p className="text-[11px] sm:text-xs font-bold text-white line-clamp-1 group-hover:text-emerald-300 leading-tight">
                      {taskTitle}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium truncate mt-0.5">
                      {taskDomain}
                    </p>
                  </div>
                </div>

                {/* Direct Button: Disabled with 'PAID' if already completed today */}
                {isPaid ? (
                  <div className="mt-2.5 space-y-1">
                    <button
                      id={`btn-daily-task-paid-${task.id}`}
                      disabled
                      className="relative z-10 flex w-full items-center justify-center gap-1.5 rounded-lg sm:rounded-xl bg-slate-800/90 border border-emerald-500/40 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-black text-emerald-400 cursor-not-allowed uppercase tracking-wide shadow-sm"
                    >
                      <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span>{isSw ? 'IMELIPWA • PAID' : 'PAID'}</span>
                    </button>
                    <p className="text-[9px] text-center text-slate-400">
                      {isSw ? '🔒 Imefungwa kwa siku ya leo' : '🔒 Completed & locked today'}
                    </p>
                  </div>
                ) : (
                  <button
                    id={`btn-daily-task-start-${task.id}`}
                    onClick={() => startTask(task.id)}
                    className="relative z-10 mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-black text-white shadow-md shadow-emerald-500/20 transition duration-200 hover:brightness-110 active:scale-95 uppercase tracking-wide hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  >
                    <Play className="h-3 w-3 text-white fill-white shrink-0" />
                    <span>START TASK</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. USER DASHBOARD SUMMARY CARDS */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold text-white">
                {t.dashboard.welcome}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                ({user.username})
              </span>
            </div>
            <p className="text-xs text-slate-400">{t.dashboard.overview}</p>
          </div>

          <button
            id="btn-dash-start-task-action"
            onClick={() => startTask()}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-emerald-500 active:scale-95 sm:w-auto uppercase tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Play className="h-3.5 w-3.5 text-white fill-white" />
            <span>START TASK</span>
          </button>
        </div>

        {/* Dashboard 4-Card Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* 1. Available Tasks */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-400 block">
              {t.dashboard.availableTasks}
            </span>
            <p className="font-display mt-1 text-2xl font-extrabold text-white">
              55+
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
              <Sparkles className="h-3 w-3" />
              <span>{isSw ? 'Kazi zinasasishwa leo' : 'Updated daily'}</span>
            </span>
          </div>

          {/* 2. Completed Tasks */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-400 block">
              {t.dashboard.completedTasks}
            </span>
            <p className="font-display mt-1 text-2xl font-extrabold text-teal-400">
              {user.completedTasksCount}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-[10px] text-slate-400 font-medium">
              <CheckCircle2 className="h-3 w-3 text-teal-400" />
              <span>{isSw ? 'Zilizohakikiwa' : 'Audited submissions'}</span>
            </span>
          </div>

          {/* 3. Pending Rewards */}
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/25 p-4 shadow-[0_0_25px_rgba(16,185,129,0.15)]">
            <span className="text-[11px] font-semibold text-emerald-300 block">
              {t.dashboard.pendingRewards}
            </span>
            <p className="font-display mt-1 text-2xl font-extrabold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">
              {formatUSD(user.balancePendingUSD)}
            </p>
            <span className="mt-2 block text-[11px] font-medium text-slate-300">
              ≈ {formatTZS(user.balancePendingUSD)}
            </span>
          </div>

          {/* 4. Account Status */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">
                {t.dashboard.accountStatus}
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    user.accountStatus === 'activated'
                      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                      : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                  }`}
                />
                <p className="font-display text-sm font-bold text-white">
                  {user.accountStatus === 'activated'
                    ? t.status.activated
                    : t.status.not_activated}
                </p>
              </div>
            </div>

            {user.accountStatus !== 'activated' && (
              <a
                id="link-dash-activate-redirect"
                href={ACTIVATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-between rounded-lg bg-pink-600/30 px-2.5 py-1 text-[11px] font-bold text-pink-300 border border-pink-500/40 hover:bg-pink-600 hover:text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]"
              >
                <span>{t.activation.activateBtn}</span>
                <ChevronRight className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* 5. 55+ AI TASK CATEGORIES (NO STARS, CLEAN BADGES) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-white">
              {isSw ? 'Categories za AI Tasks' : 'AI Task Categories'}
            </h2>
            <p className="text-xs text-slate-400">
              {isSw
                ? `Kazi 55+ zimefunguliwa kwa ajili ya ${todayFormatted.shortSw}`
                : `55+ active pipelines ready for ${todayFormatted.shortEn}`}
            </p>
          </div>

          <button
            id="btn-view-all-categories-home"
            onClick={handleExploreCategories}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
          >
            <span>{t.dashboard.viewAllCategories}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Featured 12 Category Cards in 2-Column Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {featuredCategories.map((cat) => {
            const catName = isSw ? cat.name.sw : cat.name.en;
            const catDesc = isSw ? cat.description.sw : cat.description.en;
            const isCatPaid = isTaskPaidToday(cat.id);

            return (
              <div
                key={cat.id}
                className={`group relative flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                  isCatPaid
                    ? 'border-emerald-500/40 bg-slate-900/75 opacity-90'
                    : 'border-slate-800 bg-slate-900/80 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:bg-slate-850'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
                      {cat.group}
                    </span>
                    {isCatPaid ? (
                      <span className="rounded-md bg-emerald-950/90 px-2 py-0.5 text-[10px] font-black text-emerald-400 border border-emerald-500/50 flex items-center gap-1">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        PAID
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-400">
                        ${cat.rewardMin} – ${cat.rewardMax}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display mt-3 text-sm font-bold text-white group-hover:text-emerald-300">
                    {catName}
                  </h3>

                  <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {catDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 shrink-0">
                    {cat.availableCount} {isSw ? 'kazi' : 'tasks'}
                  </span>

                  {isCatPaid ? (
                    <button
                      id={`btn-home-cat-paid-${cat.id}`}
                      disabled
                      className="flex items-center gap-1 rounded-xl bg-slate-800 border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-400 cursor-not-allowed uppercase tracking-wider shadow-sm"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span>PAID</span>
                    </button>
                  ) : (
                    <button
                      id={`btn-home-start-cat-${cat.id}`}
                      onClick={() => handleStartCategory(cat.id)}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 uppercase tracking-wider hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    >
                      <Play className="h-3 w-3 text-white fill-white" />
                      <span>START TASK</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            {t.howItWorks.title}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="font-display text-xs font-extrabold text-emerald-400">
              {t.howItWorks.step1Title}
            </span>
            <p className="mt-1 text-sm font-bold text-white">
              {t.howItWorks.step1Desc}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="font-display text-xs font-extrabold text-emerald-400">
              {t.howItWorks.step2Title}
            </span>
            <p className="mt-1 text-sm font-bold text-white">
              {t.howItWorks.step2Desc}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="font-display text-xs font-extrabold text-emerald-400">
              {t.howItWorks.step3Title}
            </span>
            <p className="mt-1 text-sm font-bold text-white">
              {t.howItWorks.step3Desc}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="font-display text-xs font-extrabold text-emerald-400">
              {t.howItWorks.step4Title}
            </span>
            <p className="mt-1 text-sm font-bold text-white">
              {t.howItWorks.step4Desc}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="font-display text-xs font-extrabold text-emerald-400">
              {t.howItWorks.step5Title}
            </span>
            <p className="mt-1 text-sm font-bold text-white">
              {t.howItWorks.step5Desc}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <span className="font-display text-xs font-extrabold text-emerald-400">
              {t.howItWorks.step6Title}
            </span>
            <p className="mt-1 text-sm font-bold text-white">
              {t.howItWorks.step6Desc}
            </p>
          </div>
        </div>
      </section>

      {/* 7. ACCOUNT ACTIVATION NOTICE BANNER */}
      {user.accountStatus !== 'activated' && (
        <section className="relative overflow-hidden rounded-3xl border-2 border-pink-500/50 bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-slate-950 p-6 sm:p-7 shadow-[0_0_40px_rgba(244,63,94,0.25)]">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-purple-600/20 blur-xl opacity-60 pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-pink-400 animate-ping shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                <h3 className="font-display text-base sm:text-lg font-extrabold text-white">
                  {t.activation.requirementsTitle}
                </h3>
              </div>
              <p className="mt-1.5 text-xs text-slate-200 leading-relaxed max-w-xl">
                {t.activation.feeNotice}
              </p>
              <p className="mt-2 text-xs font-black text-pink-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">
                {t.activation.feeLabel} {t.activation.feeAmount}
              </p>
            </div>

            <div className="relative group shrink-0">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 blur-md opacity-80 group-hover:opacity-100 animate-pulse pointer-events-none" />
              <a
                id="btn-home-banner-activate"
                href={ACTIVATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 px-7 py-3 text-xs sm:text-sm font-black text-white border-2 border-pink-300/80 shadow-[0_0_25px_rgba(244,63,94,0.5)] hover:scale-105 active:scale-95 uppercase tracking-wide"
              >
                <span>{t.activation.activateBtn}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 8. REAL USER COMMENTS & REVIEWS (NO STARS, DYNAMIC DATES) */}
      <CommentsSection />
    </div>
  );
};
