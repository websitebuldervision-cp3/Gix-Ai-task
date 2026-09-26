import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  X,
  Send,
  HelpCircle,
} from 'lucide-react';
import { pushService, PushStatus } from '../services/pushNotificationService';
import { useApp } from '../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { language } = useApp();
  const [status, setStatus] = useState<PushStatus | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showHowToUnblock, setShowHowToUnblock] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const refreshStatus = async () => {
    const s = await pushService.getStatus();
    setStatus(s);
  };

  useEffect(() => {
    if (isOpen) {
      refreshStatus();
      setShowHowToUnblock(false);
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isGranted = status?.permission === 'granted' && status?.isSubscribed;
  const isDenied = status?.permission === 'denied';

  const handleToggle = async () => {
    if (!status) return;
    setIsUpdating(true);
    setTestResult(null);

    try {
      if (isGranted) {
        await pushService.unsubscribeUser();
      } else if (!isDenied) {
        const res = await pushService.subscribeUser(language);
        if (res.isBlocked || res.permission === 'denied') {
          setShowHowToUnblock(true);
        }
      } else {
        setShowHowToUnblock(true);
      }
      await refreshStatus();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendTest = async () => {
    setTestResult(null);
    setIsUpdating(true);
    try {
      if (status?.subscription) {
        const res = await fetch('/api/push/send-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: status.subscription }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setTestResult('Notification imetumwa kwenye simu yako!');
        } else {
          setTestResult(data.error || 'Imeshindwa kutuma.');
        }
      }
    } catch {
      setTestResult('Hitilafu ya mtandao.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Funga"
          className="absolute top-3.5 right-3.5 p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-white">
              🔔 Notifications
            </h3>
            <p className="text-[11px] text-slate-400">
              Taarifa za simu za GIX CHATS
            </p>
          </div>
        </div>

        {/* Clean Toggle Section */}
        <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <div>
            <span className="text-xs font-semibold block text-white">
              {isGranted
                ? 'Notifications zimewashwa.'
                : isDenied
                ? 'Notifications zimezuiwa na browser.'
                : 'Washa notifications.'}
            </span>
            <span className="text-[11px] text-slate-400">
              {isGranted
                ? 'Utapokea taarifa 08:00, 13:00 na 19:00 EAT.'
                : isDenied
                ? 'Ruhusu kwenye browser site settings.'
                : 'Pata taarifa za AI Jobs kwenye simu.'}
            </span>
          </div>

          {!isDenied ? (
            <button
              onClick={handleToggle}
              disabled={isUpdating}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isGranted ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isGranted ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          ) : (
            <button
              onClick={() => setShowHowToUnblock(!showHowToUnblock)}
              className="text-[11px] font-semibold text-amber-400 underline hover:text-amber-300"
            >
              Jinsi ya kuwasha
            </button>
          )}
        </div>

        {/* How to Unblock Instructions */}
        {(showHowToUnblock || isDenied) && (
          <div className="mt-3 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-300">
              <HelpCircle className="h-3.5 w-3.5 shrink-0" />
              <span>Jinsi ya kuwasha tena kwenye Chrome:</span>
            </div>
            <p className="text-[11px] text-slate-300">
              1. Gusa alama ya <strong>🔒 (kufuli)</strong> au <strong>Site Settings</strong> juu kushoto mwa address bar.
              <br />
              2. Chagua <strong>Notifications</strong> ➔ Weka <strong>Allow</strong>.
            </p>
          </div>
        )}

        {/* Test Push Button if active */}
        {isGranted && (
          <div className="mt-3">
            <button
              onClick={handleSendTest}
              disabled={isUpdating}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
            >
              <Send className="h-3 w-3 text-emerald-400" />
              <span>Tuma Notification ya Majaribio</span>
            </button>
            {testResult && (
              <p className="mt-1.5 text-center text-[11px] text-emerald-400 font-medium">
                {testResult}
              </p>
            )}
          </div>
        )}

        {/* Bottom Close */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition"
          >
            Funga
          </button>
        </div>
      </div>
    </div>
  );
};
