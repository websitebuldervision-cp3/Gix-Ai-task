import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldAlert, ShieldCheck, HeartHandshake, Lock, PhoneCall } from 'lucide-react';
import { WHATSAPP_PHONE } from '../data/translations';

export const SafetyGuidelinesModal: React.FC = () => {
  const { isSafetyModalOpen, closeSafetyModal, openWhatsAppSupport, language, t } = useApp();

  if (!isSafetyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-2xl">
        <button
          onClick={closeSafetyModal}
          className="absolute right-4 top-4 rounded-xl bg-slate-800 p-1.5 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              {t.safety.title}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'sw'
                ? 'Mwongozo rasmi wa usalama, ulinzi na kanuni za jumuiya ya GIX CHATS.'
                : 'Official safety, trust and community conduct rules on GIX CHATS.'}
            </p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
            <div className="flex items-center gap-2 font-bold text-emerald-400 mb-1">
              <HeartHandshake className="h-4 w-4" />
              <span>{t.safety.rule1Title}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{t.safety.rule1Desc}</p>
          </div>

          <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-3.5">
            <div className="flex items-center gap-2 font-bold text-red-400 mb-1">
              <ShieldAlert className="h-4 w-4" />
              <span>{t.safety.rule2Title}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{t.safety.rule2Desc}</p>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5">
            <div className="flex items-center gap-2 font-bold text-amber-400 mb-1">
              <Lock className="h-4 w-4" />
              <span>{t.safety.rule3Title}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{t.safety.rule3Desc}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
            <div className="flex items-center gap-2 font-bold text-slate-200 mb-1">
              <ShieldAlert className="h-4 w-4 text-emerald-400" />
              <span>{t.safety.rule4Title}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{t.safety.rule4Desc}</p>
          </div>

          {/* Customer Care Box */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3.5 flex items-center justify-between">
            <div>
              <div className="font-bold text-white text-xs">
                {language === 'sw' ? 'Unahitaji Msaada Zaidi?' : 'Need Extra Help?'}
              </div>
              <div className="text-[11px] text-slate-400">
                Customer Care: {WHATSAPP_PHONE}
              </div>
            </div>
            <button
              onClick={openWhatsAppSupport}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
