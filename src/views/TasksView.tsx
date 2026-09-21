import React, { useState } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Clock,
  Play,
  Image as ImageIcon,
  Volume2,
  Video,
  FileText,
  Bot,
  ShoppingBag,
  Database,
  Layout,
  HelpCircle,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TASK_CATEGORIES } from '../data/taskCategories';
import { TaskGroup } from '../types';
import { formatUSD, formatTZS } from '../data/translations';

export const TasksView: React.FC = () => {
  const {
    language,
    t,
    startTask,
    selectedCategoryId,
    setSelectedCategoryId,
    isTaskPaidToday,
  } = useApp();

  const isSw = language === 'sw';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const groups: { id: string; label: string; icon: any }[] = [
    { id: 'all', label: t.categoriesPage.allGroups, icon: Sparkles },
    { id: 'image', label: isSw ? 'Picha' : 'Image', icon: ImageIcon },
    { id: 'audio', label: isSw ? 'Sauti' : 'Audio', icon: Volume2 },
    { id: 'video', label: isSw ? 'Video' : 'Video', icon: Video },
    { id: 'text', label: isSw ? 'Maandishi' : 'Text', icon: FileText },
    { id: 'ai', label: isSw ? 'AI & LLM' : 'AI & LLM', icon: Bot },
    { id: 'product', label: isSw ? 'Bidhaa' : 'Product', icon: ShoppingBag },
    { id: 'data', label: isSw ? 'Data & Nyaraka' : 'Data', icon: Database },
    { id: 'ui', label: isSw ? 'UI & Tovuti' : 'UI & UX', icon: Layout },
    { id: 'survey', label: isSw ? 'Tafiti' : 'Surveys', icon: HelpCircle },
    { id: 'location', label: isSw ? 'Ramani' : 'Maps', icon: MapPin },
  ];

  const filteredCategories = TASK_CATEGORIES.filter((cat) => {
    // Group filter
    if (activeGroup !== 'all' && cat.group !== activeGroup) return false;

    // Difficulty filter
    if (difficultyFilter !== 'all' && cat.difficulty !== difficultyFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameEn = cat.name.en.toLowerCase();
      const nameSw = cat.name.sw.toLowerCase();
      const descEn = cat.description.en.toLowerCase();
      const descSw = cat.description.sw.toLowerCase();
      return (
        nameEn.includes(q) ||
        nameSw.includes(q) ||
        descEn.includes(q) ||
        descSw.includes(q) ||
        cat.group.includes(q)
      );
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
            <Bot className="h-3.5 w-3.5" />
            <span>55+ Active AI Evaluation Pipelines</span>
          </div>
          <h1 className="font-display mt-3 text-2xl sm:text-3xl font-extrabold text-white">
            {t.categoriesPage.title}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            {t.categoriesPage.subtitle}
          </p>
        </div>

        {/* Search & Difficulty Filter */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="input-search-tasks"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.categoriesPage.searchPlaceholder}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <select
              id="select-difficulty-filter"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">{isSw ? 'Viwango Vyote' : 'All Difficulties'}</option>
              <option value="easy">{isSw ? 'Rahisi (Easy)' : 'Easy'}</option>
              <option value="medium">{isSw ? 'Wastani (Medium)' : 'Medium'}</option>
              <option value="hard">{isSw ? 'Kina (Hard)' : 'Hard'}</option>
            </select>
          </div>
        </div>

        {/* Category Horizontal Pill Filters */}
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {groups.map((grp) => {
            const Icon = grp.icon;
            const isActive = activeGroup === grp.id;
            return (
              <button
                key={grp.id}
                id={`btn-group-${grp.id}`}
                onClick={() => setActiveGroup(grp.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{grp.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories Grid (55+ items) */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-400">
            {isSw ? 'Inaonyesha makundi' : 'Showing'} {filteredCategories.length} {isSw ? 'ya kazi' : 'categories'}
          </p>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-slate-500 mb-2" />
            <p className="text-sm font-semibold text-slate-300">
              {t.taskEngine.noTasksFound}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {filteredCategories.map((cat, idx) => {
              const catName = isSw ? cat.name.sw : cat.name.en;
              const catDesc = isSw ? cat.description.sw : cat.description.en;
              
              // Curated high-res category preview image so every category has an image
              const fallbackImages: Record<string, string[]> = {
                image: [
                  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f8?w=500&auto=format&fit=crop&q=80',
                ],
                audio: [
                  'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=500&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&auto=format&fit=crop&q=80',
                ],
                video: [
                  'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=500&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500&auto=format&fit=crop&q=80',
                ],
                text: [
                  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=500&auto=format&fit=crop&q=80',
                ],
                ai: [
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=80',
                ],
                product: [
                  'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=80',
                ],
                data: [
                  'https://images.unsplash.com/photo-1568667256549-094345857637?w=500&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=80',
                ],
                ui: [
                  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=80',
                ],
                survey: [
                  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&auto=format&fit=crop&q=80',
                ],
                location: [
                  'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=500&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=500&auto=format&fit=crop&q=80',
                ],
              };

              const groupImgs = fallbackImages[cat.group] || fallbackImages.image;
              const catImg = cat.image || groupImgs[idx % groupImgs.length];
              const isPaid = isTaskPaidToday(cat.id);

              return (
                <div
                  key={cat.id}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-3 sm:p-4 transition-all shadow-sm ${
                    isPaid
                      ? 'border-emerald-500/40 bg-slate-900/75 opacity-90'
                      : 'border-slate-800 bg-slate-900/90 hover:border-emerald-500/50 hover:bg-slate-850'
                  }`}
                >
                  {isPaid && (
                    <div className="absolute top-0 right-0 z-20 bg-emerald-600 text-white font-black text-[9px] uppercase px-2.5 py-0.5 rounded-bl-lg tracking-wider shadow flex items-center gap-1">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      <span>PAID</span>
                    </div>
                  )}

                  <div>
                    {/* Task Category Image Banner */}
                    <div className="relative h-24 sm:h-32 w-full overflow-hidden rounded-xl bg-slate-800 mb-3">
                      <img
                        src={catImg}
                        alt={catName}
                        onError={(e) => {
                          const fallback = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80';
                          if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                        }}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-2 left-2 rounded-lg bg-slate-950/80 px-2 py-0.5 text-[9px] font-bold text-emerald-300 uppercase tracking-wider border border-emerald-500/30">
                        {cat.group}
                      </span>
                      <div className="absolute bottom-2 right-2 rounded-lg bg-slate-950/90 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-500/40">
                        ${cat.rewardMin.toFixed(1)} – ${cat.rewardMax.toFixed(1)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">
                        ≈ {formatTZS(cat.rewardMax)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        ⏱ {cat.timeEst}
                      </span>
                    </div>

                    <h3 className="font-display mt-2 text-sm font-bold text-white group-hover:text-emerald-300 line-clamp-1">
                      {catName}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {catDesc}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {cat.availableCount} {isSw ? 'kazi' : 'tasks'}
                    </span>

                    {isPaid ? (
                      <button
                        id={`btn-tasks-page-paid-${cat.id}`}
                        disabled
                        className="flex items-center gap-1 rounded-xl bg-slate-800 border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-400 cursor-not-allowed uppercase tracking-wide shadow-sm"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>PAID</span>
                      </button>
                    ) : (
                      <button
                        id={`btn-tasks-page-start-${cat.id}`}
                        onClick={() => startTask(cat.id)}
                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 uppercase tracking-wide"
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
        )}
      </div>
    </div>
  );
};
