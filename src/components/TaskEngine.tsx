import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Clock,
  HelpCircle,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Check,
  ZoomIn,
  ShieldCheck,
  Layers,
  ArrowRight,
  ExternalLink,
  Headphones,
  Radio,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUSD, formatTZS } from '../data/translations';
import { voicePlayer } from '../utils/voicePlayer';

export const TaskEngine: React.FC = () => {
  const { language, t, currentTask, closeTask, submitTask } = useApp();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlayingA, setIsPlayingA] = useState(false);
  const [isPlayingB, setIsPlayingB] = useState(false);
  const [progressA, setProgressA] = useState(0);
  const [progressB, setProgressB] = useState(0);
  const [timeA, setTimeA] = useState(0);
  const [timeB, setTimeB] = useState(0);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  // Stop voice when task closes or changes
  useEffect(() => {
    return () => {
      voicePlayer.stop();
    };
  }, [currentTask?.id]);

  if (!currentTask) return null;

  const isSw = language === 'sw';
  const categoryTitle = isSw ? currentTask.categoryName.sw : currentTask.categoryName.en;
  const taskTitle = isSw ? currentTask.title.sw : currentTask.title.en;
  const taskDesc = isSw ? currentTask.description.sw : currentTask.description.en;

  const handlePlayA = () => {
    if (isPlayingA) {
      voicePlayer.stop();
      setIsPlayingA(false);
      return;
    }

    voicePlayer.stop();
    setIsPlayingB(false);
    setIsPlayingA(true);
    setProgressA(0);
    setTimeA(0);

    const speechText =
      currentTask.media.itemA?.speechText?.[language] ||
      currentTask.media.itemA?.text ||
      (currentTask.media.promptOrContext ? (isSw ? currentTask.media.promptOrContext.sw : currentTask.media.promptOrContext.en) : '') ||
      (isSw
        ? 'Karibu kwenye mfumo wa akili bandia. Sauti hii inakaguliwa kwa ubora na uwazi wa matamshi.'
        : 'Welcome to the artificial intelligence benchmark. This audio clip is being tested for prosody and clarity.');

    voicePlayer.playVoice({
      trackId: 'track_a',
      text: speechText,
      language: language,
      voiceStyle: currentTask.media.itemA?.voiceStyle || 'natural',
      onProgress: (p, elapsed) => {
        setProgressA(p);
        setTimeA(elapsed);
      },
      onEnd: () => {
        setIsPlayingA(false);
        setProgressA(1);
      },
    });
  };

  const handlePlayB = () => {
    if (isPlayingB) {
      voicePlayer.stop();
      setIsPlayingB(false);
      return;
    }

    voicePlayer.stop();
    setIsPlayingA(false);
    setIsPlayingB(true);
    setProgressB(0);
    setTimeB(0);

    const speechText =
      currentTask.media.itemB?.speechText?.[language] ||
      currentTask.media.itemB?.text ||
      (currentTask.media.promptOrContext ? (isSw ? currentTask.media.promptOrContext.sw : currentTask.media.promptOrContext.en) : '') ||
      (isSw
        ? 'Karibu kwenye mfumo wa akili bandia. Sauti hii inakaguliwa kwa ubora na uwazi wa matamshi.'
        : 'Welcome to the artificial intelligence benchmark. This audio clip is being tested for prosody and clarity.');

    voicePlayer.playVoice({
      trackId: 'track_b',
      text: speechText,
      language: language,
      voiceStyle: currentTask.media.itemB?.voiceStyle || 'robotic',
      onProgress: (p, elapsed) => {
        setProgressB(p);
        setTimeB(elapsed);
      },
      onEnd: () => {
        setIsPlayingB(false);
        setProgressB(1);
      },
    });
  };

  const handleClose = () => {
    voicePlayer.stop();
    closeTask();
  };

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    voicePlayer.stop();
    setIsSubmitting(true);
    setTimeout(() => {
      submitTask(selectedOptionId);
      setIsSubmitting(false);
    }, 900); // Realistic AI verification delay
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Top Sticky Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-500/20">
              {categoryTitle}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="h-3 w-3 text-slate-400" />
              <span>~{currentTask.estimatedSeconds}s</span>
            </div>
          </div>

          <button
            id="btn-close-task-engine"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Question / Title */}
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-white leading-snug">
              {taskTitle}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              {taskDesc}
            </p>
          </div>

          {/* Instructions Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <HelpCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>{t.taskEngine.instructions}</span>
            </div>
            <ul className="mt-2 space-y-1.5 text-xs text-slate-400">
              {currentTask.instructions.map((inst, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-emerald-400">•</span>
                  <span>{isSw ? inst.sw : inst.en}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Context Tag if present */}
          {currentTask.media.promptOrContext && (
            <div className="rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs font-mono text-emerald-300">
              {isSw
                ? currentTask.media.promptOrContext.sw
                : currentTask.media.promptOrContext.en}
            </div>
          )}

          {/* Dynamic Media Section */}
          {currentTask.media.type === 'image_duo' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Image A */}
              <div className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2">
                <div className="flex items-center justify-between pb-1.5 px-1">
                  <span className="text-xs font-bold text-emerald-400">
                    {isSw ? currentTask.media.itemA?.label?.sw || 'Picha A' : currentTask.media.itemA?.label?.en || 'Image A'}
                  </span>
                  <button
                    onClick={() => setZoomedImage(currentTask.media.itemA?.url || null)}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
                  >
                    <ZoomIn className="h-3 w-3" />
                    <span>{t.taskEngine.zoomImage}</span>
                  </button>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900">
                  <img
                    src={currentTask.media.itemA?.url}
                    alt="Sample A"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {currentTask.media.itemA?.meta && (
                  <p className="mt-1.5 text-[10px] text-slate-400 px-1 font-mono">
                    {currentTask.media.itemA.meta}
                  </p>
                )}
              </div>

              {/* Image B */}
              <div className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2">
                <div className="flex items-center justify-between pb-1.5 px-1">
                  <span className="text-xs font-bold text-indigo-400">
                    {isSw ? currentTask.media.itemB?.label?.sw || 'Picha B' : currentTask.media.itemB?.label?.en || 'Image B'}
                  </span>
                  <button
                    onClick={() => setZoomedImage(currentTask.media.itemB?.url || null)}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
                  >
                    <ZoomIn className="h-3 w-3" />
                    <span>{t.taskEngine.zoomImage}</span>
                  </button>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900">
                  <img
                    src={currentTask.media.itemB?.url}
                    alt="Sample B"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {currentTask.media.itemB?.meta && (
                  <p className="mt-1.5 text-[10px] text-slate-400 px-1 font-mono">
                    {currentTask.media.itemB.meta}
                  </p>
                )}
              </div>
            </div>
          )}

          {currentTask.media.type === 'image_single' && (
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2">
              <div className="flex items-center justify-between pb-1.5 px-1">
                <span className="text-xs font-bold text-emerald-400">
                  {isSw ? currentTask.media.itemA?.label?.sw : currentTask.media.itemA?.label?.en}
                </span>
                <span className="text-[10px] text-slate-400">
                  {currentTask.media.itemA?.meta}
                </span>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden bg-slate-900">
                <img
                  src={currentTask.media.itemA?.url}
                  alt="Single inspection"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )}

          {currentTask.media.type === 'ai_chat_duo' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                <span className="inline-block rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20 mb-2">
                  {isSw ? currentTask.media.itemA?.label?.sw || 'Jibu la AI A' : currentTask.media.itemA?.label?.en || 'AI Response A'}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {currentTask.media.itemA?.text}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                <span className="inline-block rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-bold text-indigo-400 border border-indigo-500/20 mb-2">
                  {isSw ? currentTask.media.itemB?.label?.sw || 'Jibu la AI B' : currentTask.media.itemB?.label?.en || 'AI Response B'}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {currentTask.media.itemB?.text}
                </p>
              </div>
            </div>
          )}

          {currentTask.media.type === 'audio_duo' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                  <Headphones className="h-4 w-4 text-emerald-400" />
                  <span>{isSw ? 'Kicheza Sauti Halisi cha AI (Real Audio Playback)' : 'Real AI Speech Playback'}</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400/90 flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                  <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
                  <span>{isSw ? 'Sauti Halisi ya AI' : 'Live Speech Output'}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Audio Track A Card */}
                <div className={`rounded-xl border p-3.5 transition-all duration-200 ${
                  isPlayingA
                    ? 'border-emerald-500/80 bg-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/50'
                    : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                }`}>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-400">
                        {isSw ? currentTask.media.itemA?.label?.sw : currentTask.media.itemA?.label?.en}
                      </span>
                    </div>

                    <button
                      id="btn-play-audio-a"
                      onClick={handlePlayA}
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-lg transition-all active:scale-95 ${
                        isPlayingA
                          ? 'bg-rose-600 hover:bg-rose-500 ring-4 ring-rose-500/20'
                          : 'bg-emerald-600 hover:bg-emerald-500 ring-4 ring-emerald-500/20'
                      }`}
                    >
                      {isPlayingA ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                    </button>
                  </div>

                  {/* Spoken Script Box */}
                  <div className="rounded-lg bg-slate-900/90 border border-slate-800/80 p-2.5 mb-2.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      {isSw ? 'Maneno Yanayosomwa:' : 'Spoken Voice Script:'}
                    </span>
                    <p className="text-xs text-slate-200 font-sans italic leading-relaxed">
                      "{isSw
                        ? (currentTask.media.itemA?.speechText?.sw || currentTask.media.itemA?.text || currentTask.media.promptOrContext?.sw)
                        : (currentTask.media.itemA?.speechText?.en || currentTask.media.itemA?.text || currentTask.media.promptOrContext?.en)}"
                    </p>
                  </div>

                  {/* Animated Waveform / Equalizer */}
                  <div className="flex h-10 items-center gap-1 rounded-lg bg-slate-900 px-2.5 border border-slate-800">
                    <Volume2 className={`h-3.5 w-3.5 shrink-0 ${isPlayingA ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                    <div className="flex-1 flex items-center gap-1 h-6">
                      {[40, 75, 95, 60, 35, 85, 100, 50, 70, 90, 45, 80, 60, 75, 40].map((h, i) => (
                        <div
                          key={i}
                          style={{
                            height: `${isPlayingA ? Math.max(15, Math.min(100, h * (0.4 + Math.random() * 0.6))) : 20}%`,
                          }}
                          className={`flex-1 rounded-full transition-all duration-150 ${
                            isPlayingA ? 'bg-gradient-to-t from-emerald-500 to-teal-300' : 'bg-slate-700/60'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {isPlayingA ? `${Math.floor(timeA)}s` : '0:06'}
                    </span>
                  </div>

                  {/* Scrubber Progress Bar */}
                  <div className="mt-2 h-1 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-100 rounded-full"
                      style={{ width: `${progressA * 100}%` }}
                    />
                  </div>

                  {currentTask.media.itemA?.meta && (
                    <p className="mt-2 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                      <span>{currentTask.media.itemA.meta}</span>
                      {isPlayingA && <span className="text-emerald-400 font-bold animate-pulse">● Playing</span>}
                    </p>
                  )}
                </div>

                {/* Audio Track B Card */}
                <div className={`rounded-xl border p-3.5 transition-all duration-200 ${
                  isPlayingB
                    ? 'border-indigo-500/80 bg-slate-950 shadow-[0_0_20px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/50'
                    : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                }`}>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
                      <span className="text-xs font-bold text-indigo-400">
                        {isSw ? currentTask.media.itemB?.label?.sw : currentTask.media.itemB?.label?.en}
                      </span>
                    </div>

                    <button
                      id="btn-play-audio-b"
                      onClick={handlePlayB}
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-lg transition-all active:scale-95 ${
                        isPlayingB
                          ? 'bg-rose-600 hover:bg-rose-500 ring-4 ring-rose-500/20'
                          : 'bg-indigo-600 hover:bg-indigo-500 ring-4 ring-indigo-500/20'
                      }`}
                    >
                      {isPlayingB ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                    </button>
                  </div>

                  {/* Spoken Script Box */}
                  <div className="rounded-lg bg-slate-900/90 border border-slate-800/80 p-2.5 mb-2.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      {isSw ? 'Maneno Yanayosomwa:' : 'Spoken Voice Script:'}
                    </span>
                    <p className="text-xs text-slate-200 font-sans italic leading-relaxed">
                      "{isSw
                        ? (currentTask.media.itemB?.speechText?.sw || currentTask.media.itemB?.text || currentTask.media.promptOrContext?.sw)
                        : (currentTask.media.itemB?.speechText?.en || currentTask.media.itemB?.text || currentTask.media.promptOrContext?.en)}"
                    </p>
                  </div>

                  {/* Animated Waveform / Equalizer */}
                  <div className="flex h-10 items-center gap-1 rounded-lg bg-slate-900 px-2.5 border border-slate-800">
                    <Volume2 className={`h-3.5 w-3.5 shrink-0 ${isPlayingB ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`} />
                    <div className="flex-1 flex items-center gap-1 h-6">
                      {[30, 50, 70, 45, 25, 75, 85, 60, 50, 65, 45, 70, 50, 60, 30].map((h, i) => (
                        <div
                          key={i}
                          style={{
                            height: `${isPlayingB ? Math.max(15, Math.min(100, h * (0.4 + Math.random() * 0.6))) : 20}%`,
                          }}
                          className={`flex-1 rounded-full transition-all duration-150 ${
                            isPlayingB ? 'bg-gradient-to-t from-indigo-500 to-sky-300' : 'bg-slate-700/60'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {isPlayingB ? `${Math.floor(timeB)}s` : '0:06'}
                    </span>
                  </div>

                  {/* Scrubber Progress Bar */}
                  <div className="mt-2 h-1 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-100 rounded-full"
                      style={{ width: `${progressB * 100}%` }}
                    />
                  </div>

                  {currentTask.media.itemB?.meta && (
                    <p className="mt-2 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                      <span>{currentTask.media.itemB.meta}</span>
                      {isPlayingB && <span className="text-indigo-400 font-bold animate-pulse">● Playing</span>}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentTask.media.type === 'product_duo' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-xs font-bold text-emerald-400 block mb-1">
                  {isSw ? currentTask.media.itemA?.label?.sw : currentTask.media.itemA?.label?.en}
                </span>
                {currentTask.media.itemA?.url && (
                  <img
                    src={currentTask.media.itemA.url}
                    alt="Product A"
                    className="h-28 w-full object-cover rounded-lg mb-2"
                    referrerPolicy="no-referrer"
                  />
                )}
                <p className="text-xs font-medium text-slate-200">
                  {currentTask.media.itemA?.text}
                </p>
                <p className="mt-1 text-[11px] text-emerald-400 font-mono">
                  {currentTask.media.itemA?.meta}
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                <span className="text-xs font-bold text-indigo-400 block mb-1">
                  {isSw ? currentTask.media.itemB?.label?.sw : currentTask.media.itemB?.label?.en}
                </span>
                {currentTask.media.itemB?.url && (
                  <img
                    src={currentTask.media.itemB.url}
                    alt="Product B"
                    className="h-28 w-full object-cover rounded-lg mb-2"
                    referrerPolicy="no-referrer"
                  />
                )}
                <p className="text-xs font-medium text-slate-200">
                  {currentTask.media.itemB?.text}
                </p>
                <p className="mt-1 text-[11px] text-indigo-400 font-mono">
                  {currentTask.media.itemB?.meta}
                </p>
              </div>
            </div>
          )}

          {currentTask.media.type === 'data_table' && currentTask.media.itemA?.details && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <span className="text-xs font-bold text-indigo-300 block mb-2">
                {isSw ? currentTask.media.itemA.label?.sw : currentTask.media.itemA.label?.en}
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(currentTask.media.itemA.details).map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-slate-900 p-2 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">{k}</span>
                    <span className="font-semibold text-white">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Options Selection */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-300 block">
              {t.taskEngine.whichOption}
            </label>

            <div className="space-y-2">
              {currentTask.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const optLabel = isSw ? opt.label.sw : opt.label.en;
                const optSubLabel = opt.subLabel ? (isSw ? opt.subLabel.sw : opt.subLabel.en) : null;

                return (
                  <button
                    key={opt.id}
                    id={`opt-btn-${opt.id}`}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/40 shadow-md ring-1 ring-emerald-500'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-600 text-white'
                          : 'border-slate-600 bg-slate-900'
                      }`}
                    >
                      {isSelected && <Check className="h-2.5 w-2.5" />}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-100">
                        {optLabel}
                      </p>
                      {optSubLabel && (
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {optSubLabel}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer with Reward & Submit Button */}
        <div className="border-t border-slate-800 bg-slate-950 px-4 py-3.5 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Reward Display */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <div className="text-left">
              <span className="text-[11px] font-medium text-slate-400 block">
                {t.taskEngine.reward}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-lg font-bold text-emerald-400">
                  {formatUSD(currentTask.rewardUSD)}
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  ≈ {formatTZS(currentTask.rewardUSD)}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button
            id="btn-submit-task-answer"
            disabled={!selectedOptionId || isSubmitting}
            onClick={handleSubmit}
            className={`flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-xs font-bold transition-all shadow-lg ${
              selectedOptionId && !isSubmitting
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-95 shadow-emerald-500/20 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>{t.taskEngine.submitting}</span>
              </>
            ) : (
              <>
                <span>{t.taskEngine.submitAnswer}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Zoom Lightbox */}
        {zoomedImage && (
          <div
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/95 p-4 cursor-pointer"
          >
            <img
              src={zoomedImage}
              alt="Zoomed Detail"
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>
    </div>
  );
};
