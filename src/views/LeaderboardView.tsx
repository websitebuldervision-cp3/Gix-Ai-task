import React from 'react';
import { Trophy, Medal, Award, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LEADERBOARD_USERS } from '../data/leaderboardData';
import { formatUSD, formatTZS } from '../data/translations';

export const LeaderboardView: React.FC = () => {
  const { language, t, user } = useApp();
  const isSw = language === 'sw';

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">
            <Trophy className="h-3.5 w-3.5" />
            <span>{isSw ? 'Top AI Contributors' : 'Global Contributor Benchmarks'}</span>
          </div>
          <h1 className="font-display mt-3 text-2xl sm:text-3xl font-extrabold text-white">
            {t.leaderboardPage.title}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            {t.leaderboardPage.subtitle}
          </p>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {LEADERBOARD_USERS.slice(0, 3).map((item, idx) => {
          const colors = [
            'border-amber-400/40 bg-gradient-to-b from-amber-950/30 to-slate-900 text-amber-400',
            'border-slate-400/40 bg-gradient-to-b from-slate-800/40 to-slate-900 text-slate-300',
            'border-amber-700/40 bg-gradient-to-b from-amber-950/20 to-slate-900 text-amber-600',
          ];
          const rankIcons = ['🥇', '🥈', '🥉'];

          return (
            <div
              key={item.rank}
              className={`rounded-2xl border p-4 sm:p-5 shadow-sm text-center flex flex-col justify-between ${colors[idx]}`}
            >
              <div>
                <span className="text-3xl">{rankIcons[idx]}</span>
                <p className="font-display mt-2 text-base font-extrabold text-white">
                  {item.username}
                </p>
                <p className="text-[11px] text-slate-400 font-medium">
                  {item.country}
                </p>
                {item.badge && (
                  <span className="mt-1.5 inline-block rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </div>

              <div className="mt-4 border-t border-slate-800/80 pt-3">
                <p className="text-xs text-slate-400">
                  <span className="font-bold text-white">{item.tasksCompleted}</span> {isSw ? 'Kazi Zilizofanywa' : 'Tasks Completed'}
                </p>
                <p className="font-display mt-1 text-sm font-extrabold text-emerald-400">
                  {formatUSD(item.acceptedRewardsUSD)}
                </p>
                <p className="text-[10px] text-slate-400">
                  ≈ {formatTZS(item.acceptedRewardsUSD)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 sm:p-6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pl-2">{t.leaderboardPage.rank}</th>
                <th className="pb-3">{t.leaderboardPage.contributor}</th>
                <th className="pb-3 text-center">{t.leaderboardPage.tasksCompleted}</th>
                <th className="pb-3 text-right pr-2">{t.leaderboardPage.acceptedRewards}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {LEADERBOARD_USERS.map((usr) => (
                <tr key={usr.rank} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 pl-2 font-display font-bold text-slate-300">
                    #{usr.rank}
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-300">
                        {usr.username.slice(0, 2)}
                      </div>
                      <div>
                        <span className="font-bold text-white block">
                          {usr.username}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {usr.country}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-center font-semibold text-slate-200">
                    {usr.tasksCompleted}
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    <span className="font-display font-bold text-emerald-400 block">
                      {formatUSD(usr.acceptedRewardsUSD)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatTZS(usr.acceptedRewardsUSD)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
