import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { WithdrawalRequest } from '../types';
import {
  ArrowUpRight,
  ShieldAlert,
  Wallet,
  CheckCircle2,
  Clock,
  ExternalLink,
  AlertCircle,
  Building2,
  Smartphone,
} from 'lucide-react';
import { formatTZS, formatUSD, USD_TO_TZS_RATE } from '../data/translations';

export const WithdrawView: React.FC = () => {
  const { user, openActivationLink, language, t } = useApp();

  const isActivated = user.accountStatus === 'activated';

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [method, setMethod] = useState<'mpesa' | 'tigopesa' | 'airtel' | 'halopesa' | 'bank'>('mpesa');
  const [phoneOrAccount, setPhoneOrAccount] = useState('');
  const [accountName, setAccountName] = useState(user.fullName || '');
  const [amountUSD, setAmountUSD] = useState('10.00');

  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const loadWithdrawals = async () => {
    const list = await apiService.getWithdrawals(user.id);
    setWithdrawals(list);
  };

  useEffect(() => {
    loadWithdrawals();
  }, [user.id]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    if (!isActivated) {
      setStatusMsg({
        type: 'error',
        text:
          language === 'sw'
            ? 'Akaunti yako inapaswa kuwa activated ili kutoa pesa. Tafadhali bonyeza kitufe hapo juu kufungua akaunti.'
            : 'Your account must be activated to process withdrawals. Please tap the button above to activate.',
      });
      return;
    }

    setIsLoading(true);

    const res = await apiService.requestWithdrawal(user.id, {
      amountUSD: parseFloat(amountUSD),
      method,
      phoneOrAccount,
      accountName,
    });

    setIsLoading(false);

    if (res.success) {
      setStatusMsg({
        type: 'success',
        text:
          language === 'sw'
            ? 'Ombi lako la kutoa pesa limetumwa kwa mafanikio na linashughulikiwa na mfumo wetu.'
            : 'Withdrawal request submitted successfully and is being processed.',
      });
      loadWithdrawals();
    } else {
      setStatusMsg({
        type: 'error',
        text: res.error || 'Hitilafu ya kutoa fedha',
      });
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-8">
        <div className="max-w-xl space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <ArrowUpRight className="h-4 w-4" />
            <span>{t.withdraw.title}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            {language === 'sw' ? 'Kituo cha Kutoa Malipo' : 'Withdrawal Center'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {t.withdraw.subtitle}
          </p>
        </div>
      </div>

      {/* Account Activation Warning if not activated */}
      {!isActivated && (
        <div className="rounded-3xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
              <ShieldAlert className="h-6 w-6" />
            </div>

            <div className="space-y-2 flex-1">
              <h2 className="font-display text-lg sm:text-xl font-bold text-white">
                {t.withdraw.notActivatedTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                {t.withdraw.notActivatedDesc}
              </p>

              <div className="pt-2">
                <button
                  onClick={openActivationLink}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 px-6 py-3 text-xs sm:text-sm font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition cursor-pointer"
                >
                  <span>{language === 'sw' ? '👉 GUSA HAPA KUFUNGUA ACCOUNT' : '👉 TAP HERE TO OPEN ACCOUNT'}</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Withdrawal Form & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                {t.withdraw.withdrawableAmount}
              </span>
              <div className="font-display text-2xl font-black text-white">
                ${user.balanceAvailableUSD.toFixed(2)}{' '}
                <span className="text-xs text-emerald-400 font-semibold">
                  (≈ {formatTZS(user.balanceAvailableUSD)})
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-amber-400 font-bold block uppercase">
                Pending Balance:
              </span>
              <span className="text-xs font-bold text-slate-300">
                ${user.balancePendingUSD.toFixed(2)}
              </span>
            </div>
          </div>

          {statusMsg && (
            <div
              className={`mb-5 flex items-center gap-2 rounded-xl p-3.5 text-xs ${
                statusMsg.type === 'error'
                  ? 'border border-red-500/30 bg-red-950/40 text-red-300'
                  : 'border border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
              }`}
            >
              {statusMsg.type === 'error' ? (
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              ) : (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleWithdraw} className="space-y-4">
            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                {t.withdraw.selectMethod}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { id: 'mpesa', label: 'M-Pesa', flag: 'Vodacom' },
                  { id: 'tigopesa', label: 'Tigo Pesa', flag: 'Tigo' },
                  { id: 'airtel', label: 'Airtel', flag: 'Airtel' },
                  { id: 'halopesa', label: 'HaloPesa', flag: 'Halotel' },
                  { id: 'bank', label: 'Bank', flag: 'CRDB/NMB' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setMethod(item.id as any)}
                    className={`rounded-xl border p-2 text-center transition ${
                      method === item.id
                        ? 'border-emerald-500 bg-emerald-500/20 text-white font-bold'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs">{item.label}</div>
                    <div className="text-[9px] text-slate-500">{item.flag}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Account / Phone */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.withdraw.accountNumber}
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={phoneOrAccount}
                  onChange={(e) => setPhoneOrAccount(e.target.value)}
                  placeholder="0712345678 au Namba ya Akaunti ya Benki"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Account Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.withdraw.accountName}
              </label>
              <input
                type="text"
                required
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="mf. Baraka Emmanuel"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.withdraw.amountToWithdraw}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  min="10.00"
                  step="0.50"
                  required
                  value={amountUSD}
                  onChange={(e) => setAmountUSD(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-7 pr-3 py-2 text-xs font-bold text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>{t.withdraw.minNotice}</span>
                <span className="font-semibold text-emerald-400">
                  ≈ {formatTZS(parseFloat(amountUSD || '0'))}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-xs font-black uppercase text-slate-950 shadow-md hover:brightness-110 active:scale-98 transition disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>{t.withdraw.submitting}</span>
              ) : (
                <span>{t.withdraw.submitBtn}</span>
              )}
            </button>
          </form>
        </div>

        {/* Audit History Column */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
              <Clock className="h-4 w-4 text-emerald-400" />
              <h3 className="font-display text-sm font-bold text-white">
                {t.withdraw.historyTitle}
              </h3>
            </div>

            {withdrawals.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                <Wallet className="h-10 w-10 text-slate-600 mx-auto" />
                <p>{t.withdraw.emptyHistory}</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
                {withdrawals.map((w) => (
                  <div
                    key={w.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">
                        {w.methodName}: {formatTZS(w.amountUSD)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          w.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : w.status === 'rejected'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {w.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span>{w.phoneOrAccount}</span>
                      <span>{w.submittedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 text-xs text-slate-400">
            <span className="font-bold text-slate-200 block mb-1">
              Uthibitisho wa Usalama:
            </span>
            Kila muamala hukaguliwa kwa mikono au kielektroniki ili kuzuia utapeli na kuhakikisha usalama wa pesa za wanachama.
          </div>
        </div>
      </div>
    </div>
  );
};
