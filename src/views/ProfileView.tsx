import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/apiService';
import { pushService } from '../services/pushNotificationService';
import {
  User,
  ShieldCheck,
  ShieldAlert,
  Bell,
  Globe,
  MessageSquare,
  Wallet,
  ExternalLink,
  PhoneCall,
  LogOut,
  Edit3,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { formatTZS, WHATSAPP_PHONE } from '../data/translations';

export const ProfileView: React.FC = () => {
  const {
    user,
    setUser,
    openActivationLink,
    openSafetyModal,
    openWhatsAppSupport,
    openRegistration,
    openLogin,
    logoutUser,
    language,
    t,
  } = useApp();

  const isActivated = user.accountStatus === 'activated';
  const [testPushMsg, setTestPushMsg] = useState<string | null>(null);
  const [isSendingPush, setIsSendingPush] = useState(false);

  const handleTestPush = async () => {
    setIsSendingPush(true);
    setTestPushMsg(null);
    try {
      const res = await pushService.sendTestNotification();
      setTestPushMsg(res.message);
    } catch (e: any) {
      setTestPushMsg(e.message || 'Hitilafu ya kutuma');
    } finally {
      setIsSendingPush(false);
    }
  };

  const handleToggleOnlineStatus = async () => {
    const nextStatus = user.status === 'online' ? 'away' : user.status === 'away' ? 'offline' : 'online';
    const updated = await apiService.updateProfile(user.id, { status: nextStatus });
    if (updated) {
      setUser(updated);
    } else {
      setUser((prev) => ({ ...prev, status: nextStatus }));
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="h-20 w-20 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
              />
              <button
                onClick={handleToggleOnlineStatus}
                title="Bofya kubadili online/away"
                className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ring-4 ring-slate-950 transition ${
                  user.status === 'online'
                    ? 'bg-emerald-500'
                    : user.status === 'away'
                    ? 'bg-amber-400'
                    : 'bg-slate-500'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {user.fullName || user.username}
                </h1>
                <span className="text-lg">{user.countryFlag}</span>
              </div>
              <div className="text-xs text-slate-400 font-medium">
                @{user.username} • {user.country}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-emerald-400 font-semibold uppercase">
                  Kiswahili: {user.kiswahiliLevel}
                </span>
                <span className="rounded-md bg-slate-800 border border-slate-700 px-2 py-0.5 text-slate-300">
                  {user.status === 'online' ? '🟢 Hewani' : user.status === 'away' ? '🟡 Hayupo Kidogo' : '⚫ Offline'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Account Badge */}
          <div className="flex flex-col sm:items-end">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              {t.profile.accountStatus}
            </div>
            {isActivated ? (
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span>{t.profile.activeStatus}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-bold text-amber-400">
                <ShieldAlert className="h-4 w-4" />
                <span>{t.profile.notActiveStatus}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="mt-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 pt-4">
            "{user.bio}"
          </p>
        )}
      </div>

      {/* Account Activation CTA Box if not activated */}
      {!isActivated && (
        <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 p-6 sm:p-7 shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>Uthibitisho wa Akaunti (Account Activation)</span>
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              {language === 'sw'
                ? 'Malipo yako ya chat yanaingia Pending. Fungua account yako kuyatoa!'
                : 'Your chat earnings are in Pending. Open your account to withdraw!'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              {language === 'sw'
                ? 'Ili uweze kuhamisha salio lako kutoka Pending kwenda Available Balance na kutoa kwa njia ya M-Pesa, Tigo Pesa, au Airtel Money, unapaswa kukamilisha activation ya akaunti yako.'
                : 'To transfer your earnings from Pending to Available Balance and withdraw via mobile money or bank, please complete your account activation.'}
            </p>

            <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                onClick={openActivationLink}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 px-6 py-3 text-xs sm:text-sm font-black uppercase text-slate-950 shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition cursor-pointer"
              >
                <span>{language === 'sw' ? '👉 GUSA HAPA KUFUNGUA ACCOUNT' : '👉 TAP HERE TO OPEN ACCOUNT'}</span>
                <ExternalLink className="h-4 w-4" />
              </button>

              <span className="text-xs font-semibold text-emerald-300/80">
                Ada ya Usajili Rasmi: TZS 15,000
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Pending Earnings
          </span>
          <div className="font-display text-lg sm:text-xl font-bold text-amber-400">
            ${user.balancePendingUSD.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400">
            ≈ {formatTZS(user.balancePendingUSD)}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Available Balance
          </span>
          <div className="font-display text-lg sm:text-xl font-bold text-emerald-400">
            ${user.balanceAvailableUSD.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400">
            ≈ {formatTZS(user.balanceAvailableUSD)}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Completed Chats
          </span>
          <div className="font-display text-lg sm:text-xl font-bold text-white">
            {user.completedChatsCount}
          </div>
          <div className="text-[10px] text-slate-400">sessions</div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Joined Date
          </span>
          <div className="font-display text-sm sm:text-base font-bold text-white">
            {user.joinedDate || '2026'}
          </div>
          <div className="text-[10px] text-slate-400">Member</div>
        </div>
      </div>

      {/* Push Notifications Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-white">
                {t.profile.notifications}
              </h3>
              <p className="text-xs text-slate-400">
                {t.profile.notificationsDesc}
              </p>
            </div>
          </div>
        </div>

        {testPushMsg && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{testPushMsg}</span>
          </div>
        )}

        <div className="pt-1">
          <button
            onClick={handleTestPush}
            disabled={isSendingPush}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-emerald-400 border border-slate-700 transition cursor-pointer"
          >
            <Bell className="h-3.5 w-3.5" />
            <span>{isSendingPush ? 'Inatuma...' : t.profile.testPushBtn}</span>
          </button>
        </div>
      </div>

      {/* Safety & Customer Care Links */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 space-y-3">
        <h3 className="font-display text-sm font-bold text-white">
          {t.profile.safetySettings}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <button
            onClick={openSafetyModal}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 text-left hover:border-slate-700 text-slate-300 hover:text-white"
          >
            <span>{t.profile.communityRules}</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
          </button>

          <button
            onClick={openSafetyModal}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 text-left hover:border-slate-700 text-slate-300 hover:text-white"
          >
            <span>{t.profile.privacyPolicy}</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
          </button>

          <button
            onClick={openSafetyModal}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 text-left hover:border-slate-700 text-slate-300 hover:text-white"
          >
            <span>{t.profile.termsOfService}</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
          </button>

          <button
            onClick={openWhatsAppSupport}
            className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-left hover:bg-emerald-950/40 text-emerald-300 font-medium"
          >
            <span className="flex items-center gap-1.5">
              <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
              <span>Customer Care ({WHATSAPP_PHONE})</span>
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Auth Switch / Logout */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={openRegistration}
            className="text-xs font-semibold text-slate-400 hover:text-emerald-400"
          >
            Jisajili Akaunti Nyingine
          </button>
          <span className="text-slate-600">•</span>
          <button
            onClick={openLogin}
            className="text-xs font-semibold text-slate-400 hover:text-emerald-400"
          >
            Ingia (Log In)
          </button>
        </div>

        <button
          onClick={logoutUser}
          className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/40 transition"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{t.profile.logout}</span>
        </button>
      </div>
    </div>
  );
};
