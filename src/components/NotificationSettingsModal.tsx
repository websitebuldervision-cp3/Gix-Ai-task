import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellOff,
  CheckCircle2,
  AlertTriangle,
  Info,
  Volume2,
  Send,
  X,
  Smartphone,
  ShieldCheck,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { pushService, PushStatus, playChimeSound } from '../services/pushNotificationService';
import { useApp } from '../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { language } = useApp();
  const [status, setStatus] = useState<PushStatus | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [testResult, setTestResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSendingTest, setIsSendingTest] = useState(false);

  const refreshStatus = async () => {
    const s = await pushService.getStatus();
    setStatus(s);
  };

  useEffect(() => {
    if (isOpen) {
      refreshStatus();
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggle = async () => {
    if (!status) return;
    setIsUpdating(true);
    setTestResult(null);

    try {
      if (status.isSubscribed) {
        await pushService.unsubscribeUser();
      } else {
        await pushService.subscribeUser(language);
      }
      await refreshStatus();
    } catch (e) {
      console.error('Failed to toggle notifications:', e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendTest = async () => {
    setIsSendingTest(true);
    setTestResult(null);
    try {
      const res = await pushService.sendTestNotification();
      if (res.success) {
        setTestResult({
          type: 'success',
          message: res.message,
        });
      } else {
        setTestResult({
          type: 'error',
          message: res.message,
        });
      }
    } catch (e: any) {
      setTestResult({
        type: 'error',
        message: e.message || 'Hitilafu wakati wa kutuma jaribio.',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const isDenied = status?.permission === 'denied';
  const isGranted = status?.permission === 'granted' && status?.isSubscribed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-5 sm:p-6 shadow-2xl text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Funga"
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <span>🔔 Notification Settings</span>
            </h2>
            <p className="text-xs text-slate-400">
              Usimamizi wa taarifa za Web Push kwenye simu yako
            </p>
          </div>
        </div>

        {/* Current Status Card */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Hali ya Sasa:</span>
              <div className="flex items-center gap-2">
                {isGranted ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 text-xs font-bold text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    Zimewashwa (Active)
                  </span>
                ) : isDenied ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 px-2.5 py-1 text-xs font-bold text-rose-300">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                    Zimezuiwa na Browser
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 text-xs font-bold text-amber-300">
                    <Info className="h-3.5 w-3.5 text-amber-400" />
                    Bado Hazijawashwa
                  </span>
                )}
              </div>
            </div>

            {/* Toggle Switch */}
            <div>
              {!isDenied && (
                <button
                  id="btn-toggle-notification-push"
                  onClick={handleToggle}
                  disabled={isUpdating}
                  className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isGranted ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isGranted ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              )}
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-300 leading-relaxed">
            {isGranted
              ? 'Simu yako itapokea taarifa za AI Jobs hata ukiwa nje ya website au ukitumia app nyingine kama WhatsApp au TikTok.'
              : isDenied
              ? 'Umezizuia notifications kwenye browser yako. Fuata maelekezo hapa chini ili kuziwezesha tena.'
              : 'Washa notifications ili usikose nafasi za AI Jobs za kila siku na taarifa za akaunti.'}
          </p>
        </div>

        {/* Action Buttons: Test Notification & Sound */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            id="btn-send-test-push"
            onClick={handleSendTest}
            disabled={!isGranted || isSendingTest}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600/30 border border-emerald-500/50 py-2.5 px-3 text-xs font-bold text-emerald-200 hover:bg-emerald-600/50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {isSendingTest ? (
              <>
                <div className="h-3.5 w-3.5 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                <span>Inatuma jaribio...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Tuma Notification ya Majaribio</span>
              </>
            )}
          </button>

          <button
            onClick={() => playChimeSound()}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 px-3 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            <Volume2 className="h-3.5 w-3.5 text-teal-400" />
            <span>Sikia Sauti ya Notification 🔔</span>
          </button>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
              testResult.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
            }`}
          >
            {testResult.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* 3 Daily Schedules info */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/40 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200 mb-2">
            <Clock className="h-4 w-4 text-emerald-400" />
            <span>Ratiba ya Kutuma Notifications (Tanzania Time - EAT):</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-2">
              <span className="text-[10px] text-slate-400 block font-medium">🌅 Asubuhi</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">08:00 EAT</span>
            </div>
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-2">
              <span className="text-[10px] text-slate-400 block font-medium">☀️ Mchana</span>
              <span className="text-xs font-bold text-amber-400 font-mono">13:00 EAT</span>
            </div>
            <div className="rounded-lg bg-slate-900 border border-slate-800 p-2">
              <span className="text-[10px] text-slate-400 block font-medium">🌙 Jioni</span>
              <span className="text-xs font-bold text-indigo-400 font-mono">19:00 EAT</span>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-slate-400 text-center">
            Ujumbe unazungushwa kila siku ili kuleta kazi mpya na taarifa za kufungua account kwa 15,000 TSh.
          </p>
        </div>

        {/* Browser Unblock Guide (if denied or for general troubleshooting) */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-800/40 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 mb-2">
            <Smartphone className="h-4 w-4" />
            <span>Jinsi ya Kuwasha Notifications kwenye Browser:</span>
          </div>
          <div className="space-y-2 text-[11px] text-slate-300">
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <strong className="text-white block mb-0.5">Kwenye Android (Chrome):</strong>
              Gusa alama ya kufuli (🔒) au settings kushoto mwa website address ➔ Chagua <strong>"Permissions"</strong> au <strong>"Site settings"</strong> ➔ Washa <strong>"Notifications"</strong> kwa kuchagua "Allow".
            </div>
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
              <strong className="text-white block mb-0.5">Kwenye iPhone (Safari):</strong>
              Gusa alama ya Share (📤) chini ya Safari ➔ Chagua <strong>"Add to Home Screen"</strong> (Weka kwenye screen ya simu) ➔ Fungua app kutoka home screen na uruhusu notifications.
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Usalama na Faragha umehifadhiwa
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-3 py-1.5 text-slate-200 hover:bg-slate-700 transition"
          >
            Funga
          </button>
        </div>
      </div>
    </div>
  );
};
