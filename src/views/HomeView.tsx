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
  } = useApp();

  const isSw = language === 'sw';
  const featuredCategories = TASK_CATEGORIES.slice(0, 12);

  // Generate today's formatted dynamic date string in Swahili & English
  const todayFormatted = useMemo(() => {
    const d = new Date();
    const dayNamesSw = ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi'];
    const monthNamesSw = ['Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni', 'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'];
    const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayNameSw = dayNamesSw[d.getDay()];
    const dayNum = d.getDate();
    const monthSw = monthNamesSw[d.getMonth()];
    const monthEn = monthNamesEn[d.getMonth()];
    const year = d.getFullYear();

    return {
      sw: `${dayNameSw}, ${dayNum} ${monthSw} ${year}`,
      en: `${d.toLocaleDateString('en-US', { weekday: 'long' })}, ${monthEn} ${dayNum}, ${year}`,
      shortSw: `Leo, ${dayNum} ${monthSw.slice(0, 3)}`,
      shortEn: `Today, ${monthEn.slice(0, 3)} ${dayNum}`,
    };
  }, []);

  const handleStartCategory = (catId: string) => {
    startTask(catId);
  };

  const handleExploreCategories = () => {
    setActiveTab('tasks');
  };

  // Top visual microtasks with direct "START TASK" buttons (Updated daily - 14 featured tasks)
  const visualHeroTasks = [
    {
      id: 'cat_img_comp',
      title: isSw ? 'AI Image Evaluation' : 'AI Image Evaluation',
      domain: 'Computer Vision',
      rewardUSD: 2.50,
      rewardTZS: 'TSh 6,500',
      time: '2 min',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_audio_eval',
      title: isSw ? 'Audio & Speech AI' : 'Audio & Speech AI',
      domain: 'Voice Synthesis',
      rewardUSD: 3.00,
      rewardTZS: 'TSh 7,800',
      time: '3 min',
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_video_tag',
      title: isSw ? 'Autonomous AI Drive' : 'Autonomous AI Drive',
      domain: 'Object Bounding',
      rewardUSD: 3.50,
      rewardTZS: 'TSh 9,100',
      time: '3 min',
      image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_text_audit',
      title: isSw ? 'LLM Output Quality' : 'LLM Output Quality',
      domain: 'Text & Reasoning',
      rewardUSD: 2.80,
      rewardTZS: 'TSh 7,280',
      time: '2 min',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_medical_ai',
      title: isSw ? 'Medical AI Scan Triage' : 'Medical AI Scan Triage',
      domain: 'Biomedical AI',
      rewardUSD: 3.20,
      rewardTZS: 'TSh 8,320',
      time: '3 min',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_face_align',
      title: isSw ? 'Facial Emotion AI' : 'Facial Emotion AI',
      domain: 'Biometric AI',
      rewardUSD: 2.60,
      rewardTZS: 'TSh 6,760',
      time: '2 min',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_satellite_gis',
      title: isSw ? 'Satellite GIS Mapping' : 'Satellite GIS Mapping',
      domain: 'Geospatial AI',
      rewardUSD: 3.80,
      rewardTZS: 'TSh 9,880',
      time: '4 min',
      image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_swahili_dialect',
      title: isSw ? 'Swahili Dialect AI' : 'Swahili Dialect AI',
      domain: 'African NLP',
      rewardUSD: 3.40,
      rewardTZS: 'TSh 8,840',
      time: '3 min',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_ocr_transcribe',
      title: isSw ? 'Document OCR AI' : 'Document OCR AI',
      domain: 'Text Extraction',
      rewardUSD: 2.40,
      rewardTZS: 'TSh 6,240',
      time: '2 min',
      image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_ecommerce_tag',
      title: isSw ? 'Product Moderation' : 'Product Moderation',
      domain: 'E-Commerce AI',
      rewardUSD: 2.20,
      rewardTZS: 'TSh 5,720',
      time: '2 min',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_sound_classify',
      title: isSw ? 'Environmental Audio' : 'Environmental Audio',
      domain: 'Acoustic AI',
      rewardUSD: 2.90,
      rewardTZS: 'TSh 7,540',
      time: '3 min',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_content_safety',
      title: isSw ? 'Safety & Content Guard' : 'Safety & Content Guard',
      domain: 'AI Safety',
      rewardUSD: 3.10,
      rewardTZS: 'TSh 8,060',
      time: '2 min',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_code_benchmark',
      title: isSw ? 'Code Logic Syntax AI' : 'Code Logic Syntax AI',
      domain: 'Code Synthesis',
      rewardUSD: 4.20,
      rewardTZS: 'TSh 10,920',
      time: '4 min',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'cat_audio_denoise',
      title: isSw ? 'Voice Noise Cleaner' : 'Voice Noise Cleaner',
      domain: 'Signal Processing',
      rewardUSD: 2.70,
      rewardTZS: 'TSh 7,020',
      time: '2 min',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HERO SECTION WITH SURROUNDED GLOW & TWO TOP BUTTONS */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-900 via-[#0B0F19] to-[#080B11] p-5 sm:p-9 shadow-[0_0_50px_-10px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/20">
        {/* Radiant Ambient Glows */}
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-4xl text-center z-10">
          {/* Top Live Date Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Calendar className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>
              {isSw
                ? `Kazi za Leo • ${todayFormatted.sw}`
                : `Today's Active Pipeline • ${todayFormatted.en}`}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-display mt-4 text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {isSw ? (
              <>
                Anza Kufanya Task Mbalimbali za AI na{' '}
                <span className="bg-gradient-to-r from-pink-400 via-fuchsia-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                  Kulipwa Hapo Hapo
                </span>
              </>
            ) : (
              <>
                Complete Verified AI Tasks &{' '}
                <span className="bg-gradient-to-r from-pink-400 via-fuchsia-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                  Get Paid Instantly
                </span>
              </>
            )}
          </h1>

          {/* Subtitle / Earnings Highlight */}
          <div className="mt-3 inline-block rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            {isSw
              ? '💰 Tengeneza kuanzia TSh 50,000/= kwa siku na kuendelea kupitia simu yako'
              : '💰 Earn from TSh 50,000+ ($20 - $50+) daily completing simple tasks on your phone'}
          </div>

          <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>

          {/* 2 HERO ACTION BUTTONS (INSTALL APP & PINK GUSA HAPA FUNGUA ACCOUNT) */}
          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* 1. INSTALL APP BUTTON */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/50 to-teal-500/50 blur-md opacity-60 group-hover:opacity-100 transition duration-300 pointer-events-none" />
              <button
                id="btn-hero-install-app"
                onClick={openPwaModal}
                className={`relative w-full flex items-center justify-center gap-2.5 rounded-xl px-5 py-3.5 text-xs sm:text-sm font-black transition-all active:scale-95 text-center shadow-lg ${
                  isPwaInstalled
                    ? 'border-2 border-emerald-400 bg-emerald-950/90 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.35)]'
                    : 'border-2 border-emerald-500/60 bg-slate-900/90 text-emerald-300 hover:bg-emerald-950 hover:border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                }`}
              >
                {isPwaInstalled ? (
                  <>
                    <Check className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span>APP INSTALLED ✓</span>
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span>{t.hero.installApp}</span>
                  </>
                )}
              </button>
            </div>

            {/* 2. GUSA HAPA FUNGUA ACCOUNT (VIBRANT PINK WITH SURROUNDED PINK GLOW) */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 blur-lg opacity-80 group-hover:opacity-100 animate-pulse transition duration-300 pointer-events-none" />
              <a
                id="btn-hero-activate-account"
                href={ACTIVATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-full flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 px-5 py-3.5 text-xs sm:text-sm font-black text-white border-2 border-pink-300/80 shadow-[0_0_30px_rgba(244,63,94,0.6)] transition-all hover:scale-[1.02] active:scale-95 text-center uppercase tracking-wide"
              >
                <ExternalLink className="h-5 w-5 text-white shrink-0 drop-shadow" />
                <span>{t.hero.activateAccount}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KAZI 2 ZA MWANZO ZA LEO (CLEAR & PROMINENT TOP 2 INSTANT TASKS) */}
      <section className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 px-3 py-1 text-xs font-black text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
              <span>{isSw ? 'KAZI ZA LEO (TODAY’S INSTANT TASKS)' : 'TODAY’S INSTANT TASKS'}</span>
            </div>
            <h2 className="font-display mt-2 text-xl sm:text-2xl font-extrabold text-white">
              {isSw ? 'Tasks 2 za Mwanzo Zinazoanza Hapo Hapo' : 'Top 2 Instant Tasks — Start Directly'}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {isSw
                ? `Kazi hizi mbili zimehakikiwa kwa tarehe ya ${todayFormatted.shortSw} na zinalipa moja kwa moja.`
                : `These two tasks are active today (${todayFormatted.shortEn}) with verified instant rewards.`}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('tasks')}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 self-start sm:self-auto bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl shadow-sm"
          >
            <span>{isSw ? 'Tazama Kazi Zote 55+' : 'View All 55+ Tasks'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* 2 Interactive High-Visibility Instant Task Cards (Clean & Clear, No Stars) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Instant Task 1: Image Clarity Evaluation */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-teal-500/60 bg-slate-900/95 p-5 shadow-[0_0_35px_rgba(20,184,166,0.2)] hover:border-teal-400 hover:shadow-[0_0_40px_rgba(20,184,166,0.35)] transition group flex flex-col justify-between">
            <div className="absolute top-0 right-0 bg-teal-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider shadow">
              {isSw ? 'KAZI YA 1 YA LEO' : 'TODAY TASK #1'}
            </div>

            <div>
              <div className="flex items-start gap-3.5 pr-20 sm:pr-0">
                <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-slate-800 shrink-0 border-2 border-teal-500/40 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&auto=format&fit=crop&q=80"
                    alt="Task 1"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-950/90 text-[9px] font-bold text-center text-teal-300">
                    Picha AI
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-teal-500/20 px-2 py-0.5 text-[10px] font-extrabold text-teal-300 border border-teal-500/30">
                      Vision Bench
                    </span>
                    <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      ● {isSw ? 'Imesasishwa Leo' : 'Active Today'}
                    </span>
                  </div>

                  <h3 className="font-display mt-1.5 text-base sm:text-lg font-extrabold text-white group-hover:text-teal-300 leading-snug">
                    {isSw
                      ? 'AI Image Quality & Visual Alignment'
                      : 'AI Image Quality & Visual Alignment'}
                  </h3>

                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-300">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>2 min</span>
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{isSw ? 'Hakiki Picha 2' : '2 Image Compare'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Reward Display Bar */}
              <div className="mt-4 rounded-xl bg-slate-950/80 border border-slate-800 p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isSw ? 'Malipo ya Kazi Hii:' : 'Task Reward:'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-xl sm:text-2xl font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                      +$2.50
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-200">
                      ≈ TSh 6,500
                    </span>
                  </div>
                </div>

                {/* PROMINENT START BUTTON */}
                <button
                  id="btn-spotlight-task-1"
                  onClick={() => startTask('cat_img_comp')}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 px-5 py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-emerald-500/30 hover:scale-105 hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] active:scale-95 uppercase tracking-wide"
                >
                  <Play className="h-4 w-4 text-white fill-white" />
                  <span>START TASK</span>
                </button>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-400 italic">
              {isSw
                ? 'Maelekezo: Linganisha picha 2 za AI na uchague yenye uwazi na usahihi zaidi.'
                : 'Instructions: Compare 2 AI generated images and pick the sharper sample.'}
            </p>
          </div>

          {/* Instant Task 2: Speech Synthesis Benchmark */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/60 bg-slate-900/95 p-5 shadow-[0_0_35px_rgba(16,185,129,0.25)] hover:border-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition group flex flex-col justify-between">
            <div className="absolute top-0 right-0 bg-emerald-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider shadow">
              {isSw ? 'KAZI YA 2 YA LEO' : 'TODAY TASK #2'}
            </div>

            <div>
              <div className="flex items-start gap-3.5 pr-20 sm:pr-0">
                <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-slate-800 shrink-0 border-2 border-emerald-500/40 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200&auto=format&fit=crop&q=80"
                    alt="Task 2"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-950/90 text-[9px] font-bold text-center text-emerald-300">
                    Sauti AI
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-300 border border-emerald-500/30">
                      Voice & Audio
                    </span>
                    <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      ● {isSw ? 'Imesasishwa Leo' : 'Active Today'}
                    </span>
                  </div>

                  <h3 className="font-display mt-1.5 text-base sm:text-lg font-extrabold text-white group-hover:text-emerald-300 leading-snug">
                    {isSw
                      ? 'Swahili & English Voice Synthesis AI'
                      : 'Swahili & English Voice Synthesis AI'}
                  </h3>

                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-300">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>3 min</span>
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>{isSw ? 'Sauti Halisi ya AI' : 'Real Audio Speech'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Reward Display Bar */}
              <div className="mt-4 rounded-xl bg-slate-950/80 border border-slate-800 p-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isSw ? 'Malipo ya Kazi Hii:' : 'Task Reward:'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-xl sm:text-2xl font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                      +$3.00
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-200">
                      ≈ TSh 7,800
                    </span>
                  </div>
                </div>

                {/* PROMINENT START BUTTON */}
                <button
                  id="btn-spotlight-task-2"
                  onClick={() => startTask('cat_audio_eval')}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 px-5 py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-emerald-500/30 hover:scale-105 hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] active:scale-95 uppercase tracking-wide"
                >
                  <Play className="h-4 w-4 text-white fill-white" />
                  <span>START TASK</span>
                </button>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-slate-400 italic">
              {isSw
                ? 'Maelekezo: Sikiliza sauti 2 za Kiswahili/Kiingereza na uchague yenye mtiririko fasaha zaidi.'
                : 'Instructions: Listen to 2 synthetic audio speech tracks and verify pronunciation clarity.'}
            </p>
          </div>
        </div>
      </section>

      {/* 3. VISUAL SHOWCASE GALLERY: 14+ AI TASKS (TWO-COLUMN GRID WITH DIRECT 'START TASK' BUTTONS) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <span className="text-xs sm:text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              {isSw ? 'Kazi Nyingine 14+ za AI Zilizo Tayari Kufanyika Sasa' : '14+ Additional AI Microtasks Ready Now'}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isSw ? 'Kazi zote ziko tayari • Bonyeza START TASK kuanza moja kwa moja' : 'All tasks ready • Tap START TASK to begin instantly'}
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline-block">
            {todayFormatted.shortSw}
          </span>
        </div>

        {/* Crisp Two-Column Grid for All Screen Sizes */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {visualHeroTasks.map((task) => (
            <div
              key={task.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-2.5 sm:p-3 text-left transition duration-300 hover:border-emerald-400/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:bg-slate-850 shadow-md"
            >
              {/* Hover ambient glow */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-t from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition pointer-events-none" />

              <div>
                <div className="relative h-24 sm:h-32 w-full overflow-hidden rounded-xl bg-slate-800">
                  <img
                    src={task.image}
                    alt={task.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-1.5 left-1.5 flex flex-col gap-0.5">
                    <span className="rounded-md bg-slate-950/90 px-2 py-0.5 text-[9px] font-extrabold text-emerald-400 border border-emerald-500/40 shadow-sm">
                      +${task.rewardUSD.toFixed(2)} ({task.rewardTZS})
                    </span>
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 rounded-md bg-slate-950/80 px-1.5 py-0.5 text-[8px] font-bold text-slate-300">
                    ⏱ {task.time}
                  </span>
                </div>

                <div className="mt-2.5 relative z-10">
                  <p className="text-[11px] sm:text-xs font-bold text-white truncate group-hover:text-emerald-300">
                    {task.title}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium">{task.domain}</p>
                </div>
              </div>

              {/* CLEAR & PROMINENT 'START TASK' BUTTON */}
              <button
                id={`btn-visual-hero-start-${task.id}`}
                onClick={() => startTask(task.id)}
                className="relative z-10 mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-2 sm:py-2.5 text-[11px] font-extrabold text-white shadow-md shadow-emerald-500/25 transition duration-300 hover:brightness-110 active:scale-95 uppercase tracking-wide hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]"
              >
                <Play className="h-3 w-3 text-white fill-white" />
                <span>START TASK</span>
              </button>
            </div>
          ))}
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

            return (
              <div
                key={cat.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition-all hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:bg-slate-850"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
                      {cat.group}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400">
                      ${cat.rewardMin} – ${cat.rewardMax}
                    </span>
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

                  <button
                    id={`btn-home-start-cat-${cat.id}`}
                    onClick={() => handleStartCategory(cat.id)}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 uppercase tracking-wider hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                  >
                    <Play className="h-3 w-3 text-white fill-white" />
                    <span>START TASK</span>
                  </button>
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
