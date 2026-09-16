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
            {filteredCategories.map((cat) => {
              const catName = isSw ? cat.name.sw : cat.name.en;
              const catDesc = isSw ? cat.description.sw : cat.description.en;

              return (
                <div
                  key={cat.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-4 transition-all hover:border-emerald-500/50 hover:bg-slate-850 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                        {cat.group}
                      </span>
                      <div className="text-right">
                        <span className="font-display text-xs font-bold text-emerald-400 block">
                          ${cat.rewardMin.toFixed(1)} – ${cat.rewardMax.toFixed(1)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          ≈ {formatTZS(cat.rewardMax)}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-display mt-3 text-sm font-bold text-white group-hover:text-emerald-300">
                      {catName}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {catDesc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {cat.timeEst}
                      </span>
                      <span>•</span>
                      <span>{cat.availableCount} {isSw ? 'kazi' : 'tasks'}</span>
                    </div>

                    <button
                      id={`btn-tasks-page-start-${cat.id}`}
                      onClick={() => startTask(cat.id)}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 uppercase tracking-wide"
                    >
                      <Play className="h-3 w-3 text-white fill-white" />
                      <span>START TASK</span>
                    </button>
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
