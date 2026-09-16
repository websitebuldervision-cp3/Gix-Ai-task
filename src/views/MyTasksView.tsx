import React, { useState } from 'react';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUSD, formatTZS } from '../data/translations';

export const MyTasksView: React.FC = () => {
  const { language, t, submissions, startTask } = useApp();
  const isSw = language === 'sw';
  const [filter, setFilter] = useState<'all' | 'pending' | 'under_review' | 'accepted'>('all');

  const filteredSubmissions = submissions.filter((sub) => {
    if (filter === 'all') return true;
    return sub.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            {t.status.accepted}
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-400 border border-amber-500/20">
            <Clock className="h-3 w-3" />
            {t.status.underReview}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/10 px-2.5 py-0.5 text-[11px] font-bold text-teal-300 border border-teal-500/20">
            <Clock className="h-3 w-3" />
            {t.status.pendingReview}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
              <ClipboardList className="h-3.5 w-3.5" />
              <span>{isSw ? 'Task Submissions' : 'Task Audit Trail'}</span>
            </div>
            <h1 className="font-display mt-3 text-2xl sm:text-3xl font-extrabold text-white">
              {t.myTasksPage.title}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              {t.myTasksPage.subtitle}
            </p>
          </div>

          <button
            id="btn-my-tasks-start-new"
            onClick={() => startTask()}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 active:scale-95 shadow-emerald-500/20"
          >
            <span>{isSw ? 'Start Next Task' : 'Start Next Task'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            id="filter-all-tasks"
            onClick={() => setFilter('all')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t.myTasksPage.filterAll} ({submissions.length})
          </button>
          <button
            id="filter-pending-tasks"
            onClick={() => setFilter('pending')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              filter === 'pending'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t.myTasksPage.filterPending} (
            {submissions.filter((s) => s.status === 'pending').length})
          </button>
          <button
            id="filter-under-review-tasks"
            onClick={() => setFilter('under_review')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              filter === 'under_review'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t.myTasksPage.filterUnderReview} (
            {submissions.filter((s) => s.status === 'under_review').length})
          </button>
          <button
            id="filter-accepted-tasks"
            onClick={() => setFilter('accepted')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              filter === 'accepted'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t.myTasksPage.filterAccepted} (
            {submissions.filter((s) => s.status === 'accepted').length})
          </button>
        </div>
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
          <ClipboardList className="mx-auto h-8 w-8 text-slate-500 mb-2" />
          <p className="text-sm font-semibold text-slate-300">
            {t.myTasksPage.empty}
          </p>
          <button
            onClick={() => startTask()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500"
          >
            <span>{t.myTasksPage.startNow}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredSubmissions.map((sub) => {
            const taskTitle = isSw ? sub.taskTitle.sw : sub.taskTitle.en;
            const catName = isSw ? sub.categoryName.sw : sub.categoryName.en;
            const optLabel = isSw
              ? sub.selectedOptionLabel.sw
              : sub.selectedOptionLabel.en;

            return (
              <div
                key={sub.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 transition-all hover:border-slate-700 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-teal-500/10 px-2 py-0.5 text-[10px] font-bold text-teal-300 border border-teal-500/20">
                        {catName}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {sub.submittedAt}
                      </span>
                    </div>

                    <h3 className="font-display mt-1.5 text-sm font-bold text-white">
                      {taskTitle}
                    </h3>

                    <p className="mt-1 text-xs text-slate-300">
                      <span className="text-slate-400 font-medium">
                        {isSw ? 'Jibu lililochaguliwa:' : 'Submitted answer:'}{' '}
                      </span>
                      <span className="font-semibold text-teal-300">{optLabel}</span>
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="font-display text-base font-bold text-emerald-400 block">
                        {formatUSD(sub.rewardUSD)}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ≈ {formatTZS(sub.rewardUSD)}
                      </span>
                    </div>

                    <div className="sm:mt-2">
                      {getStatusBadge(sub.status)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
