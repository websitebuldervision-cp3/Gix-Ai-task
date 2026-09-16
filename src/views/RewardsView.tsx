import React, { useState } from 'react';
import {
  Wallet,
  Clock,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  CreditCard,
  Smartphone,
  Building,
  Info,
  DollarSign,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatUSD, formatTZS, ACTIVATION_URL } from '../data/translations';

export const RewardsView: React.FC = () => {
  const { language, t, user, submissions } = useApp();
  const isSw = language === 'sw';

  const [withdrawAmount, setWithdrawAmount] = useState('40');
  const [provider, setProvider] = useState('mpesa');
  const [recipientNumber, setRecipientNumber] = useState('0712345678');

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
            <Wallet className="h-3.5 w-3.5" />
            <span>{isSw ? 'Kituo cha Malipo na Salio' : 'Reward Ledger & Balances'}</span>
          </div>
          <h1 className="font-display mt-3 text-2xl sm:text-3xl font-extrabold text-white">
            {t.balances.title}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            {t.balances.subtitle}
          </p>
        </div>
      </div>

      {/* 3 PROFESSIONAL BALANCE SECTIONS (Section 12 Requirements) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. PENDING REWARDS */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-slate-900/90 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {t.balances.pendingCard.title}
            </span>
            <Clock className="h-5 w-5 text-amber-400" />
          </div>

          <p className="font-display mt-3 text-3xl font-extrabold text-white">
            {formatUSD(user.balancePendingUSD)}
          </p>
          <p className="mt-1 text-xs font-bold text-amber-300">
            ≈ {formatTZS(user.balancePendingUSD)}
          </p>

          <p className="mt-3 border-t border-slate-800 pt-2.5 text-xs text-slate-400 leading-relaxed">
            {t.balances.pendingCard.desc}
          </p>
        </div>

        {/* 2. AVAILABLE BALANCE */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/20 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {t.balances.availableCard.title}
            </span>
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>

          <p className="font-display mt-3 text-3xl font-extrabold text-emerald-400">
            {formatUSD(user.balanceAvailableUSD)}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-200">
            ≈ {formatTZS(user.balanceAvailableUSD)}
          </p>

          <p className="mt-3 border-t border-slate-800 pt-2.5 text-xs text-slate-400 leading-relaxed">
            {t.balances.availableCard.desc}
          </p>
        </div>

        {/* 3. TOTAL EARNED */}
        <div className="relative overflow-hidden rounded-2xl border border-teal-500/30 bg-slate-900/90 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              {t.balances.totalCard.title}
            </span>
            <TrendingUp className="h-5 w-5 text-teal-400" />
          </div>

          <p className="font-display mt-3 text-3xl font-extrabold text-teal-300">
            {formatUSD(user.totalEarnedUSD)}
          </p>
          <p className="mt-1 text-xs font-bold text-slate-400">
            ≈ {formatTZS(user.totalEarnedUSD)}
          </p>

          <p className="mt-3 border-t border-slate-800 pt-2.5 text-xs text-slate-400 leading-relaxed">
            {t.balances.totalCard.desc}
          </p>
        </div>
      </div>

      {/* WITHDRAWAL CENTER (Section 14 Requirements) */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400">
            <DollarSign className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-white">
              {t.withdraw.title}
            </h2>
            <p className="text-xs text-slate-400">{t.withdraw.subtitle}</p>
          </div>
        </div>

        {/* Condition Gate if Not Activated */}
        {user.accountStatus !== 'activated' ? (
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-base font-bold text-white">
                  {isSw ? 'Uthibitishaji wa Akaunti Unahitajika' : 'Account Activation Required'}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {t.withdraw.noticeNotActivated}
                </p>
                <div className="mt-2 text-xs font-bold text-amber-300">
                  {t.withdraw.feeReminder}
                </div>

                <div className="mt-4">
                  <a
                    id="btn-withdraw-activate-gate"
                    href={ACTIVATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 hover:scale-105 active:scale-95"
                  >
                    <span>{t.withdraw.activateBtn}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {t.withdraw.chooseProvider}
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white"
                >
                  <option value="mpesa">M-Pesa (Vodacom Tanzania)</option>
                  <option value="tigo">Tigo Pesa (Yas)</option>
                  <option value="airtel">Airtel Money</option>
                  <option value="halopesa">HaloPesa</option>
                  <option value="bank">CRDB / NMB Bank</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {t.withdraw.enterPhone}
                </label>
                <input
                  type="text"
                  value={recipientNumber}
                  onChange={(e) => setRecipientNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {t.withdraw.enterAmount} (USD)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <button
              id="btn-request-payout"
              className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500"
            >
              {t.withdraw.withdrawBtn}
            </button>
          </div>
        )}
      </div>

      {/* REWARD HISTORY LEDGER (Section 18 Requirements) */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8">
        <h2 className="font-display text-lg sm:text-xl font-bold text-white">
          {t.rewardsPage.title}
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          {t.rewardsPage.subtitle}
        </p>

        <div className="mt-5 divide-y divide-slate-800">
          {submissions.map((sub) => {
            const taskTitle = isSw ? sub.taskTitle.sw : sub.taskTitle.en;
            return (
              <div
                key={sub.id}
                className="flex items-center justify-between py-3.5"
              >
                <div>
                  <p className="font-display text-xs sm:text-sm font-bold text-white">
                    {taskTitle}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {sub.submittedAt} •{' '}
                    <span className="text-teal-400 font-medium">
                      {isSw ? sub.categoryName.sw : sub.categoryName.en}
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-display text-sm font-bold text-emerald-400 block">
                    +{formatUSD(sub.rewardUSD)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatTZS(sub.rewardUSD)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
