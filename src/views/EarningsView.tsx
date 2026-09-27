import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { EarningRecord } from '../types';
import {
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  FileText,
  ArrowRight,
  Info,
} from 'lucide-react';
import { formatTZS, formatUSD } from '../data/translations';

export const EarningsView: React.FC = () => {
  const { user, openActivationLink, setActiveTab, language, t } = useApp();

  const [earningsHistory, setEarningsHistory] = useState<EarningRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    apiService.getEarnings(user.id).then((res) => {
      if (isMounted) {
        if (res && res.history) {
          setEarningsHistory(res.history);
        }
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [user.id, user.balancePendingUSD]);

  const isActivated = user.accountStatus === 'activated';

  return (
    <div className="space-y-6 pb-16">
      {/* Title */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-8">
        <div className="max-w-xl space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Wallet className="h-4 w-4" />
            <span>{t.earnings.title}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            {language === 'sw' ? 'Salio Lako na Historia ya Mapato' : 'Verified Balances & Earnings Ledger'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {t.earnings.subtitle}
          </p>
        </div>
      </div>

      {/* Main Balances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Pending Balance */}
        <div className="relative rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-5 shadow-lg">
          <div className="flex items-center justify-between text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{t.earnings.pendingBalance}</span>
            </span>
            <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-300">
              Inasubiri
            </span>
          </div>

          <div className="font-display text-2xl sm:text-3xl font-black text-white">
            ${user.balancePendingUSD.toFixed(2)}
          </div>
          <div className="text-xs font-bold text-amber-300 mt-0.5">
            ≈ {formatTZS(user.balancePendingUSD)}
          </div>

          <p className="mt-3 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-2.5">
            {t.earnings.pendingDesc}
          </p>
        </div>

        {/* 2. Available Balance */}
        <div className="relative rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 p-5 shadow-lg">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>{t.earnings.availableBalance}</span>
            </span>
            <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-300">
              Tayari Kutoa
            </span>
          </div>

          <div className="font-display text-2xl sm:text-3xl font-black text-white">
            ${user.balanceAvailableUSD.toFixed(2)}
          </div>
          <div className="text-xs font-bold text-emerald-400 mt-0.5">
            ≈ {formatTZS(user.balanceAvailableUSD)}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2.5">
            <p className="text-xs text-slate-300">
              Min: $10.00 (TSh 26,000)
            </p>
            <button
              onClick={() => setActiveTab('withdraw')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
            >
              <span>{language === 'sw' ? 'Toa Sasa' : 'Withdraw'}</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* 3. Completed Chats & Sessions */}
        <div className="relative rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span>{t.earnings.completedSessions}</span>
              </span>
            </div>

            <div className="font-display text-2xl sm:text-3xl font-black text-white">
              {user.completedChatsCount}{' '}
              <span className="text-xs font-normal text-slate-400">sessions</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {user.chatMinutesCount} {language === 'sw' ? 'dakika zilizorekodiwa' : 'minutes logged'}
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
            {t.earnings.totalDesc}: <span className="font-bold text-white">${user.totalEarnedUSD.toFixed(2)}</span>
          </p>
        </div>
      </div>

      {/* Prominent Gusa Hapa Kufungua Account Box */}
      {!isActivated && (
        <div className="rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                <span>{language === 'sw' ? 'Fungua Akaunti Yako' : 'Activate Your Account'}</span>
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                {language === 'sw'
                  ? 'Hamisha salio lako la PENDING liwe AVAILABLE kutoa kwenye M-Pesa au Tigo Pesa'
                  : 'Transfer your PENDING balance to AVAILABLE for instant mobile money payout'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'sw'
                  ? 'Kukamilisha usajili na ku-activate akaunti yako inachukua dakika 1 tu. Malipo yako yote ya chat yatahamishwa mara moja.'
                  : 'Account activation takes just 1 minute. All your chat earnings will be unlocked immediately.'}
              </p>
            </div>

            <button
              onClick={openActivationLink}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-xs font-black uppercase text-slate-950 shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition cursor-pointer"
            >
              <span>{language === 'sw' ? '👉 GUSA HAPA KUFUNGUA ACCOUNT' : '👉 TAP HERE TO OPEN ACCOUNT'}</span>
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Official Platform Rules */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
        <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
          <Info className="h-4 w-4 text-emerald-400" />
          <span>{t.earnings.ruleTitle}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-300">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
            <span className="font-bold text-white block mb-1">⏱️ 1 Min Eligibility</span>
            <span>{t.earnings.rule1}</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
            <span className="font-bold text-white block mb-1">💵 Earning Rate</span>
            <span>{t.earnings.rule2}</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
            <span className="font-bold text-white block mb-1">🏦 Min Withdrawal</span>
            <span>{t.earnings.rule3}</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
            <span className="font-bold text-white block mb-1">🔒 Verification</span>
            <span>{t.earnings.rule4}</span>
          </div>
        </div>
      </div>

      {/* Earnings Ledger Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-400" />
            <h3 className="font-display text-sm font-bold text-white">
              {t.earnings.historyTitle}
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {earningsHistory.length} {language === 'sw' ? 'rekodi zilizothibitishwa' : 'verified records'}
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            {language === 'sw' ? 'Inapakia rekodi za mapato...' : 'Loading earnings ledger...'}
          </div>
        ) : earningsHistory.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <p className="text-xs">{t.earnings.emptyHistory}</p>
            <button
              onClick={() => setActiveTab('find')}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400"
            >
              {language === 'sw' ? 'Tafuta Mwenzi Sasa' : 'Find a Partner Now'}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">{t.earnings.partnerColumn}</th>
                  <th className="py-3 px-4">{t.earnings.durationColumn}</th>
                  <th className="py-3 px-4">{t.earnings.rewardColumn}</th>
                  <th className="py-3 px-4">{t.earnings.statusColumn}</th>
                  <th className="py-3 px-4">{t.earnings.dateColumn}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {earningsHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-850/50 transition">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-1.5">
                      <span>{item.partnerFlag || '🌍'}</span>
                      <span>{item.partnerName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {Math.max(1, Math.round(item.durationSeconds / 60))} min (60s)
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      {formatTZS(item.amountUSD)} ({formatUSD(item.amountUSD)})
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {item.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
